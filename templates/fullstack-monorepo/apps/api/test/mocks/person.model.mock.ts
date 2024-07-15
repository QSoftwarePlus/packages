import { faker } from "@faker-js/faker";
import { Person } from "database";

export const personModelMock = (): Omit<Person, 'id'> => {
    return {
        email: faker.internet.email(),
        first_name: faker.internet.userName(),
        last_name: faker.internet.userName(),
    }
}