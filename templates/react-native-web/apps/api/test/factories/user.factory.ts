import { faker } from '@faker-js/faker';
import { JwtService } from '@nestjs/jwt';
import { SessionAccessToken } from 'bff';
import { Person, Role, User } from 'database';
import { JWT_SESSION_PROVIDER_TOKEN } from 'src/modules/jwt-session/jwt-session.module';
import { roleModelMock } from 'test/mocks/role.model.mock';
import { userModelMock } from 'test/mocks/user.model.mock';
import { TestApp } from 'test/test-app';
import { roleFactory } from './role.factory';
import { personFactory } from './person.factory';

export interface UserFactoryCommand {
    app: TestApp;
    role: Pick<Role, 'id'>,
    person: Pick<Person, 'id'>,
    override?: Partial<Pick<User, 'password' | 'user_type' | 'username'>>
}

export const defaultUserFactory = async ({
    app,
}:
    Pick<UserFactoryCommand, 'app' | 'override'>) => {
    const { role } = await roleFactory({
        app,
        override: {
            type: 'default_user',
        },
    });

    const { person } = await personFactory({
        app,
    })

    const { login, user } = await userFactory({
        app,
        role: {
            id: role.id,
        },
        person,
        override: {
            user_type: 'default_user',
        },
    });

    return {
        login,
        user,
        role,
        person,
    }
}

export const userFactory = async ({
    app,
    override,
    person,
    role,
}: UserFactoryCommand) => {
    const user = await app.getDatabase().user.create({
        data: {
            role: {
                connect: {
                    id: role.id,
                },
            },
            person: {
                connect: {
                    id: person.id,
                },
            },
            ...userModelMock(),
            ...override,
        },
    });

    const login = () => {
        const jwtService = app
            .getApp()
            .get<JwtService>(JWT_SESSION_PROVIDER_TOKEN);

        const jwt = jwtService.sign({
            sub: user.id,
        } satisfies SessionAccessToken);

        return jwt;
    };

    return {
        user,
        login,
    };
};