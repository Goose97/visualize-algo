const DEFAULT_DURATION = 1500;

export class Instructions {
  constructor() {
    this.instructions = [];
  }

  push(state, animationDuration = DEFAULT_DURATION) {
    this.instructions.push({
      state,
      duration: animationDuration,
    });
  }

  get() {
    return this.instructions;
  }
}

class LinkedListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

export const initLinkedList = array => {
  let head;
  let current;
  if (!array.length) return null;
  for (let val of array) {
    const newNode = new LinkedListNode(val);
    if (current) {
      current.next = newNode;
      current = current.next;
    } else {
      // first node
      head = newNode;
      current = head;
    }
  }

  return head;
};
