import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film } from './entities/film.entity';
import { CategoriesModule } from '../categories/categories.module';
import { Category } from '../categories/entities/category.entity';
import { AuthModule } from 'src/api/auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { StarWarsFilmsService } from './star-wars-films.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [FilmsController],
  providers: [FilmsService, StarWarsFilmsService],
  imports: [
    TypeOrmModule.forFeature([Film, Category]),
    CategoriesModule,
    AuthModule,
    HttpModule,
    PassportModule
  ]
})
export class FilmsModule {}
