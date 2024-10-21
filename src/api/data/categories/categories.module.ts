import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/api/auth/auth.module';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [
      TypeOrmModule.forFeature([Category]),
      HttpModule,
      PassportModule,
      AuthModule
    ],
  exports: [CategoriesService, TypeOrmModule],
})
export class CategoriesModule {}