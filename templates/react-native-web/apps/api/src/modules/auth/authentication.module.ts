import { Module } from "@nestjs/common";
import { AuthController } from "./authentication.controller";
import { AuthenticationService } from "./authentication.service";
import { DatabaseModule } from "../database/database.moduel";
import { JwtSessionModule } from "../jwt-session/jwt-session.module";
import { PersonModule } from "../person/person.module";
import { IdpModule } from "../idp/idp.module";

@Module({
    imports: [DatabaseModule, JwtSessionModule, PersonModule, IdpModule],
    providers: [AuthenticationService],
    controllers: [AuthController],
    exports: [AuthenticationService],
})
export class AuthenticationModule { }