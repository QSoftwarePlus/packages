import { faker } from '@faker-js/faker';
import { MedicalHistory, User } from 'database';
import { TestApp } from 'test/test-app';

export const medicalHistoryFactory = async ({
    app,
    override,
    user,
}: {
    app: TestApp;
    user: Pick<User, 'id'>
    override?: Partial<Pick<MedicalHistory, 'description' | 'diagnosis' | 'name' | 'observations' | 'treatments' | 'createdAt'>>
}) => {
    const medicalHistory = await app.getDatabase().medicalHistory.create({
        data: {
            name: faker.lorem.sentence(),
            description: faker.lorem.sentence(),
            diagnosis: faker.lorem.sentence(),
            observations: faker.lorem.sentence(),
            treatments: faker.lorem.sentence(),
            created_by: {
                connect: {
                    id: user.id,
                },
            },
            ...override,
        },
    });

    return {
        medicalHistory,
    };
};