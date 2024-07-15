import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import { REQUEST_USER_KEY } from 'src/constants/contants';

export const ReqUser = createParamDecorator(
  (_, executionContext: ExecutionContext) => {
    const http = executionContext.switchToHttp();
    const request: Request = http.getRequest();
    //@ts-ignore
    const user: User = request[REQUEST_USER_KEY];

    if (!user) {
      return;
    }

    return user;
  },
);
