import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { DataSource, QueryRunner, Repository, UpdateResult } from "typeorm";
import { paginate } from "nestjs-typeorm-paginate";
import { BaseModel } from "../class/base-model.class";
import { queryBuilderCriteria } from "./../utils/query-builder.utils";
import { IDataPageList } from "../tables/criteria.table";
import { decodeFilterCriteriaList } from "../utils/query-builder.utils";
import { HttpService } from "@nestjs/axios";

@Injectable()
export abstract class BaseService<T extends BaseModel> {

  _modelClass: typeof BaseModel;

  get modelClass() {
    return this._modelClass;
  }

  set modelClass(model) {
    this._modelClass = model;
  }

  constructor(
    private readonly engineRepo: Repository<T>,
    protected readonly dataSource: DataSource,
    protected readonly httpService: HttpService
  ) {}


  async listPage(q: string, relations: string[]): Promise<IDataPageList> {
    const criteria = decodeFilterCriteriaList(q);
    const queryBuilder = this.engineRepo.createQueryBuilder("c");
    const resultQuery = queryBuilderCriteria<T>(queryBuilder, q, relations);

    const resPaginate = await paginate(resultQuery, {
      page: criteria.page,
      limit: criteria.limit,
    });

    return {
      page: criteria.page,
      limit: criteria.limit,
      totalRecords: resPaginate.meta.totalItems,
      totalPages: resPaginate.meta.totalPages,
      data: resPaginate.items as T[],
    };
  }

  async findAll(q?: string): Promise<Array<T>> {
    const queryBuilder = this.engineRepo.createQueryBuilder('c');
    if (q) {
      const resultQuery = queryBuilderCriteria<T>(queryBuilder, q);
      return await resultQuery.getMany();
    }
    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<T> {
    const base = await this.engineRepo.findOneBy({id} as any);
    return base;
  }

  async create(attrs: any, connect: QueryRunner = null): Promise<T> {
    const queryRunner = connect ? connect : this.dataSource.createQueryRunner();

    try {
      if (!connect) {
        await queryRunner.startTransaction();
      }

      const payload: T = Object.assign(new this._modelClass(), attrs);
      const result = await queryRunner.manager.save(payload);

      if (!connect) {
        await queryRunner.commitTransaction();
      }

      return result;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      if (!connect) {
        await queryRunner.release();
      }
    }
  }

  async update(id: number, attrs: any, connect: QueryRunner = null): Promise<T | T[]> {
    const queryRunner = connect ? connect : this.dataSource.createQueryRunner();

    try {
      if (!connect) {
        await queryRunner.startTransaction();
      }

      const entity = await this.findOne(id);
      if (!entity) throw new InternalServerErrorException("No se encontró el registro a actualizar.");

      const payload = Object.assign(new this._modelClass(), entity, attrs);
      const result = await queryRunner.manager.save(payload);

      if (!connect) {
        await queryRunner.commitTransaction();
      }

      return result;
    } catch (error) {
      console.log(error);
      if (!connect) {
        await queryRunner.rollbackTransaction();
      }
      throw error;
    } finally {
      if (!connect) {
        await queryRunner.release();
      }
    }
  }

  async remove(id: number, connect: QueryRunner = null): Promise<any> {
    const queryRunner = connect ? connect : this.dataSource.createQueryRunner();

    try {
      if (!connect) {
        await queryRunner.startTransaction();
      }

      const entity = await this.findOne(id);
      const payload = Object.assign(new this._modelClass(), entity);
      await queryRunner.manager.softRemove(payload);

      if (!connect) {
        await queryRunner.commitTransaction();
      }

      return payload;
    } catch (error) {
      console.log("remove.catch", error, connect);
      if (!connect) {
        await queryRunner.rollbackTransaction();
      }
      throw error;
    } finally {
      if (!connect) {
        await queryRunner.release();
      }
    }
  }

  async restore(id: number): Promise<UpdateResult> {
    try {
      const isRestored = await this.engineRepo.restore(id);
      return isRestored;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async fetchData(url: string) {
    try {
      const response = await this.httpService.get(url).toPromise();
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  createQueryBuilder(alias: string) {
    return this.engineRepo.createQueryBuilder(alias);
  }
}
