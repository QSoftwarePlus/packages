import { faker } from "@faker-js/faker";
import { User } from "database";

export const userModelMock = (): Omit<User, 'id' | 'person_id' | 'role_id'> => {
    return {
        deleted_at: null,
        username: faker.internet.userName(),
        user_type: 'default_user',
        createdAt: new Date(),
        updatedAt: new Date(),
        password: faker.internet.password(),
    }
}