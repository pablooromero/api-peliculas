// src/favorites/favorites.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseService } from 'src/core';
import { HttpService } from '@nestjs/axios';
import { Favorite } from './entity/favorites.entity';
import { User } from 'src/api/auth/entities/user.entity';
import { Film } from '../films/entities/film.entity';

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

  async markAsFavorite(userId: number, filmId: number): Promise<Favorite> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const film = await this.filmsRepository.findOne({ where: { id: filmId } });

    const favorite = this.engineRepository.create({ user, film });
    return this.engineRepository.save(favorite);
  }

  async getFavorites(userId: number): Promise<Film[]> {
    const favorites = await this.engineRepository.find({
      where: { user: { id: userId } },
      relations: ['film'],
    });
    return favorites.map(favorite => favorite.film);
  }
}
