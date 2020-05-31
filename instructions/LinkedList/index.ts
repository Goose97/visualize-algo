import { Instructions } from 'instructions';
import { initLinkedList } from './helper';
import { ObjectType } from 'types';
import { LinkedList } from 'types/ds/LinkedList';
import { LinkedListNode } from './helper';

export const linkedListInstruction = (
  data: number[],
  operation: LinkedList.Api,
  parameters: any,
) => {
  switch (operation) {
    case 'search':
      return searchInstruction(data, parameters);

    case 'insert':
      return insertInstruction(data, parameters);

    case 'delete':
      return deleteInstruction(data, parameters);

    case 'reverse':
      return reverseInstruction(data);

    case 'detectCycle':
      return detectCycleInstruction(data);

    default:
      return [];
  }
};

const searchInstruction = (
  data: number[],
  { value }: LinkedList.SearchParams,
) => {
  const linkedList = initLinkedList(data);
  let instructions = new Instructions();
  const codeLines = getCodeLine('search');

  // Start make instruction
  let current: LinkedListNode | null = linkedList;
  let found = false;
  instructions.setCodeLine(codeLines.init);
  instructions.pushActionsAndEndStep('linkedList', [
    { name: 'focus', params: [0] },
  ]);

  do {
    instructions.setCodeLine(codeLines.compare);
    instructions.endStep();

    if (current.val === value) {
      found = true;
      instructions.setCodeLine(codeLines.compareSuccess);
    } else {
      let previousKey = current.key;
      current = current.next;
      if (current) {
        instructions.setCodeLine(codeLines.moveNext);
        instructions.pushActionsAndEndStep('linkedList', [
          { name: 'visit', params: [previousKey, current.key] },
          { name: 'label', params: ['current', current.key, true] },
        ]);

        instructions.setCodeLine(codeLines.repeat);
        instructions.endStep();
      }
    }
  } while (current && !found);

  if (!found) {
    instructions.setCodeLine(codeLines.outOfLoop);
    instructions.endStep();
  }

  instructions.pushActionsAndEndStep('linkedList', [
    { name: 'resetAll', params: [] },
  ]);

  return instructions.get();
};

const insertInstruction = (
  data: number[],
  { value, index }: LinkedList.InsertParams,
) => {
  const linkedList = initLinkedList(data);
  let instructions = new Instructions();
  const codeLines = getCodeLine('insert');

  // Start make instruction
  let previousNode: LinkedListNode | undefined;
  let currentNode: LinkedListNode | null = linkedList!;
  let currentIndex = 0;

  instructions.setCodeLine(codeLines.init);
  instructions.pushActionsAndEndStep('linkedList', [
    { name: 'focus', params: [0] },
    { name: 'label', params: ['current', currentNode.key, true] },
  ]);

  while (currentIndex !== index && currentNode !== null) {
    previousNode = currentNode;
    currentNode = currentNode.next;
    currentIndex++;

    if (currentNode) {
      instructions.setCodeLine(codeLines.findPosition);
      instructions.pushActionsAndEndStep('linkedList', [
        { name: 'visit', params: [previousNode.key, currentNode.key, true] },
        { name: 'label', params: ['previous', previousNode.key, true] },
        { name: 'label', params: ['current', currentNode.key, true] },
      ]);
    }
  }

  if (index === currentIndex) {
    let newNode = new LinkedListNode(value, data.length);
    previousNode!.next = newNode;
    newNode.next = currentNode;

    instructions.setCodeLine(codeLines.insert);
    instructions.pushActionsAndEndStep('linkedList', [
      { name: 'insert', params: [value, previousNode!.key, newNode.key] },
      { name: 'changePointer', params: [previousNode!.key, newNode.key] },
      {
        name: 'changePointer',
        params: [newNode.key, currentNode?.key],
      },
    ]);
  }

  instructions.setCodeLine(codeLines.complete);
  instructions.pushActionsAndEndStep('linkedList', [
    { name: 'resetAll', params: [] },
  ]);

  return instructions.get();
};

const deleteInstruction = (
  data: number[],
  { index }: LinkedList.DeleteParams,
) => {
  const linkedList = initLinkedList(data);
  let instructions = new Instructions();
  const codeLines = getCodeLine('insert');

  // Start make instruction
  let previousNode: LinkedListNode | null = null;
  let currentNode: LinkedListNode | null = linkedList;

  instructions.setCodeLine(codeLines.init);
  instructions.pushActionsAndEndStep('linkedList', [
    { name: 'focus', params: [0] },
  ]);

  for (let i = 0; i < index; i++) {
    previousNode = currentNode;
    currentNode = currentNode!.next;

    instructions.setCodeLine(codeLines.findPosition);
    instructions.pushActionsAndEndStep('linkedList', [
      { name: 'visit', params: [previousNode?.key, currentNode?.key] },
    ]);
  }

  previousNode!.next = currentNode!.next;

  instructions.setCodeLine(codeLines.delete);
  instructions.pushActionsAndEndStep('linkedList', [
    { name: 'remove', params: [currentNode!.key] },
    {
      name: 'changePointer',
      params: [previousNode!.key, currentNode!.next && currentNode!.next.key],
    },
  ]);

  instructions.setCodeLine(codeLines.complete);
  instructions.pushActionsAndEndStep('linkedList', [
    { name: 'focus', params: [null] },
  ]);

  instructions.pushActionsAndEndStep('linkedList', [
    { name: 'resetAll', params: [] },
  ]);

  return instructions.get();
};

