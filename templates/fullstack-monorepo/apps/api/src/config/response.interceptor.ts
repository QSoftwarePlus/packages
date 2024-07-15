import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, map } from 'rxjs';
import { AppError, AppServiceResponse } from 'src/types/application-service';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map(async (res: Promise<AppServiceResponse> | AppServiceResponse) => {
        let resAwaited: AppServiceResponse;

        if (res instanceof Promise) {
          resAwaited = await res;
        } else {
          resAwaited = res;
        }

        if (resAwaited instanceof AppError) {
          throw resAwaited;
        }

        return resAwaited?.data || resAwaited;
      }),
      catchError((err) => {
        throw err;
      }),
    );
  }
}
