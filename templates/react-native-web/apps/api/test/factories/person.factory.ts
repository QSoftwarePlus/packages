import { faker } from '@faker-js/faker';
import { Person, Role, User } from 'database';
import { personModelMock } from 'test/mocks/person.model.mock';
import { roleModelMock } from 'test/mocks/role.model.mock';
import { userModelMock } from 'test/mocks/user.model.mock';
import { TestApp } from 'test/test-app';

export const personFactory = async ({
    app,
    override,
}: {
    app: TestApp;
    override?: Partial<Pick<Person, 'email' | 'first_name' | 'last_name'>>
}) => {
    const person = await app.getDatabase().person.create({
        data: {
            ...personModelMock(),
            ...override,
        },
    }) 

    return {
        person,
    };
};