const reverseInstruction = (data: number[]) => {
  const linkedList = initLinkedList(data);
  let instructions = new Instructions();
  const codeLines = getCodeLine('reverse');

  // Start make instruction
  let previousNode: LinkedListNode | null = null;
  let currentNode: LinkedListNode | null = linkedList;
  let tmp;

  instructions.setCodeLine(codeLines.init);
  instructions.pushActionsAndEndStep('linkedList', [
    { name: 'focus', params: [0] },
    { name: 'label', params: ['current', 0, true] },
  ]);

  while (currentNode) {
    tmp = currentNode.next;

    instructions.setCodeLine(codeLines.reversePointer);
    instructions.pushActionsAndEndStep('linkedList', [
      {
        name: 'label',
        params: ['temp', tmp && tmp.key, true],
      },
      {
        name: 'changePointer',
        params: [currentNode.key, previousNode && previousNode.key],
      },
    ]);

    currentNode.next;
    previousNode = currentNode;
    currentNode = tmp;

    const currentNodeKey = currentNode && currentNode.key;

    instructions.setCodeLine(codeLines.moveNext);
    instructions.pushActionsAndEndStep('linkedList', [
      { name: 'focus', params: [currentNodeKey] },
      { name: 'label', params: ['current', currentNodeKey, true] },
      { name: 'label', params: ['previous', previousNode.key, true] },
    ]);
  }

  instructions.setCodeLine(codeLines.complete);
  instructions.endStep();

  instructions.pushActionsAndEndStep('linkedList', [
    { name: 'resetAll', params: [] },
  ]);

  return instructions.get();
};

const detectCycleInstruction = (data: number[]) => {
  const linkedList = initLinkedList(data);
  let instructions = new Instructions();
  const codeLines = getCodeLine('detectCycle');

  // Start make instruction
  let slow: LinkedListNode | null = linkedList;
  let fast: LinkedListNode | null = linkedList.next;
  let isLoop = false;

  instructions.setCodeLine(codeLines.init);
  instructions.pushActionsAndEndStep('linkedList', [
    { name: 'focus', params: [slow.key] },
    { name: 'focus', params: [fast?.key, true] },
    { name: 'label', params: ['slow', slow.key, true] },
    { name: 'label', params: ['fast', fast?.key, true] },
  ]);

  while (slow !== null && fast !== null) {
    instructions.setCodeLine(codeLines.checkMeet);
    instructions.endStep();

    if (slow === fast) {
      isLoop = true;
      break;
    }

    slow = slow.next;
    fast = fast.next ? fast.next.next : null;

    instructions.setCodeLine(codeLines.moveNext);
    instructions.pushActionsAndEndStep('linkedList', [
      { name: 'focus', params: [slow?.next?.key] },
      { name: 'focus', params: [fast?.next?.key, true] },
      {
        name: 'label',
        params: ['slow', slow?.next?.key, true],
      },
      {
        name: 'label',
        params: ['fast', fast?.next?.key, true],
      },
    ]);
  }

  if (!isLoop) {
    instructions.setCodeLine(codeLines.complete);
    instructions.endStep();
  }

  instructions.pushActionsAndEndStep('linkedList', [
    { name: 'resetAll', params: [] },
  ]);

  return instructions.get();
};

const getCodeLine = (operation: LinkedList.Api): ObjectType<string> => {
  switch (operation) {
    case 'search':
      return {
        init: '2-3',
        compare: '6',
        compareSuccess: '6',
        moveNext: '7-8',
        outOfLoop: '11',
      };

    case 'insert':
      return {
        init: '2-4',
        findPosition: '5-9',
        insert: '11-17',
        complete: '19',
      };

    case 'delete':
      return {
        init: '2-3',
        findPosition: '4-7',
        delete: '9',
        complete: '10',
      };

    case 'reverse':
      return {
        init: '2-4',
        reversePointer: '7-11',
        moveNext: '13-15',
        complete: '18',
      };

    case 'detectCycle':
      return {
        init: '2-3',
        checkMeet: '6-7',
        moveNext: '9-11',
        outOfLoop: '14-15',
      };

    default:
      return {};
  }
};
