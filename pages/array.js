import React, { Component, cloneElement } from 'react';
import produce from 'immer';

import {
  LinkedList,
  CanvasContainer,
  Input,
  Button,
  InitLinkedListInput,
  Array as ArrayDataStructure,
} from 'components';
import { VisualAlgo } from 'layout';
import { produceFullState, promiseSetState } from 'utils';
import { arrayInstruction, code, explanation } from 'instructions/Array';
import 'styles/main.scss';

export class ArrayPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      parameters: {},
      stepDescription: [],
      autoPlay: false,
    };
    this.originalArrayData = null;
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
            Nhập giá trị của array list{' '}
            <Input onChange={this.handleChangeInput('value')} />
          </span>
        );

      case 'bubbleSort':
        return (
          <span>
            Thêm vào giá trị{' '}
            <Input
              className='ml-2'
              onChange={this.handleChangeInput('value', convertToNumber)}
            />
          </span>
        );

      case 'selectionSort':
        return (
          <span>
            Thêm vào giá trị{' '}
            <Input
              className='ml-2'
              onChange={this.handleChangeInput('value', convertToNumber)}
            />
          </span>
        );

      // case 'delete':
      //   return (
      //     <span>
      //       Xoá giá trị{' '}
      //       <Input
      //         className='ml-2'
      //         onChange={this.handleChangeInput('index', convertToNumber)}
      //       />
      //     </span>
      //   );

      // case 'insert':
      //   return (
      //     <div className='il-bl'>
      //       <span>
      //         Thêm giá trị{' '}
      //         <Input
      //           className='mx-2'
      //           onChange={this.handleChangeInput('value', convertToNumber)}
      //         />
      //       </span>
      //       <span>
      //         tại index{' '}
      //         <Input
      //           className='ml-2'
      //           onChange={this.handleChangeInput('index', convertToNumber)}
      //         />
      //       </span>
      //     </div>
      //   );

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
          <Button type='primary' onClick={() => this.initArrayData(false)}>
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
      await this.initArrayData(true);
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
    const stepDescription = arrayInstruction(data, currentApi, parameters);
    this.setState({ stepDescription });
  }

  initArrayData = useOldData => {
    const {
      parameters: { value },
    } = this.state;
    let arrayData;
    if (useOldData && this.originalArrayData) {
      arrayData = this.originalArrayData;
    } else {
      if (value && value.length) {
        arrayData = value.split(',').map(function (item) {
          return parseInt(item, 10);
        });
      } else
        arrayData = Array(10)
          .fill(0)
          .map(() => Math.round(Math.random() * 10));

      this.originalArrayData = arrayData;
    }

    // Phải làm thế này để buộc component linked list unmount
    // Linked list chỉ khởi tạo state của nó 1 lần trong constructor
    return new Promise(resolve =>
      this.setState({ data: undefined }, () => {
        this.setState({ data: arrayData }, () => resolve());
      }),
    );
  };

  filterInstruction() {
    instructions.filter(({ name }) => name !== 'createDeatchNode');
  }

  render() {
    const {
      data,
      currentNode,
      currentStep,
      currentApi,
      stepDescription,
      autoPlay,
    } = this.state;
    const blockType = 'block';
    const apiList = [
      { value: 'init', label: 'Init' },
      { value: 'bubbleSort', label: 'Bubble sort' },
      { value: 'selectionSort', label: 'Selection sort' },
      { value: 'insertionSort', label: 'Insertion sort' },
      // { value: 'insert', label: 'Insert' },
      // { value: 'delete', label: 'Delete' },
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
        {
          <CanvasContainer>
            {data && (
              <ArrayDataStructure
                blockType={blockType}
                initialData={data}
                currentStep={currentStep}
                instructions={instructions}
                totalStep={stepDescription.length - 1}
              />
            )}
          </CanvasContainer>
        }
      </VisualAlgo>
    );
  }
}

export default ArrayPage;
