// src/favorites/favorites.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { BaseService } from 'src/core';
import { HttpService } from '@nestjs/axios';
import { Favorite } from './entity/favorites.entity';
import { User } from 'src/api/auth/entities/user.entity';
import { Film } from '../films/entities/film.entity';
import { CreateFavoriteDto } from './dto/create-favorites.dto';

@Injectable()
export class FavoritesService extends BaseService<Favorite> {
  constructor(
    @InjectRepository(Favorite)
    private engineRepository: Repository<Favorite>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Film)
    private filmsRepository: Repository<Film>,
    dataSource: DataSource,
    httpService: HttpService
  ) {
    super(engineRepository, dataSource, httpService);
    this._modelClass = Favorite
  }

  async markAsFavorite(attrs: CreateFavoriteDto, connect: QueryRunner = null): Promise<Favorite> {
    const queryRunner = connect != null ? connect : this.dataSource.createQueryRunner();
    try {
      if (connect == null) {
        await queryRunner.connect();
        await queryRunner.startTransaction();
      }
      const user = await this.usersRepository.findOne({ where: { id: attrs.userId } });
      const film = await this.filmsRepository.findOne({ where: { id: attrs.filmId } });

      if (!user || !film) {
        throw new Error('User or film not found');
      }

      const payload = this.engineRepository.create({
        ...attrs,
        user,
        film,
      });

      const result = await this.engineRepository.save(payload);

      if (connect == null) {
        await queryRunner.commitTransaction();
      }
      return result;
    } catch (error) {
      console.log(error);
      if (connect == null) {
        await queryRunner.rollbackTransaction();
      }
    } finally {
      if (connect == null) {
        await queryRunner.release();
      }
    }
}

  async getFavorites(userId: number): Promise<Film[]> {
    const favorites = await this.engineRepository.find({
      where: { user: { id: userId } },
      relations: ['film'],
    });
    return favorites.map(favorite => favorite.film);
  }
}
