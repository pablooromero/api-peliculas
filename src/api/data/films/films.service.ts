import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core';
import { Film } from './entities/film.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, QueryRunner, Repository } from 'typeorm';
import { CreateFilmDto } from './dto/create-film.dto';
import { Category } from '../categories/entities/category.entity';
import { UpdateFilmDto } from './dto/update-film.dto';
import { HttpService } from '@nestjs/axios';


@Injectable()
export class FilmsService extends BaseService<Film>{
  constructor(
    @InjectRepository(Film)
    private readonly engineRepository: Repository<Film>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    dataSource: DataSource,
    httpService: HttpService
  ) {
    super(engineRepository, dataSource, httpService);
    this._modelClass = Film
  }

  async createFilm(attrs: CreateFilmDto, connect: QueryRunner = null): Promise<Film> {
    const queryRunner = connect != null ? connect : this.dataSource.createQueryRunner();

    try {

      if(connect == null){
        await queryRunner.connect();
        await queryRunner.startTransaction();
      }

      const categories = await this.categoryRepository.find({
        where:{
          id: In(attrs.categories)}
      })

      if (categories.length !== attrs.categories.length) {
        throw new Error('Some categories not found');
      }

      const payload = this.engineRepository.create({
        ...attrs,
        categories: categories
      });

      const result = await this.engineRepository.save(payload);

      if(connect == null){
        await queryRunner.commitTransaction();
      }
      return result

    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw error
    }
    finally{
      if(connect == null){
        await queryRunner.release();
      }
    }
  }

  async updateFilm(id: number, attrs: UpdateFilmDto, connect: QueryRunner = null): Promise<Film> {
    const queryRunner = connect != null ? connect : this.dataSource.createQueryRunner();
    try {

      if (connect == null) {
        await queryRunner.connect();
        await queryRunner.startTransaction();
      }

      const film = await this.engineRepository.findOne({ where: { id }, relations: ['categories'] });

      if (!film) {
        throw new Error('Film not found');
      }

      let categories = film.categories;
      if (attrs.categories && attrs.categories.length > 0) {
        categories = await this.categoryRepository.find({
          where: { id: In(attrs.categories) },
        });

        if (categories.length !== attrs.categories.length) {
          throw new Error('Some categories not found');
        }
      }

      const updatedFilm = {
        ...film,
        ...attrs,
        categories,
      };

      const result = await this.engineRepository.save(updatedFilm);

      if (connect == null) {
        await queryRunner.commitTransaction();
      }

      return result;

    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw error;

    } finally {
      if (connect == null) {
        await queryRunner.release();
      }
    }
  }
}
