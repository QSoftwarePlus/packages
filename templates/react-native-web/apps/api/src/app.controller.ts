import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { UserTypes } from './modules/auth/decorators/user-types.decorator';
import { UserTypesGuard } from './modules/auth/guards/user-types.guard';

@Controller()
@UserTypes('default_user')
@UseGuards(UserTypesGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

@Get('hello')
  async getHello() {
    return await this.appService.getHello();
  }
}
