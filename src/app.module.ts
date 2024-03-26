import { PrismaModule } from 'nestjs-prisma';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { loadModuleConfig } from '../config/configuration';
import { AuthModule } from './auth/auth.module';
import { AccessTokenGuard } from './common/guards';
import { QuestionnaireModule } from './questionnaire/questionnaire.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      load: [loadModuleConfig],
    }),
    AuthModule,
    UserModule,
    PrismaModule.forRootAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        const { user, password, port, host, name } = configService.get('db');
        return {
          prismaOptions: {
            datasources: {
              db: {
                url: `postgresql://${user}:${password}@${host}:${port}/${name}?schema=public`,
              },
            },
          },
        };
      },
      inject: [ConfigService],
    }),
    QuestionnaireModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
