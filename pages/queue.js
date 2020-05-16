import React, { Component, cloneElement } from 'react';
import produce from 'immer';

import {
  Queue,
  CanvasContainer,
  Input,
  Button,
  InitLinkedListInput,
} from 'components';
import { VisualAlgo } from 'layout';
import { promiseSetState } from 'utils';
import { queueInstruction, code, explanation } from 'instructions/Queue';
import 'styles/main.scss';

export class QueuePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      parameters: {},
      stepDescription: [],
      autoPlay: false,
    };
    this.originalQueueData = null;
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

      case 'enqueue':
        return (
          <span>
            Thêm vào giá trị{' '}
            <Input
              className='ml-2'
              onChange={this.handleChangeInput('value', convertToNumber)}
            />
          </span>
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
      parameters: { value },
    } = this.state;
    let isButtonDisabled;
    switch (currentApi) {
      case 'enqueue':
        isButtonDisabled = value === undefined;
        break;
    }

    switch (currentApi) {
      case 'init':
        return (
          <Button type='primary' onClick={() => this.initQueueData(false)}>
            Khởi tạo
          </Button>
        );
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
      await this.initQueueData(true);
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
    const stepDescription = queueInstruction(data, currentApi, parameters);
    this.setState({ stepDescription });
  }

  initQueueData = useOldData => {
    const {
      parameters: { value },
    } = this.state;
    let queueData;
    if (useOldData && this.originalQueueData) {
      queueData = this.originalQueueData;
    } else {
      if (value && value.length) queueData = value;
      else
        queueData = Array(5)
          .fill(0)
          .map(() => Math.round(Math.random() * 10));

      this.originalQueueData = queueData;
    }

    // Phải làm thế này để buộc component linked list unmount
    // Linked list chỉ khởi tạo state của nó 1 lần trong constructor
    return new Promise(resolve =>
      this.setState({ data: undefined }, () => {
        this.setState({ data: queueData }, () => resolve());
      }),
    );
  };

  render() {
    const {
      data,
      currentStep,
      currentApi,
      stepDescription,
      autoPlay,
    } = this.state;
    const apiList = [
      { value: 'init', label: 'Init' },
      { value: 'enqueue', label: 'Enqueue' },
      { value: 'dequeue', label: 'Dequeue' },
    ];

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
        {
          <CanvasContainer>
            {data && (
              <Queue
                x={300}
                y={100}
                currentStep={currentStep}
                totalStep={stepDescription.length - 1}
                initialData={data}
                instructions={instructions}
              />
            )}
          </CanvasContainer>
        }
      </VisualAlgo>
    );
  }
}

export default QueuePage;
