import * as bcrypt from 'bcrypt';
import { Inject, Injectable } from "@nestjs/common";
import { SessionAccessToken, AppSuccessData, RegisterUserResponseBody, RegisterUserSchema, buildError, AuthInfoResponseBody } from "@repo/bff";
import { AppSuccess, AppServiceResponse, AppError } from "src/types/application-service";
import { DatabaseService } from "../database/database.service";
import { JwtService } from "@nestjs/jwt";
import { JWT_SESSION_PROVIDER_TOKEN } from "../jwt-session/jwt-session.module";
import { PersonService } from "../person/person.service";
import { PASSWORD_SALT } from 'src/constants/contants';
import { RequestUser } from './guards/user.guard';

@Injectable()
export class AuthenticationService {

    constructor(private readonly dbService: DatabaseService,
        @Inject(JWT_SESSION_PROVIDER_TOKEN)
        private readonly jwtService: JwtService,
        private readonly personService: PersonService,
    ) { }

    async registerUser({
        body,
    }: {
        body: RegisterUserSchema;
    }): Promise<AppServiceResponse<RegisterUserResponseBody>> {
        const uniquePersonCheck = await this.personService.uniquePersonCheck({
            email: body.email,
        })

        if (uniquePersonCheck instanceof AppError) {
            return uniquePersonCheck
        }

        const role = await this.dbService.role.findFirst({
            where: {
                type: body.user_type,
                base: true,
            },
        });

        if (!role) {
            return new AppError({
                ...buildError('role_not_found'),
            })
        }

        const user = await this.dbService.user.create({
            data: {
                person: {
                    create: {
                        email: body.email,
                        first_name: body.first_name,
                        last_name: body.last_name,
                    }
                },
                role: {
                    connect: {
                        id: role.id,
                    },
                },
                username: body.username,
                user_type: body.user_type,
                password: bcrypt.hashSync(body.password, PASSWORD_SALT),
                createdAt: new Date(),
            }
        })

        const accessToken = this.jwtService.sign({
            sub: user.id!,
        } satisfies SessionAccessToken);

        return new AppSuccess({
            access_token: accessToken,
            user_type: user.user_type,
        })
    }

    async retrieveAuthInfo({
        user,
    }: {
        user: RequestUser;
    }): Promise<AppServiceResponse<AuthInfoResponseBody>> {
        const u = await this.dbService.user.findFirst({
            where: {
                id: user.id,
            },
            select: {
                createdAt: true,
                deleted_at: true,
                id: true,
                updatedAt: true,
                username: true,
                user_type: true,
                person: true,
                role: {
                    include: {
                        permissions: true,
                    },
                },
            },
        })

        if (!u) {
            return new AppError({
                ...buildError('not_found_user'),
            })
        }

        return new AppSuccess(u);
    }
}