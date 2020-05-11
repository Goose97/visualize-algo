import React, { Component, cloneElement } from 'react';
import produce from 'immer';

import {
  LinkedList,
  CanvasContainer,
  Input,
  Button,
  InitLinkedListInput,
} from 'components';
import { VisualAlgo } from 'layout';
import { produceFullState, promiseSetState } from 'utils';
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
      parameters: {},
      stepDescription: [],
      autoPlay: false,
    };
    this.originalLinkedListData = null;
    this.ref = React.createRef();
  }

  handleStepChange = stepIndex => {
    this.setState({ currentStep: stepIndex });
  };

  handleApiChange = newApi => {
    this.setState({ currentApi: newApi, parameters: {} });
  };

  renderParameterInput() {
    const { currentApi } = this.state;
    const convertToNumber = value => parseInt(value);
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
              onChange={this.handleChangeInput('value', convertToNumber)}
            />
          </span>
        );

      case 'delete':
        return (
          <span>
            Xoá giá trị{' '}
            <Input
              className='ml-2'
              onChange={this.handleChangeInput('index', convertToNumber)}
            />
          </span>
        );

      case 'reverse':
        return null;

      case 'insert':
        return (
          <div className='il-bl'>
            <span>
              Thêm giá trị{' '}
              <Input
                className='mx-2'
                onChange={this.handleChangeInput('value', convertToNumber)}
              />
            </span>
            <span>
              tại index{' '}
              <Input
                className='ml-2'
                onChange={this.handleChangeInput('index', convertToNumber)}
              />
            </span>
          </div>
        );

      default:
        return null;
    }
  }

  handleChangeInput = (parameterName, formatter) => value => {
    const { parameters } = this.state;
    const newParameters = produce(parameters, draft => {
      draft[parameterName] = formatter ? formatter(value) : value;
    });
    this.setState({ parameters: newParameters });
  };

  renderActionButton() {
    const {
      currentApi,
      parameters: { value, index },
    } = this.state;
    let isButtonDisabled;
    switch (currentApi) {
      case 'search':
        isButtonDisabled = value === undefined;
        break;
      case 'add':
        isButtonDisabled = value === undefined || index === undefined;
        break;
      case 'delete':
        isButtonDisabled = index === undefined;
        break;
    }

    switch (currentApi) {
      case 'init':
        return (
          <Button type='primary' onClick={() => this.initLinkedListData(false)}>
            Khởi tạo
          </Button>
        );
      case undefined:
        return null;
      default:
        return (
          <Button
            type='primary'
            onClick={this.handleStartAlgorithm}
            disabled={isButtonDisabled}
          >
            Bắt đầu
          </Button>
        );
    }
  }

  handleStartAlgorithm = async () => {
    try {
      const visualAlgo = this.ref.current;
      // Effectively reset the state
      await visualAlgo.resetState();
      await promiseSetState.call(this, {
        data: undefined,
        currentNode: undefined,
        currentStep: undefined,
      });
      await this.initLinkedListData(true);
      await this.handlePlayingChange(true);
    } catch (error) {
      console.log('error', error);
      setTimeout(this.handleStartAlgorithm, 50);
    }
  };

  handlePlayingChange = newPlayingState => {
    if (newPlayingState) this.generateStepDescription();
    this.setState({ autoPlay: newPlayingState });
  };

  generateStepDescription() {
    const { currentApi, parameters, data } = this.state;
    if (!currentApi) return [];
    const stepDescription = linkedListInstruction(data, currentApi, parameters);
    this.setState({ stepDescription });
  }

  initLinkedListData = useOldData => {
    const {
      parameters: { value },
    } = this.state;
    let linkedListData;
    if (useOldData && this.originalLinkedListData) {
      linkedListData = this.originalLinkedListData;
    } else {
      if (value && value.length) linkedListData = value;
      else
        linkedListData = Array(5)
          .fill(0)
          .map(() => Math.round(Math.random() * 10));

      this.originalLinkedListData = linkedListData;
    }

    // Phải làm thế này để buộc component linked list unmount
    // Linked list chỉ khởi tạo state của nó 1 lần trong constructor
    return new Promise(resolve =>
      this.setState({ data: undefined }, () => {
        this.setState({ data: linkedListData }, () => resolve());
      }),
    );
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
      { value: 'reverse', label: 'Reverse' },
    ];
    const fullState = produceFullState(
      stepDescription.map(({ state }) => state),
      ['data', 'currentNode'],
    );

    const instructions = stepDescription.map(({ actions }) => actions || []);

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
        ref={this.ref}
      >
        {data && (
          <CanvasContainer>
            <LinkedList
              x={100}
              y={200}
              currentStep={currentStep}
              totalStep={stepDescription.length - 1}
              instructions={instructions}
              initialData={data}
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
