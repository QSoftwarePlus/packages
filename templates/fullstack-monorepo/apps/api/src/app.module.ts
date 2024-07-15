import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './modules/auth/authentication.module';
import { DatabaseModule } from './modules/database/database.moduel';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: ['.env.testing', '.env.development'],
  }), DatabaseModule, AuthenticationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
