import { faker } from '@faker-js/faker';
import { Tag } from 'database';
import { TestApp } from 'test/test-app';

export const tagFactory = async ({
    app,
    override,
}: {
    app: TestApp;
    override?: Partial<Tag>
}) => {
    const tag = await app.getDatabase().tag.create({
        data: {
            label: faker.internet.color(),
            value: faker.internet.displayName(),
            description: faker.lorem.sentence(),
            type: 'native',
            ...override,
        },
    });

    return {
        tag,
    };
};