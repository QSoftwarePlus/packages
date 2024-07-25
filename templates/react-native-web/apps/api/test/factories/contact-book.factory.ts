import { ContactBook, ContactBookItem, Person, User } from "database";
import { TestApp } from "test/test-app";

export const contactBookFactory = async ({
    app,
    override,
    user,
    type,
}: {
    app: TestApp;
    user: User,
    type: ContactBook['type']
    override?: Partial<ContactBook>
}) => {
    const contactBook = await app.getDatabase().contactBook.create({
        data: {
            owner_id: user.id,
            type,
            ...override,
        },
    });

    const addContactBookItem = async ({
        person,
    }: {
        person: Pick<Person, 'email' | 'first_name' | 'last_name'> & {
            user_id?: number
        },
    }) => {
        return await app.getDatabase().contactBookItem.create({
            data: {
                email: person.email,
                first_name: person.first_name,
                last_name: person.last_name,
                contact_book: {
                    connect: {
                        id: contactBook.id,
                    },
                },
                ...(person.user_id ? {
                    user: {
                        connect: {
                            id: person.user_id,
                        },

                    },
                } : {}),
            }
        });
    }

    return {
        contactBook,
        addContactBookItem,
    }
}