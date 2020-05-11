export type LinkedListOperation = 'search' | 'insert' | 'delete' | 'reverse';

export interface ILinkedListNode {
  val: number;
  next: ILinkedListNode | null;
}

export interface SearchParams {
  value: number;
}

export interface InsertParams {
  value: number;
  index: number;
}

export interface DeleteParams {
  index: number;
}
