import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseExceptionFilter } from '@nestjs/core';
import { ZodValidationException } from 'nestjs-zod';
import { AppError } from './utils/application-service';
import { Response } from 'express';
// import { DiscordChannelService } from './modules/discord/discord-channel.service';
import { error } from 'console';

export class InternalServiceError {
  errTrace: string;
  microservice: string;
  status: number;

  constructor(err: string, status: number) {
    this.microservice = 'KACH_API';
    this.errTrace = err;
    this.status = status;
  }
}

@Catch()
@Injectable()
export class AllExceptionsFilter extends BaseExceptionFilter {
  public isDev: boolean;

  constructor(
    readonly httpRef: any,
    private configService: ConfigService,
    // private discordChannelService: DiscordChannelService,
  ) {
    super(httpRef);

    this.isDev = ['dev', 'development'].includes(
      configService.get('NODE_ENV')!,
    );
  }

  private async prettyErrorNotification(exception: Error, host: ArgumentsHost) {
    if (
      exception instanceof HttpException &&
      exception.getStatus() < HttpStatus.INTERNAL_SERVER_ERROR
    ) {
      return;
    }

    const { headers, url, method, body } = host.switchToHttp().getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = new InternalServiceError(
      `${exception?.stack} - HTTP CONTEXT: ${JSON.stringify(
        {
          headers,
          url,
          method,
          body,
        },
        null,
        4,
      )}`,
      status,
    );

    const env = this.configService.get<string>('NODE_ENV');

    const errorTrace = JSON.stringify(message.errTrace, null, 4);

    const payload = `
      # Ha ocurrido un error en FEELGOOD API de tipo ${status}.
      ## En el entorno ${env}.
      ${errorTrace}
    `

    if (env === 'development') {
      console.log('Skipping Discord notification in development mode');
      console.log(payload);
      return;
    }

    // await this.discordChannelService.sendMessage(payload);
  }

  isInternalServerError(exception: any) {
    return (
      exception instanceof HttpException &&
      exception.getStatus() === HttpStatus.INTERNAL_SERVER_ERROR
    );
  }

  async catch(exception: any, host: ArgumentsHost) {
    if (exception instanceof ZodValidationException) {
      super.catch(
        new AppError({
          code: 'validation_error',
          status: HttpStatus.BAD_REQUEST,
          errors: exception.getZodError().errors,
        }),
        host,
      );
    }

    await this.prettyErrorNotification(exception, host);

    if (this.isInternalServerError(exception)) {
      const error = new AppError({
        code: 'internal_server_error',
        description: 'There is a fatal error Retry later.',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });

      super.catch(error, host);
    } else {
      super.catch(exception, host);
    }
  }
}