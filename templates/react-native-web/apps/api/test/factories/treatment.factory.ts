import { faker } from '@faker-js/faker';
import { Chromatography, Treatment, User } from 'database';
import { roleModelMock } from 'test/mocks/role.model.mock';
import { TestApp } from 'test/test-app';

export const treatmentFactory = async ({
    app,
    override,
    user,
    doctor,
}: {
    app: TestApp;
    override?: Partial<Pick<Treatment, 'name' | 'description' | 'createdAt' | 'deleted_at' | 'end_date' | 'start_date' | 'type' | 'updatedAt'>>
    user: Pick<User, 'id'>
    doctor: Pick<User, 'id'>
}) => {
    const treatment = await app.getDatabase().treatment.create({
        data: {
            name: faker.lorem.word(),
            description: faker.lorem.sentence(),
            start_date: new Date(),
            end_date: null,
            type: 'medicinal_oil',
            created_by: {
                connect: {
                    id: user.id,
                },
            },
            doctor: {
                connect: {
                    id: doctor.id,
                }
            },
            pathology: 'anxiety',
            ...override,
        },
    })

    const addChromatologyItems = async ({
        override,
    }: {
        override?: (Pick<Chromatography, 'type' | 'unit_of_measurement'> & {
            value: number
        })[]
    }) => {
        if (override?.length) {
            return await app.getDatabase().chromatography.createMany({
                data: override.map((item) => ({
                    ...item,
                    treatment_id: treatment.id,
                })),
            })
        }


        await app.getDatabase().chromatography.createMany({
            data: [
                {
                    type: 'CBD',
                    value: 30,
                    unit_of_measurement: 'mg',
                    treatment_id: treatment.id,
                },
                {
                    type: 'THC',
                    value: 40,
                    unit_of_measurement: 'mg',
                    treatment_id: treatment.id,
                },
            ],
        })
    }

    return {
        treatment,
        addChromatologyItems,
    }
};