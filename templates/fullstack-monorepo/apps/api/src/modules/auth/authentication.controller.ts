import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { RegisterUserSchema, registerUserSchema } from "@repo/bff";
import { z } from "zod";
import { AppError } from "src/types/application-service";
import { RequestBody } from "./decorators/body.decorator";
import { UserTypesGuard } from "./guards/user-types.guard";
import { UserTypes } from "./decorators/user-types.decorator";
import { LoginInterceptor } from "./interceptor/login.interceptor";
import { RequestUser, UserGuard } from "./guards/user.guard";
import { ReqUser } from "./decorators/user.decorator";

@Controller('auth')
@UserTypes('cannabis_consumer')
@UseGuards(UserTypesGuard)
export class AuthController {
    constructor(private readonly authService: AuthenticationService) { }

    @Post('/register')
    @UseInterceptors(LoginInterceptor)
    async registerUser(
        @RequestBody((data) => registerUserSchema.safeParse(data)) body: RegisterUserSchema,
    ) {
        return await this.authService.registerUser({
            body,
        });
    }

    @Get('/me')
    @UseGuards(UserGuard)
    async retrieveAuthenticationInfo(
        @ReqUser() user: RequestUser,
    ) {
        return await this.authService.retrieveAuthInfo({
            user,
        });
    }
}