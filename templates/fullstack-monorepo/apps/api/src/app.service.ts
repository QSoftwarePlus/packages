import { Injectable } from '@nestjs/common';
import { AuthInfoResponseBody } from '@repo/bff'

@Injectable()
export class AppService {
  getHello() {
    return {
      id: 1,
      type: 'cannabis-consumer',
    }
  }
}
