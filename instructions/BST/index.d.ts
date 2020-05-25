export type BSTOperation = 'search' | 'insert' | 'delete';

export interface SearchParams {
  value: number | string;
}

export interface InsertParams {
  value: number | string;
}

export interface DeleteParams {
  value: number | string;
}

export type BSTInputData = Array<number | null> | Array<number | string>;
