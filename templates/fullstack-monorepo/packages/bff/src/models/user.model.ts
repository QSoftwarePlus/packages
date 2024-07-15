import {
    type PermissionType,
    type Prisma,
    type User,
    type UserType,
} from 'database'

export type UserModel = Prisma.UserGetPayload<{
    select: {
        createdAt: true,
        deleted_at: true,
        id: true,
        updatedAt: true,
        username: true,
        user_type: true;
        person: true;
        role: {
            include: {
                permissions: true;
            };
        };
    },
}> 