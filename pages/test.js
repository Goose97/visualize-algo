import React, { Component } from 'react';
import produce from 'immer';

import {
  LinkedList,
  CanvasContainer,
  Input,
  Button,
  InitLinkedListInput,
} from 'components';
import { VisualAlgo } from 'layout';
import { produceFullState } from 'utils';
import {
  linkedListInstruction,
  code,
  explanation,
} from 'instructions/LinkedList';
import 'styles/main.scss';

export class Test extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentStep: 0,
      parameters: {},
      stepDescription: [],
      autoPlay: false,
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
      case 'init':
        return (
          <span>
            Nhập giá trị của linked list{' '}
            <InitLinkedListInput onChange={this.handleChangeInput('value')} />
          </span>
        );

      case 'search':
        return (
          <span>
            Tìm kiếm giá trị{' '}
            <Input
              className='ml-2'
              onChange={this.handleChangeInput('value', value =>
                parseInt(value),
              )}
            />
          </span>
        );

      default:
        return null;
    }
  }

  renderActionButton() {
    const { currentApi } = this.state;
    switch (currentApi) {
      case 'init':
        return (
          <Button type='primary' onClick={this.initLinkedListData}>
            Khởi tạo
          </Button>
        );
      default:
        return (
          <Button type='primary' onClick={() => this.handlePlayingChange(true)}>
            Bắt đầu
          </Button>
        );
    }
  }

  handlePlayingChange = newPlayingState => {
    if (newPlayingState) {
      this.generateStepDescription();
    }
    this.setState({ autoPlay: newPlayingState });
  };

  handleChangeInput = (parameterName, formatter) => value => {
    const { parameters } = this.state;
    const newParameters = produce(parameters, draft => {
      draft[parameterName] = formatter ? formatter(value) : value;
    });
    this.setState({ parameters: newParameters });
  };

  generateStepDescription() {
    const { currentApi, parameters, data } = this.state;
    if (!currentApi) return [];
    const stepDescription = linkedListInstruction(data, currentApi, parameters);
    this.setState({ stepDescription });
  }

  initLinkedListData = () => {
    const {
      parameters: { value },
    } = this.state;
    // Phải làm thế này để buộc component linked list unmount
    // Linked list chỉ khởi tạo state của nó 1 lần trong constructor
    if (value.length)
      this.setState({ data: undefined }, () => this.setState({ data: value }));
  };

  render() {
    const {
      data,
      currentNode,
      currentStep,
      currentApi,
      stepDescription,
      autoPlay,
    } = this.state;
    const apiList = [
      { value: 'init', label: 'Init' },
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
        code={code[currentApi]}
        explanation={explanation[currentApi]}
        stepDescription={stepDescription}
        onStepChange={this.handleStepChange}
        apiList={apiList}
        onApiChange={this.handleApiChange}
        parameterInput={this.renderParameterInput()}
        actionButton={this.renderActionButton()}
        autoPlay={autoPlay}
        onPlayingChange={this.handlePlayingChange}
      >
        {data && (
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
        )}
      </VisualAlgo>
    );
  }
}

export default Test;
