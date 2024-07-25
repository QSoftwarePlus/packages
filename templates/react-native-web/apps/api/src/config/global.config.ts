import { INestApplication } from "@nestjs/common";
import { IS_DEV_ENV } from "src/constants/contants";
import { ResponseInterceptor } from "./response.interceptor";
import * as cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from '../all-exceptions-filter';
import { HttpAdapterHost } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
// import { DiscordChannelService } from "src/modules/discord/discord-channel.service";
import { bigIntToString } from "src/utils/big-int-to-string";
import { UserGuard } from "src/modules/auth/guards/user.guard";
import { DatabaseService } from "src/modules/database/database.service";
import { JwtService } from "@nestjs/jwt";
import { JWT_SESSION_PROVIDER_TOKEN } from "src/modules/jwt-session/jwt-session.module";
import { globalApiPrefix } from "bff";

(BigInt.prototype as any).toJSON = function () {
    return bigIntToString(this.toString());
};

export class GlobalConfiguration {
    readonly GLOBAL_PREFIX = globalApiPrefix;

    constructor(readonly app: INestApplication) {
        this.app.setGlobalPrefix(this.GLOBAL_PREFIX);

        const { httpAdapter } = app.get(HttpAdapterHost);

        const configService = app.get<ConfigService>(ConfigService);
        // const discordChannel = app.get<DiscordChannelService>(DiscordChannelService);

        this.app.useGlobalFilters(
            new AllExceptionsFilter(httpAdapter, configService),
        );

        this.app.useGlobalInterceptors(new ResponseInterceptor());

        this.app.enableCors({
            credentials: true,
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'x-user-type'],
        });

        this.app.use(cookieParser());

        const db = this.app.get<DatabaseService>(DatabaseService)

        const jwt = this.app.get<JwtService>(JWT_SESSION_PROVIDER_TOKEN)

        this.app.useGlobalGuards(new UserGuard(jwt, db));
    }

    listen(port?: number) {
        const p = IS_DEV_ENV ? port || 3001 : 80;

        return this.app.listen(p);
    }
}