import { HttpException } from "@nestjs/common";
import { AppErrorData } from "@repo/bff";
export interface AppSuccessType<T extends object> {
    success: boolean;
    data?: T;
    code?: string;
}
export declare class AppSuccess<T extends object> {
    readonly data: T;
    readonly code?: string | undefined;
    constructor(data: T, code?: string | undefined);
}
export declare class AppError<T extends AppErrorData = AppErrorData> extends HttpException {
    constructor(error: T);
}
export type AppServiceResponse<T extends object = {}> = AppSuccess<T> | AppError;
