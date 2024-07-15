import { Module } from "@nestjs/common";
import { AuthController } from "./authentication.controller";
import { AuthenticationService } from "./authentication.service";
import { DatabaseModule } from "../database/database.moduel";
import { JwtSessionModule } from "../jwt-session/jwt-session.module";
import { PersonModule } from "../person/person.module";

@Module({
    imports: [DatabaseModule, JwtSessionModule, PersonModule],
    providers: [AuthenticationService],
    controllers: [AuthController],
})
export class AuthenticationModule { }