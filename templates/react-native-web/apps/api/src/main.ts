import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalConfiguration } from './config/global.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configuredApp = new GlobalConfiguration(app);

  await configuredApp.app.listen(3001);

  console.log(`Application is running on: ${await configuredApp.app.getUrl()}`);
}
bootstrap();
