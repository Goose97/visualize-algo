import React, { Component } from 'react';
import produce from 'immer';

import {
  BinarySearchTree,
  CanvasContainer,
  Input,
  Button,
  InitLinkedListInput,
  InitBSTInput,
} from 'components';
import BinarySearchTreeHTML from '../components/BinarySearchTree/BinarySearchTreeHTML';
import { VisualAlgo } from 'layout';
import { promiseSetState } from 'utils';
import { bstInstruction, code, explanation } from 'instructions/BST';
import { BSTOperation } from 'instructions/BST/index.d';
import { BSTModel } from 'components/BinarySearchTree/index.d';
import { StepInstruction } from 'types';
import 'styles/main.scss';

interface IState {
  data?: number[];
  currentStep?: number;
  currentApi?: BSTOperation;
  stepDescription: StepInstruction[];
  autoPlay: boolean;
  parameters: any;
}

interface IProps {}

export class BinarySearchTreePage extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      parameters: {},
      stepDescription: [],
      autoPlay: false,
    };
    this.originalBSTData = null;
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

      case 'insert':
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
      case 'search':
      case 'insert':
        isButtonDisabled = value === undefined;
        break;
    }

    switch (currentApi) {
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
      await this.initBSTData(true);
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

  initBSTData = useOldData => {
    const {
      parameters: { value },
    } = this.state;
    let bstData;
    if (useOldData && this.originalBSTData) {
      bstData = this.originalBSTData;
    } else {
      if (value && value.length) bstData = value;
      // bstData = Array(5)
      //   .fill(0)
      //   .map(() => Math.round(Math.random() * 10));
      else bstData = [4, 1, 8, 0, 2, 6, 9];

      this.originalBSTData = bstData;
    }

    // Phải làm thế này để buộc component linked list unmount
    // Linked list chỉ khởi tạo state của nó 1 lần trong constructor
    return new Promise(resolve =>
      this.setState({ data: undefined }, () => {
        this.setState({ data: bstData }, () => resolve());
      }),
    );
  };

  renderHtmlElements = (
    model: BSTModel,
    wrapperElement: SVGGElement | null,
  ) => {
    setTimeout(() => {
      BinarySearchTreeHTML.renderToView({
        wrapperElement,
        model,
        onSearch: ({ key: nodeKey }) => {
          const nodeToFind = model.find(({ key }) => key === nodeKey);
          if (nodeToFind)
            this.handleExecuteApi('search', { value: nodeToFind.value });
        },
        onDelete: ({ key: nodeKey }) => {
          const nodeToFind = model.find(({ key }) => key === nodeKey);
          if (nodeToFind)
            this.handleExecuteApi('delete', { value: nodeToFind.value });
        },
      });
    }, 0);
  };

  handleExecuteApi(api: BSTOperation, params: any) {
    const stepDescription = this.generateStepDescription(api, params);
    console.log('stepDescription', stepDescription);
    this.setState({ stepDescription, autoPlay: true });
  }

  generateStepDescription(currentApi: BSTOperation, params: any) {
    const { data } = this.state;
    if (!currentApi) return [];
    return bstInstruction(data!, currentApi, params);
  }

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
      { value: 'search', label: 'Search' },
      { value: 'insert', label: 'Insert' },
    ];

    const instructions = stepDescription.map(({ actions }) => actions || []);

    return (
      <VisualAlgo
        code={code[currentApi]}
        explanation={explanation[currentApi]}
        stepDescription={stepDescription}
        onStepChange={this.handleStepChange}
        // apiList={apiList}
        // onApiChange={this.handleApiChange}
        // parameterInput={this.renderParameterInput()}
        // actionButton={this.renderActionButton()}
        autoPlay={autoPlay}
        onPlayingChange={this.handlePlayingChange}
        ref={this.ref}
      >
        {data ? (
          <CanvasContainer>
            <BinarySearchTree
              x={400}
              y={50}
              instructions={instructions}
              initialData={data}
              currentStep={currentStep}
              totalStep={stepDescription.length - 1}
              renderHtmlElements={this.renderHtmlElements}
            />
          </CanvasContainer>
        ) : (
          <div className='h-full fx-center linked-list-page__init-button'>
            <InitBSTInput
              onSubmit={bstData => this.setState({ data: bstData })}
            />
          </div>
        )}
      </VisualAlgo>
    );
  }
}

export default BinarySearchTreePage;
