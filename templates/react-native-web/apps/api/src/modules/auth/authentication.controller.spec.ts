import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';
import { LoginWithIdpSchema, LoginWithUserAndPasswordSchema, RegisterUserSchema } from 'bff';
import exp from 'constants';
import * as request from 'supertest';
import { TestApp } from "test/test-app";
import { DatabaseService } from '../database/database.service';
import { JwtService } from '@nestjs/jwt';
import { JWT_SESSION_PROVIDER_TOKEN } from '../jwt-session/jwt-session.module';
import { personModelMock } from 'test/mocks/person.model.mock';
import { roleFactory } from 'test/factories/role.factory';
import { defaultUserFactory, userFactory } from 'test/factories/user.factory';
import { personFactory } from 'test/factories/person.factory';
import { PASSWORD_SALT, buildCookieName } from 'src/constants/contants';
import { IdentityProviders } from '../idp/identity-providers';

const testApp = new TestApp();
let dbService: DatabaseService
let jwtService: JwtService;

describe('authentication controller', () => {
    beforeAll(async () => {
        await testApp.BeforeAll();
        dbService = testApp.getApp().get(DatabaseService);
        jwtService = testApp
            .getApp()
            .get<JwtService>(JWT_SESSION_PROVIDER_TOKEN);

    })

    beforeEach(async () => await testApp.BeforeEach());

    describe('me', () => {
        const endpoint = '/v1/auth/me'

        test('should reject when session is invalid', async () => {
            const response = await request
                // @ts-ignore
                .agent(testApp.getHttpServer())
                .get(endpoint)
                .set('x-user-type', 'insurer');

            expect(response.body).toMatchObject({
                status: HttpStatus.UNAUTHORIZED,
                code: 'unauthorized',
            });
        })

        test('should reject when x-user-type is invalid', async () => {
            const { role } = await roleFactory({
                app: testApp,
                override: {
                    type: 'default_user',
                },
            })

            const { person } = await personFactory({
                app: testApp,
            })

            const { user, login } = await userFactory({
                app: testApp,
                override: {
                    user_type: 'default_user',
                },
                person,
                role,
            })

            const token = login()

            const response = await request
                // @ts-ignore
                .agent(testApp.getHttpServer())
                .get(endpoint)
                .set('x-user-type', 'insurer')
                .set('Authorization', `Bearer ${token}`).send({});

            expect(response.body).toMatchObject({
                status: HttpStatus.FORBIDDEN,
                code: 'invalid_x_user_type',
            });
        })

        test('should return user info when everithing is ok', async () => {
            const { role } = await roleFactory({
                app: testApp,
                override: {
                    type: 'default_user',
                },
            })

            const { person } = await personFactory({
                app: testApp,
            })

            const { user, login } = await userFactory({
                app: testApp,
                override: {
                    user_type: 'default_user',
                },
                person,
                role,
            })

            const token = login()

            const response = await request
                // @ts-ignore
                .agent(testApp.getHttpServer())
                .get(endpoint)
                .set('Authorization', `Bearer ${token}`)
                .set('x-user-type', 'default_user').send({});

            expect(response.statusCode).toBe(HttpStatus.OK)

            expect(response.body).toMatchObject({
                id: user.id,
                person: {
                    first_name: person.first_name,
                    last_name: person.last_name,
                    email: person.email,
                    has_children: person.has_children,
                    childrens: person.childrens,
                    identification: person.identification,
                    identification_type: person.identification_type,
                    sex: person.sex,
                    weight: person.weight,
                    height: person.height,
                    zip_code: person.zip_code,
                    city: person.city,
                    state: person.state,
                    country: person.country,
                    address: person.address,
                    birth_date: person.birth_date,
                    age: person.age,
                }
            });
        })
    });

    describe('login user with user and password', () => {
        const endpoint = '/v1/auth/login'

        test('should reject when user type is invalid', async () => {
            const response = await request
                // @ts-ignore
                .agent(testApp.getHttpServer())
                .post(endpoint)
                .set('x-user-type', 'insurer');

            expect(response.body).toMatchObject({
                status: HttpStatus.FORBIDDEN,
                code: 'invalid_x_user_type',
            });
        })

        test('should reject when body is invalid', async () => {
            const response = await request
                // @ts-ignore
                .agent(testApp.getHttpServer())
                .post(endpoint)
                .set('x-user-type', 'default_user').send({});

            expect(response.body).toMatchObject({
                status: HttpStatus.BAD_REQUEST,
                code: 'invalid_body',
            });
        })

        test('should reject when user not found', async () => {
            const body: LoginWithUserAndPasswordSchema = {
                email: faker.internet.email(),
                password: faker.internet.password(),
            }

            const response = await request
                // @ts-ignore
                .agent(testApp.getHttpServer())
                .post(endpoint)
                .set('x-user-type', 'default_user').send(body);

            expect(response.body).toMatchObject({
                status: HttpStatus.NOT_FOUND,
                code: 'not_found_user',
            });
        })

        test('should reject when password not match', async () => {
            const { role } = await roleFactory({
                app: testApp,
                override: {
                    type: 'default_user',
                },
            })

            const { person } = await personFactory({
                app: testApp,
            })

            const password = 'testing'

            await userFactory({
                app: testApp,
                override: {
                    user_type: 'default_user',
                    password: bcrypt.hashSync(password, PASSWORD_SALT),
                },
                person,
                role,
            })

            const body: LoginWithUserAndPasswordSchema = {
                email: person.email,
                password: 'another_password',
            }

            const response = await request
                // @ts-ignore
                .agent(testApp.getHttpServer())
                .post(endpoint)
                .set('x-user-type', 'default_user').send(body);

            expect(response.body).toMatchObject({
                status: HttpStatus.FORBIDDEN,
                code: 'invalid_user_or_password',
            });
        })

        test('should login user when everything is ok', async () => {
            const { role } = await roleFactory({
                app: testApp,
                override: {
                    type: 'default_user',
                },
            })

            const { person } = await personFactory({
                app: testApp,
            })

            const password = 'testing'

            const { user } = await userFactory({
                app: testApp,
                override: {
                    user_type: 'default_user',
                    password: bcrypt.hashSync(password, PASSWORD_SALT),
                },
                person,
                role,
            })

            const body: LoginWithUserAndPasswordSchema = {
                email: person.email,
                password: password,
            }

            const response = await request
                // @ts-ignore
                .agent(testApp.getHttpServer())
                .post(endpoint)
                .set('x-user-type', 'default_user').send(body);

            expect(response.body).toMatchObject({
                access_token: expect.any(String),
            });

            expect(response.statusCode).toBe(HttpStatus.CREATED)

            const token = jwtService.decode(response.body.access_token);

            expect(token).toMatchObject({
                sub: user.id,
            });

            const cookies = response.get('Set-Cookie')

            expect(cookies).toMatchObject(expect.arrayContaining([expect.stringContaining('default_user_session=')]))
        })
    });

    describe('register user by user and password', () => {
        const endpoint = '/v1/auth/register'

        test('should reject when user type is invalid', async () => {
            const response = await request
                // @ts-ignore
                .agent(testApp.getHttpServer())
                .post(endpoint)
                .set('x-user-type', 'insurer');

            expect(response.body).toMatchObject({
                status: HttpStatus.FORBIDDEN,
                code: 'invalid_x_user_type',
            });
        })

        test('should reject when body is invalid', async () => {
            const response = await request
                // @ts-ignore
                .agent(testApp.getHttpServer())
                .post(endpoint)
                .set('x-user-type', 'default_user');

            expect(response.body).toMatchObject({
                status: HttpStatus.BAD_REQUEST,
                code: 'invalid_body',
                errors: expect.arrayContaining([expect.objectContaining({
                    code: 'invalid_type',
                    expected: 'string',
                    received: 'undefined',
                })])
            });
        })

        test('should reject when email alread exists', async () => {
            const person = await dbService.person.create({
                data: {
                    ...personModelMock(),
                }
            })

            const body: RegisterUserSchema = {
                email: person.email,
                username: faker.internet.userName(),
                first_name: faker.internet.displayName(),
                last_name: faker.internet.userName(),
                user_type: 'default_user',
                password: faker.internet.password({
                    length: 8,
                }),
            };

            const response = await request
                // @ts-ignore
                .agent(testApp.getHttpServer())
                .post(endpoint)
                .set('x-user-type', 'default_user').send(body);

            expect(response.body).toMatchObject({
                status: HttpStatus.CONFLICT,
                code: 'person_already_exists',
            });
        })

        test('should reject when username alread exists', async () => {
            const person = await dbService.person.create({
                data: {
                    ...personModelMock(),
                }
            })

            const { role } = await roleFactory({
                app: testApp,
            })

            const { user } = await userFactory({
                app: testApp,
                person,
                role,
                override: {
                    username: faker.internet.userName(),
                }
            })

            const body: RegisterUserSchema = {
                email: faker.internet.email(),
                username: user.username!,
                first_name: faker.internet.displayName(),
                last_name: faker.internet.userName(),
                user_type: 'default_user',
                password: faker.internet.password({
                    length: 8,
                }),
            };

            const response = await request
                // @ts-ignore
                .agent(testApp.getHttpServer())
                .post(endpoint)
                .set('x-user-type', 'default_user').send(body);

            console.log('body', response.body)

            expect(response.body).toMatchObject({
                status: HttpStatus.CONFLICT,
                code: 'username_already_exists',
                errors: expect.any(Array),
            });
        })

        test('should reject when base role not exists', async () => {
            const body: RegisterUserSchema = {
                email: faker.internet.email(),
                username: faker.internet.userName(),
                first_name: faker.internet.displayName(),
                last_name: faker.internet.userName(),
                user_type: 'default_user',
                password: faker.internet.password({
                    length: 8,
                }),
            };

            const response = await request
                // @ts-ignore
                .agent(testApp.getHttpServer())
                .post(endpoint)
                .set('x-user-type', 'default_user').send(body);

            expect(response.body).toMatchObject({
                status: HttpStatus.NOT_FOUND,
                code: 'role_not_found',
            });
        })

        test('should create user when everithing is ok', async () => {
            const body: RegisterUserSchema = {
                email: faker.internet.email(),
                username: faker.internet.userName(),
                first_name: faker.internet.displayName(),
                last_name: faker.internet.userName(),
                user_type: 'default_user',
                password: faker.internet.password({
                    length: 8,
                }),
            };

            await roleFactory({
                app: testApp,
                override: {
                    type: body.user_type,
                },
            })

            const response = await request
                // @ts-ignore
                .agent(testApp.getHttpServer())
                .post(endpoint)
                .set('x-user-type', 'default_user').send(body);

            expect(response.body).toMatchObject({
                access_token: expect.any(String),
            });

            expect(response.statusCode).toBe(HttpStatus.CREATED)

            const token = jwtService.decode(response.body.access_token);

            expect(token).toMatchObject({
                sub: expect.any(Number),
            });

            const user = await dbService.user.findFirst({
                where: {
                    id: token.sub,
                },
                include: {
                    person: true,
                    role: true,
                },
            })

            expect(user).toMatchObject({
                id: token.sub,
                user_type: body.user_type,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
                deleted_at: null,
                username: body.username,
                password: expect.any(String),
                person: expect.objectContaining({
                    email: body.email,
                    first_name: body.first_name,
                    last_name: body.last_name,
                }),
                role: expect.objectContaining({
                    type: body.user_type,
                    base: true,
                })
            })

            const decryptedPassword = await bcrypt.compare(body.password, user?.password!)
            expect(decryptedPassword).toBeTruthy()

            const cookies = response.get('Set-Cookie')

            expect(cookies).toMatchObject(expect.arrayContaining([expect.stringContaining('default_user_session=')]))
        })
    })

    describe('register user by ipd', () => {
        const endpoint = '/v1/auth/register/idp'

        test('should reject when user type is invalid', async () => {
            const response = await request
                // @ts-ignore
                .agent(testApp.getHttpServer())
                .post(endpoint)
                .set('x-user-type', 'insurer');

            expect(response.body).toMatchObject({
                status: HttpStatus.FORBIDDEN,
                code: 'invalid_x_user_type',
            });
        })

        test('should reject when body is invalid', async () => {
            const response = await request
                // @ts-ignore
                .agent(testApp.getHttpServer())
                .post(endpoint)
                .set('x-user-type', 'default_user');

            expect(response.body).toMatchObject({
                status: HttpStatus.BAD_REQUEST,
                code: 'invalid_body',
                errors: expect.arrayContaining([expect.objectContaining({
                    code: 'invalid_type',
                    expected: 'string',
                    received: 'undefined',
                })])
            });
        })

        test('should reject when email already exists', async () => {
            const person = await dbService.person.create({
                data: {
                    ...personModelMock(),
                }
            })

            const body: LoginWithIdpSchema = {
                access_token: faker.internet.password(),
                provider: 'google',
                user_type: 'default_user',
            };

            jest.spyOn(IdentityProviders.prototype, 'verifyOrReject').mockResolvedValue(new Promise((resolve) => resolve({
                email: person.email,
                first_name: faker.internet.displayName(),
                last_name: faker.internet.userName(),
                profile_photo: faker.image.avatar(),
                provider_id: faker.internet.password(),
            })))

            const response = await request
                // @ts-ignore
                .agent(testApp.getHttpServer())
                .post(endpoint)
                .set('x-user-type', 'default_user').send(body);

            expect(response.body).toMatchObject({
                status: HttpStatus.CONFLICT,
                code: 'person_already_exists',
            });
        })

        test('should reject when base role not exists', async () => {
            const body: LoginWithIdpSchema = {
                access_token: faker.internet.password(),
                provider: 'google',
                user_type: 'default_user',
            };

            jest.spyOn(IdentityProviders.prototype, 'verifyOrReject').mockResolvedValue(new Promise((resolve) => resolve({
                email: faker.internet.email(),
                first_name: faker.internet.displayName(),
                last_name: faker.internet.userName(),
                profile_photo: faker.image.avatar(),
                provider_id: faker.internet.password(),
            })))

            const response = await request
                // @ts-ignore
                .agent(testApp.getHttpServer())
                .post(endpoint)
                .set('x-user-type', 'default_user').send(body);

            expect(response.body).toMatchObject({
                status: HttpStatus.NOT_FOUND,
                code: 'role_not_found',
            });
        })

        test('should create user when everithing is ok', async () => {
            const body: LoginWithIdpSchema = {
                access_token: faker.internet.password(),
                provider: 'google',
                user_type: 'default_user',
            };

            const providerResponse = {
                email: faker.internet.email(),
                first_name: faker.internet.displayName(),
                last_name: faker.internet.userName(),
                profile_photo: faker.image.avatar(),
                provider_id: faker.internet.password(),
            }

            jest.spyOn(IdentityProviders.prototype, 'verifyOrReject').mockResolvedValue(new Promise((resolve) => resolve(providerResponse)))

            await roleFactory({
                app: testApp,
                override: {
                    type: body.user_type,
                },
            })

            const response = await request
                // @ts-ignore
                .agent(testApp.getHttpServer())
                .post(endpoint)
                .set('x-user-type', 'default_user').send(body);

            expect(response.body).toMatchObject({
                access_token: expect.any(String),
            });

            expect(response.statusCode).toBe(HttpStatus.CREATED)

            const token = jwtService.decode(response.body.access_token);

            expect(token).toMatchObject({
                sub: expect.any(Number),
            });

            const user = await dbService.user.findFirst({
                where: {
                    id: token.sub,
                },
                include: {
                    person: true,
                    role: true,
                    idps: true,
                },
            })

            expect(user).toMatchObject({
                id: token.sub,
                user_type: body.user_type,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
                deleted_at: null,
                username: null,
                password: null,
                person: expect.objectContaining({
                    email: providerResponse.email,
                    first_name: providerResponse.first_name,
                    last_name: providerResponse.last_name,
                }),
                role: expect.objectContaining({
                    type: body.user_type,
                    base: true,
                }),
                idps: expect.arrayContaining([expect.objectContaining({
                    id: expect.any(Number),
                    provider_type: body.provider,
                    provider_id: providerResponse.provider_id,
                })])
            })

            const cookies = response.get('Set-Cookie')

            expect(cookies).toMatchObject(expect.arrayContaining([expect.stringContaining('default_user_session=')]))
        })
    })
});