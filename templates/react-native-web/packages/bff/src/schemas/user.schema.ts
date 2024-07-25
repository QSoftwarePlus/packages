import { Person, PersonIdentificationType, SexTypes, User, UserType } from "database";
import z from "zod";
import { requiredFieldMessage } from "../constants/api.errors.constants";
import { AppSuccessData } from "./success.schema";
import { UserModel } from "../models/user.model";
import { EnumSchema } from "./enum.schema";

export const updateUserInfoBaseSchema = z.object({
    email: z.string().email().min(1, requiredFieldMessage),
    first_name: z.string().min(1, requiredFieldMessage),
    last_name: z.string().min(1, requiredFieldMessage),
    identification_type: z.nativeEnum(PersonIdentificationType),
    identification: z.string().min(1, requiredFieldMessage),
    sex: z.nativeEnum(SexTypes),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    address: z.string().optional(),
    zip_code: z.string().optional().nullable(),
    phone: z.string().optional(),
})

export const updateUserInfoPatientSchema = updateUserInfoBaseSchema.extend({
    type: z.literal(UserType.default_user),
    occupation: z.string().optional(),
    has_children: z.boolean().default(false).nullable(),
    age: z.coerce.number().optional(),
    weight: z.coerce.number().min(1, requiredFieldMessage).max(500),
    height: z.coerce.number().min(1, requiredFieldMessage).max(2.16),
    have_reprocann: z.boolean().default(false).nullable(),
    childrens: z.coerce.number().max(15).optional(),
    birth_date: z.coerce.date().refine((date) => {
        if (!date) {
            return false;
        }

        return true
    }, {
        message: requiredFieldMessage,
    }),
})

export type UpdateUserInfoPatientRequestBody = z.infer<typeof updateUserInfoPatientSchema>

// export const updateUserInfoDoctorSchema = updateUserInfoBaseSchema.extend({
//     type: z.literal(UserType.doctor),
//     speciality: z.nativeEnum(DoctorSpecialty),
//     birth_date: z.coerce.date().refine((date) => {
//         if (!date) {
//             return false;
//         }

//         return true
//     }, {
//         message: requiredFieldMessage,
//     }),
// })

// export type UpdateUserInfoDoctorRequestBody = z.infer<typeof updateUserInfoDoctorSchema>

export const updateUserInfoSchema = z.discriminatedUnion("type", [
    updateUserInfoPatientSchema,
    // updateUserInfoDoctorSchema,
])

export type UpdateUserInfoRequestBody = UpdateUserInfoPatientRequestBody

export type UpdateUserInfoResponseBody = AppSuccessData

export type GetUserQrCodeResponseBody = {
    svg: string
}

export type UserQrCodeInfo = Pick<UserModel, 'id' | 'createdAt' | 'username'> & Pick<Person, 'email' | 'identification' | 'identification_type'>

// export const searchUsersRequestSchema = searchTagsRequestQuery.extend({
//     id: z.string().optional(),
//     type: z.nativeEnum(UserType).optional(),
// })

// export type SearchUsersRequestQuery = z.infer<typeof searchUsersRequestSchema>

interface SearchUserResponse extends Pick<EnumSchema, 'label' | 'value'> {
    id: UserModel['id']
    user_type: UserModel['user_type']
    email: UserModel['person']['email']
    firstName: UserModel['person']['first_name']
    lastName: UserModel['person']['last_name']
}

export interface SearchUsersResponseBody {
    items: SearchUserResponse[]
}