import { User } from "database";
import { TestApp } from "test/test-app";

export const doctorConsumerChat = async ({
    app,
    doctor,
    consumer,
}: {
    app: TestApp,
    consumer: Pick<User, 'id'>,
    doctor: Pick<User, 'id'>,
}) => {
    const chat = await app.getDatabase().chat.create({
        data: {
            type: 'doctor_default_user',
            users: {
                connect: [
                    { id: doctor.id },
                    { id: consumer.id },
                ],
            },
        },
    });

    return {
        chat,
    }
}