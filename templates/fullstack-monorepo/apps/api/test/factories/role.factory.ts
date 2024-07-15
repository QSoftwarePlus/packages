import { Role } from 'database';
import { roleModelMock } from 'test/mocks/role.model.mock';
import { TestApp } from 'test/test-app';

export const roleFactory = async ({
    app,
    override,
}: {
    app: TestApp;
    override?: Partial<Role>
}) => {
    const role = await app.getDatabase().role.create({
        data: {
            ...roleModelMock(),
            ...override,
        },
    });

    return {
        role,
    };
};