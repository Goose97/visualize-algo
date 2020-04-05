import React, { Component } from 'react';
import produce from 'immer';

import { LinkedList, CanvasContainer, Input } from 'components';
import { VisualAlgo } from 'layout';
import { produceFullState } from 'utils';
import {
  linkedListInstruction,
  code,
  explanation,
} from 'instructions/LinkedList';
import 'styles/main.scss';

// const explanation = [
//   'Khởi tạo giá trị node hiện tại là head của linked list và giá trị index bằng 0',
//   'So sánh giá trị của node hiện tại với giá trị đang tìm kiếm',
//   'Nếu khớp thì trả về giá trị index',
//   'Nếu không thì đặt node tiếp theo (node.next) là node hiện tại và tăng index lên 1',
//   'Lặp lại bước 2',
// ];

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

export class Test extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [1, 2, 3],
      currentNode: 0,
      currentStep: 0,
      parameters: {},
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

  handleApiChange = newApi => {
    this.setState({ currentApi: newApi, parameters: {} });
  };

  renderParameterInput() {
    const { currentApi } = this.state;
    switch (currentApi) {
      case 'search':
        return (
          <span>
            Tìm kiếm giá trị{' '}
            <Input
              className='ml-2'
              onChange={this.handleChangeInput('value')}
            />
          </span>
        );
      default:
        return null;
    }
  }

  handleChangeInput = parameterName => value => {
    const { parameters } = this.state;
    return produce(parameters, draft => {
      draft[parameterName] = value;
    });
  };

  generateStepDescription() {
    const { currentApi, parameters } = this.state;
    if (!currentApi) return [];
    return linkedListInstruction([1, 2, 3], currentApi, {
      value: 2,
    });
  }

  render() {
    const { data, currentNode, currentStep, currentApi } = this.state;
    const apiList = [
      { value: 'search', label: 'Search' },
      { value: 'insert', label: 'Insert' },
      { value: 'delete', label: 'Delete' },
    ];
    const stepDescription = this.generateStepDescription();
    const fullState = produceFullState(
      stepDescription.map(({ state }) => state),
      ['data', 'currentNode'],
    );

    return (
      <VisualAlgo
        code={code[currentApi]}
        explanation={explanation[currentApi]}
        stepDescription={stepDescription}
        onStepChange={this.handleStepChange}
        apiList={apiList}
        onApiChange={this.handleApiChange}
        parameterInput={this.renderParameterInput()}
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
