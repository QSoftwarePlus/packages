import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';

export const JWT_SESSION_PROVIDER_TOKEN = 'jwtSession';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SESSION_SECRET'),
          signOptions: { expiresIn: '7d' },
        };
      },
    }),
  ],
  providers: [
    {
      provide: JWT_SESSION_PROVIDER_TOKEN,
      useExisting: JwtService,
    },
  ],
  exports: [JWT_SESSION_PROVIDER_TOKEN],
})
export class JwtSessionModule {}
