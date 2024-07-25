import * as bcrypt from 'bcrypt';
import { Inject, Injectable } from "@nestjs/common";
import { SessionAccessToken, AppSuccessData, RegisterUserResponseBody, RegisterUserSchema, buildError, AuthInfoResponseBody, LoginWithUserAndPasswordSchema, LoginUserResponseBody, LoginWithIdpSchema } from "bff";
import { AppSuccess, AppServiceResponse, AppError } from "src/utils/application-service";
import { DatabaseService } from "../database/database.service";
import { JwtService } from "@nestjs/jwt";
import { JWT_SESSION_PROVIDER_TOKEN } from "../jwt-session/jwt-session.module";
import { PASSWORD_SALT } from 'src/constants/contants';
import { RequestUser } from './guards/user.guard';
import { Prisma, User, UserType } from 'database';
import { IdentityProviders } from 'src/modules/idp/identity-providers';
import { PersonService } from '../person/person.service';

@Injectable()
export class AuthenticationService {

    constructor(private readonly dbService: DatabaseService,
        @Inject(JWT_SESSION_PROVIDER_TOKEN)
        private readonly jwtService: JwtService,
        private readonly personService: PersonService,
        private readonly identityProviders: IdentityProviders,
    ) { }

    private signAccessToken({
        user,
    }: {
        user: Pick<User, 'id'>
    }) {
        return this.jwtService.sign({
            sub: user.id!,
        } satisfies SessionAccessToken);
    }

    async registerUser({
        body,
    }: {
        body: RegisterUserSchema;
    }): Promise<AppServiceResponse<RegisterUserResponseBody>> {
        const uniquePersonCheck = await this.personService.uniquePersonCheck({
            email: body.email!,
        })

        if (uniquePersonCheck instanceof AppError) {
            return uniquePersonCheck
        }

        const uniqueUsername = await this.dbService.user.findFirst({
            where: {
                username: body.username,
            },
        })

        if (uniqueUsername) {
            return new AppError({
                ...buildError('username_already_exists'),
                errors: [`username ${body.username} already exists`],
            })
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

        const user = await this.createUser({
            user: {
                person: {
                    create: {
                        email: body.email!,
                        first_name: body.first_name!,
                        last_name: body.last_name!,
                    }
                },
                role: {
                    connect: {
                        id: role.id,
                    },
                },
                username: body.username,
                user_type: body.user_type,
                password: this.hashPassword(body.password!),
                createdAt: new Date(),
            }
        })

        const accessToken = this.signAccessToken({
            user,
        })

        return new AppSuccess({
            access_token: accessToken,
            user_type: user.user_type,
        })
    }

    async registerUserByIdp({
        body,
    }: {
        body: LoginWithIdpSchema;
    }): Promise<AppServiceResponse<RegisterUserResponseBody>> {
        const identity = await this.identityProviders.verifyOrReject(
            body.provider,
            body.access_token,
        );

        const uniquePersonCheck = await this.personService.uniquePersonCheck({
            email: identity.email!,
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

        const user = await this.createUser({
            user: {
                person: {
                    create: {
                        email: identity.email!,
                        first_name: identity.first_name!,
                        last_name: identity.last_name!,
                        profile_photo: identity.profile_photo!,
                    }
                },
                role: {
                    connect: {
                        id: role.id,
                    },
                },
                idps: {
                    create: {
                        provider_type: body.provider,
                        provider_id: identity.provider_id,
                    }
                },
                user_type: body.user_type,
                createdAt: new Date(),
            }
        })

        const accessToken = this.signAccessToken({
            user,
        })

        return new AppSuccess({
            access_token: accessToken,
            user_type: user.user_type,
        })
    }

    async loginUser({
        body,
        userType,
    }: {
        userType: UserType
        body: LoginWithUserAndPasswordSchema;
    }): Promise<AppServiceResponse<LoginUserResponseBody>> {
        const user = await this.dbService.user.findFirst({
            where: {
                person: {
                    email: body.email,
                },
                user_type: userType,
            },
        })

        if (!user) {
            return new AppError({
                ...buildError('not_found_user'),
            })
        }

        const passwordMatch = await this.checkPassword({
            hashedPassword: user.password!,
            password: body.password,
        })

        if (!passwordMatch) {
            return new AppError({
                ...buildError('invalid_user_or_password'),
            })
        }

        const accessToken = this.signAccessToken({
            user,
        })

        return new AppSuccess({
            access_token: accessToken,
            user_type: userType,
        })
    }

    async loginUserByIdp({
        body,
        userType,
    }: {
        userType: UserType
        body: LoginWithIdpSchema;
    }): Promise<AppServiceResponse<LoginUserResponseBody>> {
        const identity = await this.identityProviders.verifyOrReject(
            body.provider,
            body.access_token,
        );

        const user = await this.dbService.user.findFirst({
            where: {
                idps: {
                    some: {
                        provider_id: identity.provider_id,
                        provider_type: body.provider,
                    },
                },
                user_type: userType,
            },
        })

        if (!user) {
            return new AppError({
                ...buildError('not_found_user'),
            })
        }

        const accessToken = this.signAccessToken({
            user,
        })

        return new AppSuccess({
            access_token: accessToken,
            user_type: userType,
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

        const { person_missing_fields } = await this.personService.personHaveMissingFields({
            person: u.person,
        })

        return new AppSuccess({
            ...u,
            person_missing_fields,
        });
    }

    hashPassword(password: string) {
        try {
            return bcrypt.hashSync(password!, PASSWORD_SALT)
        } catch (error) {
            console.error('error hashing password', error)
        }
    }

    async checkPassword({
        password,
        hashedPassword,
    }: {
        password: string,
        hashedPassword: string,
    }) {
        return await bcrypt.compare(password, hashedPassword)
    }

    private async createUser({
        user,
    }: {
        user: Prisma.UserCreateArgs['data'],
    }) {
        return await this.dbService.$transaction(async (trx) => {
            const u = await trx.user.create({
                data: {
                    ...user,
                },
            })

            if (u.user_type === 'default_user') {
                return u
            }

            return u
        })
    }
}