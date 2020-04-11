import React, { Component } from 'react';
import { pick } from 'lodash';

import { LinkedList, CanvasContainer } from 'components';
import { VisualAlgo } from 'layout';
import { produceFullState } from 'utils';
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

// const stepDescription = [
//   {
//     state: {
//       data: [1, 2, 3, 4, 5],
//       currentNode: 0,
//       codeLine: '2-3',
//       explanationStep: 1,
//     },
//   },
//   {
//     state: { codeLine: 6, explanationStep: 2 },
//   },
//   {
//     state: { currentNode: 1, codeLine: '7-8', explanationStep: 4 },
//   },
//   {
//     state: { explanationStep: 5 },
//   },
//   {
//     state: { codeLine: 6, explanationStep: 2 },
//   },
//   {
//     state: { currentNode: 2, codeLine: '7-8', explanationStep: 4 },
//   },
//   {
//     state: { explanationStep: 5 },
//   },
//   {
//     state: { codeLine: 6, explanationStep: 2 },
//   },
//   {
//     state: { explanationStep: 3 },
//   },
// ];

const stepDescription = [
  {
    state: { currentNode: 1, data: [1, 2, 3, 4, 5, 7] },
  },
  {
    state: { currentNode: 2 },
  },
  {
    state: { data: [1, 2, 7, 3, 4, 5] },
  },
];

export class Test extends Component {
  constructor(props) {
    super(props);

    const initialState = pick(stepDescription[0].state, [
      'data',
      'currentNode',
    ]);

    this.state = {
      ...initialState,
      currentStep: 0,
    };
    this.ref = React.createRef();
  }

  handleStepChange = (stateInNewStep, stepIndex) => {
    const { data, currentNode } = stateInNewStep;
    let changes = {};
    if (data) changes.data = data;
    if (currentNode) changes.currentNode = currentNode;
    this.setState({ ...changes, currentStep: stepIndex });
  };

  render() {
    const { data, currentNode, currentStep } = this.state;
    const apiList = [
      { value: 'search', label: 'Search' },
      { value: 'insert', label: 'Insert' },
      { value: 'delete', label: 'Delete' },
    ];
    const fullState = produceFullState(
      stepDescription.map(({ state }) => state),
      ['data', 'currentNode'],
    );

    return (
      <VisualAlgo
        code={code}
        explanation={explanation}
        apiList={apiList}
        stepDescription={stepDescription}
        onStepChange={this.handleStepChange}
      >
        <CanvasContainer>
          <LinkedList
            x={100}
            y={200}
            currentStep={currentStep}
            totalStep={stepDescription.length - 1}
            currentState={{
              data,
              currentNode,
            }}
            fullState={fullState}
          />
        </CanvasContainer>
      </VisualAlgo>
    );
  }
}

export default Test;
