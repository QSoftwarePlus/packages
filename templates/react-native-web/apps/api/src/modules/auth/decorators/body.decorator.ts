import { createParamDecorator, ExecutionContext, HttpStatus } from '@nestjs/common';
import { buildError } from 'bff';
import { Request } from 'express';
import { AppError } from 'src/utils/application-service';
import { z, ZodError } from 'zod';

export type ValidatorFn = (data: any) => { success: boolean, data?: any, error?: ZodError }

export const RequestBody = createParamDecorator(
  (validator: ValidatorFn, executionContext: ExecutionContext) => {
    const http = executionContext.switchToHttp();
    const request: Request = http.getRequest();

    try {
      const body = validator(request.body!);

      if (!body.success) {
        throw new AppError({
          ...buildError('invalid_body'),
          errors: body.error?.errors.map(error => error),
        })
      }

      return body.data;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError({
        ...buildError('invalid_body'),
        errors: error,
      })
    }
  },
);
