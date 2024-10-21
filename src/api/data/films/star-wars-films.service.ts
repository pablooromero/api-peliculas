import { Injectable } from '@nestjs/common';
import { Film } from './entities/film.entity';
import { HttpService } from '@nestjs/axios';
import { BaseService } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class StarWarsFilmsService extends BaseService<Film> {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
    protected readonly dataSource: DataSource,
    httpService: HttpService,
  ) {
    super(filmRepository, dataSource, httpService);
  }

  async onModuleInit() {
    console.log('Fetching films...Init');

    await this.fetchAndSaveFilms();
  }

  async fetchAndSaveFilms() {
    try {
      const filmsData = await this.fetchData(process.env.SWAPI_FILMS_URL);
      const films = filmsData.results;

      const existingFilms = await this.filmRepository.find();
      const existingFilmMap = new Map(existingFilms.map(film => [film.swapiId, film.id]));

      const filmEntities = films.map(film => {
        return {
          name: film.title,
          description: film.opening_crawl,
          year: film.release_date,
          director: film.director,
          swapiId: film.episode_id
        } as Film;
      });

      for (const filmEntity of filmEntities) {
        const existingFilmId = existingFilmMap.get(filmEntity.swapiId);
        if (existingFilmId) {
          await this.filmRepository.update(existingFilmId, filmEntity);
        } else {
          await this.filmRepository.save(filmEntity);
        }
      }
    } catch (error) {
      console.error('Error fetching films:', error);
      throw new Error('Error fetching films');
    }
  }

  @Cron('0 0 * *')
  async handleCron() {
    console.log('Fetching films...');
    await this.fetchAndSaveFilms();
  }
}
