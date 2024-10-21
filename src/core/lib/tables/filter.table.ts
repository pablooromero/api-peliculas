export enum FilterTypesEnum {
  GreatherThan = 'gt',
  GreatherThanEquals = 'gte',
  LowerThan = 'lt',
  LowerThanEquals = 'lte',
  Like = 'like',
  Equals = 'eq',
  NotEquals = 'neq',
  Between = 'between',
  In = "in",
  IsNull = "is_null",
  IsNotNull = "is_not_null",
}

export enum FilterTypeValue {
  NUMBER = 'number',
  STRING = 'string',
  ID = 'objectId',
  BOOLEAN = "bool",
  DATE = "date",
  DATETIME = "datetime"
}

export declare type IFilterCriterion = IFilterDefinition & IFilterAnd & IFilterOr;

interface IFilterDefinition {
  type?: FilterTypesEnum;
  property?: string;
  typeValue?: FilterTypeValue;
  value?: any | {
    from: any;
    to: any;
  };
}

interface IFilterAnd {
  and?: Array<IFilterCriterion>;
}

interface IFilterOr {
  or?: Array<IFilterCriterion>;
}

export interface IFilterOptions {
  label: string;
  value: FilterTypesEnum;
}

export interface ISortingCriterion {
  name: string;
  value: 'asc' | 'desc'
}

export interface IDatatableDtoRequest {
  draw?: string;
  start?: string;
  length?: string;
  filters?: Array<IFilterCriterion>;
}

export interface IDatatableDtoResponse {
  draw: string,
  recordsTotal: number,
  recordsFiltered: number,
  data: Array<any>
}

export interface IApiCriteria {
  page: number;
  limit: number;
  filters?: Array<IFilterCriterion>;
}