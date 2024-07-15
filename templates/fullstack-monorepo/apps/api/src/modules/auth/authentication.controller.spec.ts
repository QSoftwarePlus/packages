import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';
import { RegisterUserSchema } from '@repo/bff';
import exp from 'constants';
import * as request from 'supertest';
import { TestApp } from "test/test-app";
import { DatabaseService } from '../database/database.service';
import { JwtService } from '@nestjs/jwt';
import { JWT_SESSION_PROVIDER_TOKEN } from '../jwt-session/jwt-session.module';
import { personModelMock } from 'test/mocks/person.model.mock';
import { roleFactory } from 'test/factories/role.factory';

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
                .set('x-user-type', 'cannabis_consumer');

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
                user_type: 'cannabis_consumer',
                password: faker.internet.password({
                    length: 8,
                }),
            };

            const response = await request
                // @ts-ignore
                .agent(testApp.getHttpServer())
                .post(endpoint)
                .set('x-user-type', 'cannabis_consumer').send(body);

            expect(response.body).toMatchObject({
                status: HttpStatus.CONFLICT,
                code: 'person_already_exists',
            });
        })

        test('should reject when base role not exists', async () => {
            const body: RegisterUserSchema = {
                email: faker.internet.email(),
                username: faker.internet.userName(),
                first_name: faker.internet.displayName(),
                last_name: faker.internet.userName(),
                user_type: 'cannabis_consumer',
                password: faker.internet.password({
                    length: 8,
                }),
            };

            const response = await request
                // @ts-ignore
                .agent(testApp.getHttpServer())
                .post(endpoint)
                .set('x-user-type', 'cannabis_consumer').send(body);

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
                user_type: 'cannabis_consumer',
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
                .set('x-user-type', 'cannabis_consumer').send(body);

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

            expect(cookies).toMatchObject(expect.arrayContaining([expect.stringContaining('cannabis_consumer_session=')]))

            console.log('cookies', cookies)
        })
    })
});