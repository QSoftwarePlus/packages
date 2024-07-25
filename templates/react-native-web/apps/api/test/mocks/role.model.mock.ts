import { faker } from "@faker-js/faker";
import { Role } from "database";

export const roleModelMock = (override?: Partial<Role>): Omit<Role, 'id'> => {
    return {
        base: true,
        created_at: new Date(),
        name: faker.internet.color(),
        type: 'default_user',
        ...override,
    }
}