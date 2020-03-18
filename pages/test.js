import React, { Component } from 'react';

import { LinkedList, CanvasContainer } from 'components';
import { VisualAlgo } from 'layout';
import 'styles/main.scss';

const code = `search(value) {
  let index = 0;
  let current = this.list;
  do {
    // Nếu tìm thấy thì return index
    if (current.val === value) return index;
    current = current.next;
    index++;
  } while (current)
  
  return index;
} `;

const DEFAULT_DURATION = 1000;

const animationDescription = [
  {
    state: { currentNode: 0, codeLine: 3 },
  },
  {
    state: { currentNode: 0, codeLine: 6 },
  },
  {
    state: { currentNode: 1, codeLine: 7 },
  },
  {
    state: { codeLine: 8 },
  },
  {
    state: { codeLine: 6 },
  },
  {
    state: { currentNode: 2, codeLine: 7 },
  },
  {
    state: { codeLine: 8 },
  },
  {
    state: { codeLine: 6 },
  },
];

export class Test extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [1, 2, 3, 4, 5],
      currentNode: 0,
      codeLine: 3,
    };
    this.ref = React.createRef();
  }

  consumeAnimationStep = () => {
    const { currentStep } = this.state;
    const nextStep = ~~currentStep + 1;
    if (nextStep >= animationDescription.length) return;
    const { state: stateInNextStep, duration } = animationDescription[nextStep];
    stateInNextStep &&
      this.setState({ ...stateInNextStep, currentStep: nextStep }, () =>
        setTimeout(this.consumeAnimationStep, duration || DEFAULT_DURATION),
      );
  };

  componentDidMount() {
    setTimeout(() => {
      this.consumeAnimationStep();
    }, 3000);
  }

  render() {
    const { data, currentNode, codeLine } = this.state;

    return (
      <VisualAlgo code={code} highlightLine={codeLine}>
        <CanvasContainer height={800}>
          <LinkedList
            x={100}
            y={100}
            data={data}
            currentNode={currentNode}
          />
        </CanvasContainer>
      </VisualAlgo>
    );
  }
}

export default Test;
