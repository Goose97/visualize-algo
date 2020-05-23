import React, { Component } from 'react';
import produce from 'immer';

import {
  LinkedList,
  CanvasContainer,
  Input,
  Button,
  InitLinkedListInput,
} from 'components';
import LinkedListHTML from 'components/LinkedList/LinkedListHTML';
import { VisualAlgo } from 'layout';
import { promiseSetState } from 'utils';
import {
  linkedListInstruction,
  code,
  explanation,
} from 'instructions/LinkedList';
import 'styles/main.scss';
import { LinkedListOperation } from 'instructions/LinkedList/index.d';
import { LinkedListModel } from 'components/LinkedList/index.d';
import { StepInstruction } from 'types';

interface IState {
  data?: number[];
  currentStep?: number;
  currentApi?: LinkedListOperation;
  stepDescription: StepInstruction[];
  autoPlay: boolean;
  parameters: any;
}

interface IProps {}

export class LinkedListPage extends Component<IProps, IState> {
  private originalLinkedListData: number[] | null;
  private ref: React.RefObject<any>;

  constructor(props: IProps) {
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

  initLinkedListData = (useOldData: boolean) => {
    const {
      parameters: { value },
    } = this.state;
    let linkedListData: number[];
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

  renderHtmlElements = (
    model: LinkedListModel,
    wrapperElement: SVGGElement | null,
  ) => {
    // Lỗi liên quan đến việc svg element chưa đc render đúng vị trí
    // setTimeout somehow fixed it!!
    setTimeout(() => {
      LinkedListHTML.renderToView({
        wrapperElement,
        model: model,
        onSearch: ({ key: nodeKey }) => {
          const node = model.find(({ key }) => key === nodeKey);
          this.handleExecuteApi('search', { value: node?.value });
        },
        onInsert: ({ key: nodeKey, value }) => {
          const index = model.findIndex(({ key }) => key === nodeKey);
          this.handleExecuteApi('insert', { value, index });
        },
        onDelete: ({ key: nodeKey }) => {
          const index = model.findIndex(({ key }) => key === nodeKey);
          this.handleExecuteApi('delete', { index });
        },
      });
    }, 0);
  };

  handleExecuteApi(api: LinkedListOperation, params: any) {
    const stepDescription = this.generateStepDescription(api, params);
    this.setState({ stepDescription, autoPlay: true });
  }

  handlePlayingChange = newPlayingState => {
    // if (newPlayingState) this.generateStepDescription();
    this.setState({ autoPlay: newPlayingState });
  };

  generateStepDescription(currentApi: LinkedListOperation, parameters: any) {
    const { data } = this.state;
    if (!currentApi) return [];
    return linkedListInstruction(data!, currentApi, parameters);
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
      { value: 'search', label: 'Search' },
      { value: 'insert', label: 'Insert' },
      { value: 'delete', label: 'Delete' },
      { value: 'reverse', label: 'Reverse' },
      { value: 'detectCycle', label: 'Detect Cycle' },
    ];

    const instructions = stepDescription.map(({ actions }) => actions || []);

    return (
      <VisualAlgo
        code={currentApi ? code[currentApi] : undefined}
        explanation={currentApi ? explanation[currentApi] : undefined}
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
            <LinkedList
              x={100}
              y={200}
              currentStep={currentStep!}
              totalStep={stepDescription.length - 1}
              instructions={instructions}
              initialData={data}
              renderHtmlElements={this.renderHtmlElements}
            />
          </CanvasContainer>
        ) : (
          <div className='h-full fx-center linked-list-page__init-button'>
            <InitLinkedListInput
              onSubmit={linkedListData =>
                this.setState({ data: linkedListData })
              }
            />
          </div>
        )}
      </VisualAlgo>
    );
  }
}

export default LinkedListPage;
