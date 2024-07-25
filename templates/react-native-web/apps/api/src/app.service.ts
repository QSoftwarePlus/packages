import { Injectable } from '@nestjs/common';
import { AuthInfoResponseBody } from 'bff'

@Injectable()
export class AppService {
  async getHello() {
    function sleep(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    await sleep(2000);  

    return {
      id: 1,
      type: 'cannabis-consumer',
    }
  }
}
