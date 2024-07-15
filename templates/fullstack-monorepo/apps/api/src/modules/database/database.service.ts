import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from 'database';
import { DB } from 'database/kysely/types';
import {
  DeduplicateJoinsPlugin,
  DummyDriver,
  Kysely,
  MysqlAdapter,
  MysqlIntrospector,
  MysqlQueryCompiler,
} from 'kysely';
import {
  PageNumberPaginationOptions,
  paginate,
} from 'prisma-extension-pagination';
import { SnakeCase } from 'type-fest';
import cursorStream from './extension/cursor-stream';

const camelToSnakeCase = <T extends string>(str: T) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`) as SnakeCase<T>;

function objectToSnakeCase<T extends object>(obj: T) {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      return {
        ...acc,
        [camelToSnakeCase(key)]: value,
      };
    },
    {} as {
      [K in keyof T as SnakeCase<K>]: T[K];
    },
  );
}

export function _paginate<
  T,
  A,
  TResult extends Prisma.Result<T, A, 'findMany'>,
>(
  this: T,
  args?: Prisma.Exact<
    A,
    Omit<Prisma.Args<T, 'findMany'>, 'cursor' | 'take' | 'skip'>
  >,
) {
  const { withCursor, withPages } = paginate.call(this, args) as ReturnType<
    typeof paginate
  >;
  return {
    withCursor,
    withPages: async (opts: PageNumberPaginationOptions) => {
      const [items, meta] = await withPages({
        ...opts,
        includePageCount: true,
      });

      const metaSnakeCase = {
        ...objectToSnakeCase(meta),
        limit: opts.limit,
      };

      return {
        items,
        meta: metaSnakeCase,
      } as {
        items: TResult;
        meta: typeof metaSnakeCase;
      };
    },
  };
}

function getExtendedClient() {
  const client = () => {
    const prisma = new PrismaClient();

    return prisma
      .$extends({
        query: {
          user: {
            async delete({ args }) {
              return await prisma.user.update({
                where: args.where,
                data: {
                  deleted_at: new Date(),
                },
              });
            },
            async findFirst({ model, operation, args, query }) {
              if (args.where) {
                if (args.where.OR) {
                  args.where.OR = args.where.OR.map((where) => {
                    if (where.deleted_at) {
                      return where;
                    }

                    return {
                      ...where,
                      deleted_at: null,
                    };
                  });

                  return query(args);
                }

                if (!args.where.deleted_at) {
                  args.where.deleted_at = null;
                }

                return query(args);
              }
            },
            async findMany({ model, operation, args, query }) {
              if (args.where) {
                args.where.deleted_at = null;
              }

              return query(args);
            },
          },
        },
        model: {
        },
      })
      .$extends(cursorStream);
  };

  return class {
    constructor() {
      return client();
    }
  } as new () => ReturnType<typeof client>;
}

@Injectable()
export class DatabaseService
  extends getExtendedClient()
  implements OnModuleInit, OnModuleDestroy {
  public queryBuilder = new Kysely<DB>({
    plugins: [new DeduplicateJoinsPlugin()],
    dialect: {
      createAdapter: () => new MysqlAdapter(),
      createDriver: () => new DummyDriver(),
      createIntrospector: (db) => new MysqlIntrospector(db),
      createQueryCompiler: () => new MysqlQueryCompiler(),
    },
  });

  async onModuleInit() {
    console.log('DATABASE URL', process.env['DB_URL']);
    await this.$connect();
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
