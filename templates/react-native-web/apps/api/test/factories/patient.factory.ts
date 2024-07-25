import { User } from "database";
import { TestApp } from "test/test-app";

export const patientFactory = async ({
    app,
    doctor,
    consumer,
}: {
    app: TestApp,
    consumer: Pick<User, 'id'>,
    doctor: Pick<User, 'id'>,
}) => {

    const patient = await app.getDatabase().patient.create({
        data: {
            status: 'pending',
            doctor: {
                connect: {
                    id: doctor.id,
                },
            },
            patient: {
                connect: {
                    id: consumer.id,
                },
            },
        },
    })

    return {
        patient,
    }
}