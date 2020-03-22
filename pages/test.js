import React, { Component } from 'react';

import { LinkedList, CanvasContainer } from 'components';
import { VisualAlgo } from 'layout';
import 'styles/main.scss';

const code = `search(value) {
  let current = this.list;
  let index = 0;
  do {
    // Nếu tìm thấy thì return index
    if (current.val === value) return index;
    current = current.next;
    index++;
  } while (current)
  
  return index;
} `;

const explanation = [
  'Khởi tạo giá trị node hiện tại là head của linked list và giá trị index bằng 0',
  'So sánh giá trị của node hiện tại với giá trị đang tìm kiếm',
  'Nếu khớp thì trả về giá trị index',
  'Nếu không thì đặt node tiếp theo (node.next) là node hiện tại và tăng index lên 1',
  'Lặp lại bước 2',
];

const DEFAULT_DURATION = 1500;

const animationDescription = [
  {
    state: { currentNode: 0, codeLine: '2-3', explanationStep: 1 },
  },
  {
    state: { codeLine: 6, explanationStep: 2 },
  },
  {
    state: { currentNode: 1, codeLine: '7-8', explanationStep: 4 },
  },
  {
    state: { explanationStep: 5 },
  },
  {
    state: { codeLine: 6, explanationStep: 2 },
  },
  {
    state: { currentNode: 2, codeLine: '7-8', explanationStep: 4 },
  },
  {
    state: { explanationStep: 5 },
  },
  {
    state: { codeLine: 6, explanationStep: 2 },
  },
  {
    state: { explanationStep: 3 },
  },
];

export class Test extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [1, 2, 3, 4, 5],
      ...animationDescription[0].state,
    };
    this.ref = React.createRef();
  }

  consumeAnimationStep = () => {
    const { currentStep } = this.state;
    const nextStep = ~~currentStep + 1;
    if (nextStep >= animationDescription.length) return;
    const { state: stateInNextStep, duration } = animationDescription[nextStep];
    stateInNextStep &&
      this.setState({ ...stateInNextStep, currentStep: nextStep }, () => {
        setTimeout(this.consumeAnimationStep, duration || DEFAULT_DURATION);
      });
  };

  componentDidMount() {
    setTimeout(() => {
      this.consumeAnimationStep();
    }, 3000);
  }

  render() {
    const { data, currentNode, codeLine, explanationStep } = this.state;
    const apiList = [
      { value: 'search', label: 'Search' },
      { value: 'insert', label: 'Insert' },
      { value: 'delete', label: 'Delete' },
    ];

    return (
      <VisualAlgo
        code={code}
        explanation={explanation}
        highlightLine={codeLine}
        apiList={apiList}
        explanationStep={explanationStep}
      >
        <CanvasContainer>
          <LinkedList x={100} y={100} data={data} currentNode={currentNode} />
        </CanvasContainer>
      </VisualAlgo>
    );
  }
}

export default Test;
