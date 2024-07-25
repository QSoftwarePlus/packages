import { Module } from "@nestjs/common";
import { PersonService } from "./person.service";
import { DatabaseModule } from "../database/database.moduel";

@Module({
    imports: [DatabaseModule],
    providers: [PersonService],
    exports: [PersonService],
})
export class PersonModule { }