import { IFilterCriterion } from "./filter.table";

export interface IDatatableDtoRequest {
  draw: string;
  start: string;
  length: string;
  filters?: IFilterCriterion[];
}

export interface IDataPageList {
  page?: number;
  limit?: number;
  totalRecords?: number;
  totalPages?: number;
  data: Array<any>
}