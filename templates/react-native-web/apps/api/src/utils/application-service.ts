import { HttpException } from "@nestjs/common";
import { AppErrorData } from "bff";

export interface AppSuccessType<T extends object> {
    success: boolean;
    data?: T;
    code?: string;
}

export class AppSuccess<T extends object> {
    constructor(readonly data: T, readonly code?: string) {}
  }

export class AppError<
    T extends AppErrorData = AppErrorData,
> extends HttpException {
    constructor(error: T) {
        super(error, error.status);
    }
}

export type AppServiceResponse<T extends object = {}> = AppSuccess<T> | AppError