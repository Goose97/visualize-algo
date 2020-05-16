import { BaseMemoryBlockProps } from 'types';

interface BSTNodeModel extends BaseMemoryBlockProps {
  key: number;
  left: number;
  right: number;
}

type BSTModel = BSTNodeModel[];
