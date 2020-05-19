export type BSTOperation = 'search' | 'insert' | 'delete';

export interface SearchParams {
  value: number | string;
}

export interface InsertParams {
  value: number | string;
}