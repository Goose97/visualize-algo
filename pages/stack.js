import React, { Component, cloneElement } from 'react';
import produce from 'immer';

import {
  Stack,
  CanvasContainer,
  Input,
  Button,
  InitLinkedListInput,
} from 'components';
import { VisualAlgo } from 'layout';
import { promiseSetState } from 'utils';
import { stackInstruction, code, explanation } from 'instructions/Stack';
import 'styles/main.scss';

export class StackPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      parameters: {},
      stepDescription: [],
      autoPlay: false,
    };
    this.originalStackData = null;
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

      case 'enstack':
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
      case 'enstack':
        isButtonDisabled = value === undefined;
        break;
    }

    switch (currentApi) {
      case 'init':
        return (
          <Button type='primary' onClick={() => this.initStackData(false)}>
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
      await this.initStackData(true);
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
    const stepDescription = stackInstruction(data, currentApi, parameters);
    this.setState({ stepDescription });
  }

  initStackData = useOldData => {
    const {
      parameters: { value },
    } = this.state;
    let stackData;
    if (useOldData && this.originalStackData) {
      stackData = this.originalStackData;
    } else {
      if (value && value.length) stackData = value;
      else
        stackData = Array(5)
          .fill(0)
          .map(() => Math.round(Math.random() * 10));

      this.originalStackData = stackData;
    }

    // Phải làm thế này để buộc component linked list unmount
    // Linked list chỉ khởi tạo state của nó 1 lần trong constructor
    return new Promise(resolve =>
      this.setState({ data: undefined }, () => {
        this.setState({ data: stackData }, () => resolve());
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
      { value: 'enstack', label: 'Enstack' },
      { value: 'destack', label: 'Destack' },
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
            {
              <Stack
                x={300}
                y={500}
                currentStep={currentStep}
                totalStep={stepDescription.length - 1}
                initialData={[1, 2, 3, 4, 5]}
                // initialData={data}
                instructions={instructions}
              />
            }
          </CanvasContainer>
        }
      </VisualAlgo>
    );
  }
}

export default StackPage;
