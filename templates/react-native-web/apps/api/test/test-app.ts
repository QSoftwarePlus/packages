import { Test } from '@nestjs/testing';
import { HttpServer, INestApplication } from "@nestjs/common";
import { AppModule } from 'src/app.module';
import { GlobalConfiguration } from 'src/config/global.config';
import { execSync } from 'node:child_process';
import { DatabaseService } from 'src/modules/database/database.service';
import { Client } from 'pg';

export const startAppDynamicPort = async (app: INestApplication) => {
    const httpServer = await app.listen(0);

    return httpServer.address().port;
};

export const clearDB = async (dataBaseService: DatabaseService) => {
    const propertyNames = Object.getOwnPropertyNames(dataBaseService);
    const modelNames = propertyNames.filter(
        (propertyName) => !propertyName.startsWith('_'),
    );

    let tryAgain: string[] = [];

    await Promise.all(
        modelNames.map(async (model) => {
            try {
                //@ts-ignore
                await dataBaseService[model].deleteMany();
            } catch (err) {
                tryAgain.push(model);
            }
        }),
    );

    if (!tryAgain.length) {
        return;
    }

    return Promise.all(
        tryAgain.map(async (model) => {
            try {
                //@ts-ignore
                await dataBaseService[model].deleteMany();
            } catch (err) {
                tryAgain.push(model);
            }
        }),
    );
};

export class TestApp {
    private app: INestApplication<any> | undefined;
    private db: DatabaseService | undefined;
    private httpServer: HttpServer | undefined;

    public getApp() {
        return this.app!;
    }

    public getDatabase() {
        return this.db!;
    }

    public getHttpServer() {
        return this.httpServer!;
    }

    async startTestContainers() {
        try {
            const dbCredentials = {
                host: '0.0.0.0',
                port: '5432',
                user: 'admin',
                password: 'admin',
                database: 'my-db-test'
            };

            const client = new Client({
                user: dbCredentials.user,
                host: dbCredentials.host,
                database: dbCredentials.database,
                password: dbCredentials.password,
                port: Number(dbCredentials.port),
            });

            try {
                await client.connect();
            } catch (error) {
                console.error('error on connect to database', error);
            }

            const DB_NAME = this.generateRandomName();

            console.log('database created', DB_NAME);

            await client.query(`CREATE DATABASE ${DB_NAME};`);

            process.env.DATABASE_URL = `postgresql://${dbCredentials.user}:${dbCredentials.password}@${dbCredentials.host}:${dbCredentials.port}/${DB_NAME}`;

            const cmd = `DATABASE_URL=${process.env.DATABASE_URL} npm run db:push:testing -w='database'`;

            const result = execSync(cmd);

            result.toString();

            console.log('database push', result.toString());
        } catch (error) {
            console.error('error on start containers', error);
        }
        // const connection = await createConnection({
        //     port: Number(dbCredentials.port),
        //     host: dbCredentials.host,
        //     password: dbCredentials.password,
        //     user: dbCredentials.user,
        // });

        // const DB_NAME = this.generateRandomName();

        // await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME};`);

        // process.env.DATABASE_URL = `postgres://${dbCredentials.user}:${dbCredentials.password}@${dbCredentials.host}:${dbCredentials.port}/${DB_NAME}`;

        // const cmd = `DATABASE_URL=${process.env.DATABASE_URL} npm run db:push:testing -w='database'`;

        // const result = execSync(cmd);

        // result.toString();

        // console.log('database push', result.toString());
    }

    private generateRandomName() {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let dbName = '';

        // Generate a random length for the database name (between 5 and 10 characters)
        const dbNameLength = Math.floor(Math.random() * 6) + 5;

        // Generate a random character for each position in the database name
        for (let i = 0; i < dbNameLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            dbName += characters[randomIndex];
        }

        // Add a prefix to the database name to ensure it's compatible with MySQL
        dbName = 'db_' + dbName;

        return dbName;
    }

    async BeforeAll(
        options: { withSqs?: boolean } = {
            withSqs: false,
        },
    ) {
        if (this.app) {
            return this.app;
        }

        await this.startTestContainers();

        let moduleBuilder = Test.createTestingModule({
            imports: [AppModule],
        });

        const moduleRef = await moduleBuilder.compile();

        const app = moduleRef.createNestApplication();
        this.app = new GlobalConfiguration(app).app;

        await startAppDynamicPort(app);

        // jwtSessionService = app.get(JWT_SESSION_PROVIDER_TOKEN);
        const httpServer = app.getHttpServer();

        this.httpServer = httpServer;
        this.db = app.get<DatabaseService>(DatabaseService);

        return app;
    }

    async BeforeEach() {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        jest.resetAllMocks();
        await clearDB(this.db!);

        // jest
        //     .spyOn(IdentityProviders.prototype, 'verifyOrReject')
        //     .mockResolvedValueOnce(identityProviderVerifyStub());
    }

    emptyPaginationResponse() {
        return {
            items: [],
            meta: {
                limit: 10,
                is_first_page: true,
                is_last_page: true,
                current_page: 1,
                previous_page: null,
                next_page: null,
                page_count: 0,
                total_count: 0,
            },
        }
    }
}