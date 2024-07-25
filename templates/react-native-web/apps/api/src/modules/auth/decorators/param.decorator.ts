import { createParamDecorator, ExecutionContext, HttpStatus } from '@nestjs/common';
import { buildError } from 'bff';
import { Request } from 'express';
import { AppError } from 'src/utils/application-service';
import { z, ZodError } from 'zod';
import { ValidatorFn } from './body.decorator';

export const RequestParams = createParamDecorator(
  (validator: ValidatorFn, executionContext: ExecutionContext) => {
    const http = executionContext.switchToHttp();
    const request: Request = http.getRequest();
    const { success, data, error } = validator(request.params);

    if (!success) {
      throw new AppError({
        ...buildError('invalid_params'),
        errors: error?.errors.map(error => error),
      })
    }

    return data;
  },
);
