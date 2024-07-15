import { INestApplication } from "@nestjs/common";
import { IS_DEV_ENV } from "src/constants/contants";
import { ResponseInterceptor } from "./response.interceptor";
import * as cookieParser from 'cookie-parser';


export class GlobalConfiguration {
    private readonly GLOBAL_PREFIX = '/v1';

    constructor(readonly app: INestApplication) {
        this.app.setGlobalPrefix(this.GLOBAL_PREFIX);

        this.app.useGlobalInterceptors(new ResponseInterceptor());

        if (IS_DEV_ENV) {
            this.app.enableCors();
        }

        this.app.use(cookieParser());
    }
}