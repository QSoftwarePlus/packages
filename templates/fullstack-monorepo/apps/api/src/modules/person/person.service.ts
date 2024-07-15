import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { Person } from "database";
import { AppError, AppServiceResponse, AppSuccess } from "src/types/application-service";
import { buildError } from "@repo/bff";

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
}