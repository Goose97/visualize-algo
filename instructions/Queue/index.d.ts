export type QueueOperation = 'enqueue' | 'dequeue';

export interface EnqueueParams {
  value: number;
}
