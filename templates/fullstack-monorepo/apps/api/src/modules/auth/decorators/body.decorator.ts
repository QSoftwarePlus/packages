import { createParamDecorator, ExecutionContext, HttpStatus } from '@nestjs/common';
import { buildError } from '@repo/bff';
import { Request } from 'express';
import { AppError } from 'src/types/application-service';
import { z, ZodError } from 'zod';

export type ValidatorFn = (data: any) => { success: boolean, data?: any, error?: ZodError }

export const RequestBody = createParamDecorator(
  (validator: ValidatorFn, executionContext: ExecutionContext) => {
    const http = executionContext.switchToHttp();
    const request: Request = http.getRequest();
    const { success, data, error } = validator(request.body);

    if (!success) {
      throw new AppError({
        ...buildError('invalid_body'),
        errors: error?.errors.map(error => error),
      })
    }

    return request.body;
  },
);
