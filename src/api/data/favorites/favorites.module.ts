import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/api/auth/auth.module';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { Favorite } from './entity/favorites.entity';
import { User } from 'src/api/auth/entities/user.entity';
import { Film } from '../films/entities/film.entity';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService],
  imports: [
      TypeOrmModule.forFeature([Favorite, User, Film]),
      HttpModule,
      PassportModule,
      AuthModule
    ],
  exports: [FavoritesService, TypeOrmModule],
})
export class FavoritesModule {}
