import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { Person } from "database";
import { AppError, AppServiceResponse, AppSuccess } from "src/utils/application-service";
import { AuthInfoResponseBody, buildError } from "bff";

type UniquePersonCheck = Pick<Person, 'email'>

@Injectable()
export class PersonService {
    constructor(private readonly db: DatabaseService) { }

    async uniquePersonCheck({ email }: Pick<Person, 'email'>): Promise<AppServiceResponse<UniquePersonCheck>> {
        const person = await this.db.person.findFirst({
            where: {
                email: email,
            },
        });

        if (person) {
            return new AppError({
                ...buildError('person_already_exists'),
                errors: [`user email ${email} already exists`],
            })
        }

        return new AppSuccess({
            email: email,
        });
    }

    async personHaveMissingFields({
        person,
    }: {
        person: Person
    }): Promise<Pick<AuthInfoResponseBody, "person_missing_fields">> {
        const ignoreFields: (keyof Person)[] = ['has_children', 'childrens', 'have_reprocann', 'profile_photo', 'zip_code', 'childrens']

        const missing_fields = Object.keys(person).map((key: keyof Person) => {
            if (ignoreFields.includes(key)) {
                return {
                    isMissing: false,
                }
            }

            if (!person[key]) {
                return {
                    isMissing: true,
                    missing_field: key
                }

            }

            return {
                isMissing: false,
            }
        })

        return {
            person_missing_fields: {
                isMissing: missing_fields.some((field) => field.isMissing),
                missing_fields: missing_fields.filter((field) => field.isMissing).map((field) => field.missing_field as string),
            }
        }
    }
}