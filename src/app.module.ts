import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiRestModule } from './api/api.module';
import { SnakeNamingStrategy } from './core';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './api/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      ssl: process.env.STAGE === 'prod',
      extra: {
        ssl: process.env.STAGE === 'prod' ? { rejectUnauthorized: false } : null
      },
      type: 'postgres',
      host: process.env.STAGE === 'dev' ? process.env.DB_HOST : null,
      port: process.env.STAGE === 'dev' ? +process.env.DB_PORT : null,
      database: process.env.STAGE === 'dev' ? process.env.DB_NAME : null,
      username: process.env.STAGE === 'dev' ? process.env.DB_USERNAME : null,
      password: process.env.STAGE === 'dev' ? process.env.DB_PASSWORD : null,
      url: process.env.STAGE === 'prod' ? process.env.DATABASE_URL : null,
      autoLoadEntities: true,
      synchronize: true,
      namingStrategy: new SnakeNamingStrategy(),
    }),
    ApiRestModule,
    AuthModule,
    PassportModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
