export type BSTOperation = 'search' | 'insert' | 'delete';

export interface SearchParams {
  value: number | string;
}
