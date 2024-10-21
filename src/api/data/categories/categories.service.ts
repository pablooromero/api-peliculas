import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class CategoriesService extends BaseService<Category> {
  constructor(
    @InjectRepository(Category)
    private readonly engineRepository: Repository<Category>,
    dataSource: DataSource,
    httpService: HttpService
  ) {
    super(engineRepository, dataSource, httpService);
    this._modelClass = Category
  }
}
