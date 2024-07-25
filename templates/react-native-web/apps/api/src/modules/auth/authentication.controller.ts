import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { LoginWithIdpSchema, LoginWithUserAndPasswordSchema, RegisterUserSchema, loginWithIdpSchema, loginWithUserAndPassword, registerUserSchema } from "bff";
import { z } from "zod";
import { RequestBody } from "./decorators/body.decorator";
import { UserTypesGuard } from "./guards/user-types.guard";
import { RequestUserType, UserTypes } from "./decorators/user-types.decorator";
import { LoginInterceptor } from "./interceptor/login.interceptor";
import { RequestUser, UserGuard } from "./guards/user.guard";
import { ReqUser } from "./decorators/user.decorator";
import { UserType } from "database";

@Controller('auth')
@UserTypes('default_user')
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

    @Post('/register/idp')
    @UseInterceptors(LoginInterceptor)
    async registerUserByIdp(
        @RequestBody((data) => loginWithIdpSchema.safeParse(data)) body: LoginWithIdpSchema,
    ) {
        return await this.authService.registerUserByIdp({
            body,
        });
    }

    @Post('/login')
    @UseInterceptors(LoginInterceptor)
    async loginUser(
        @RequestUserType() userType: UserType,
        @RequestBody((data) => loginWithUserAndPassword.safeParse(data)) body: LoginWithUserAndPasswordSchema,
    ) {
        return await this.authService.loginUser({
            body,
            userType,
        });
    }

    @Post('/login/idp')
    @UseInterceptors(LoginInterceptor)
    async loginUserByIdp(
        @RequestUserType() userType: UserType,
        @RequestBody((data) => loginWithIdpSchema.safeParse(data)) body: LoginWithIdpSchema,
    ) {
        return await this.authService.loginUserByIdp({
            body,
            userType,
        });
    }

    @Get('/me')
    async retrieveAuthenticationInfo(
        @ReqUser() user: RequestUser,
    ) {
        return await this.authService.retrieveAuthInfo({
            user,
        });
    }
}