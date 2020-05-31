import React, { Component } from 'react';
import produce from 'immer';

import {
  LinkedListDS,
  CanvasContainer,
  Input,
  Button,
  InitLinkedListInput,
} from 'components';
import LinkedListHTML from 'components/LinkedList/LinkedListHTML';
import { VisualAlgo } from 'layout';
import { promiseSetState, extractInstructionFromDescription } from 'utils';
import { linkedListInstruction } from 'instructions/LinkedList';
import 'styles/main.scss';
import { LinkedList } from 'types/ds/LinkedList';
import { code, explanation } from 'codes/LinkedList';
import { StepInstruction, Action } from 'types';

interface IState {
  data?: number[];
  currentStep?: number;
  currentApi?: LinkedList.Api;
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

  handleStepChange = (stepIndex: number) => {
    this.setState({ currentStep: stepIndex });
  };

  // handleStartAlgorithm = async () => {
  //   try {
  //     const visualAlgo = this.ref.current;
  //     // Effectively reset the state
  //     await visualAlgo.resetState();
  //     await promiseSetState.call(this, {
  //       data: undefined,
  //       currentNode: undefined,
  //       currentStep: undefined,
  //     });
  //     await this.initLinkedListData(true);
  //     await this.handlePlayingChange(true);
  //   } catch (error) {
  //     console.log('error', error);
  //     setTimeout(this.handleStartAlgorithm, 50);
  //   }
  // };

  // initLinkedListData = (useOldData: boolean) => {
  //   const {
  //     parameters: { value },
  //   } = this.state;
  //   let linkedListData: number[];
  //   if (useOldData && this.originalLinkedListData) {
  //     linkedListData = this.originalLinkedListData;
  //   } else {
  //     if (value && value.length) linkedListData = value;
  //     else
  //       linkedListData = Array(5)
  //         .fill(0)
  //         .map(() => Math.round(Math.random() * 10));

  //     this.originalLinkedListData = linkedListData;
  //   }

  //   // Phải làm thế này để buộc component linked list unmount
  //   // Linked list chỉ khởi tạo state của nó 1 lần trong constructor
  //   return new Promise(resolve =>
  //     this.setState({ data: undefined }, () => {
  //       this.setState({ data: linkedListData }, () => resolve());
  //     }),
  //   );
  // };

  renderHtmlElements = (
    model: LinkedList.Model,
    wrapperElement: SVGGElement | null,
  ) => {
    // Lỗi liên quan đến việc svg element chưa đc render đúng vị trí
    // setTimeout somehow fixed it!!
    setTimeout(() => {
      LinkedListHTML.renderToView({
        wrapperElement,
        model: model,
        onSearch: ({ key: nodeKey, value }) => {
          let valueToFind = value;
          if (valueToFind === undefined) {
            const node = model.find(({ key }) => key === nodeKey);
            valueToFind = node?.value;
          }

          this.handleExecuteApi('search', { value: valueToFind });
        },
        onInsert: ({ key: nodeKey, value, index }) => {
          let indexToInsert = index;
          if (indexToInsert === undefined)
            indexToInsert = model.findIndex(({ key }) => key === nodeKey);

          this.handleExecuteApi('insert', { value, index: indexToInsert });
        },
        onDelete: ({ key: nodeKey, index }) => {
          let nodeIndexToDelete = index;
          if (nodeIndexToDelete === undefined)
            nodeIndexToDelete = model.findIndex(({ key }) => key === nodeKey);

          this.handleExecuteApi('delete', { index: nodeIndexToDelete });
        },
      });
    }, 0);
  };

  handleExecuteApi(api: LinkedList.Api, params: any) {
    const stepDescription = this.generateStepDescription(api, params);
    this.setState({ stepDescription, autoPlay: true });
  }

  generateStepDescription(currentApi: LinkedList.Api, parameters: any) {
    const { data } = this.state;
    if (!currentApi) return [];
    return linkedListInstruction(data!, currentApi, parameters);
  }

  handlePlayingChange = (newPlayingState: boolean) => {
    this.setState({ autoPlay: newPlayingState });
  };

  render() {
    const {
      data,
      currentStep,
      currentApi,
      stepDescription,
      autoPlay,
    } = this.state;
    const linkedListInstruction = extractInstructionFromDescription(
      stepDescription,
      'linkedList',
    ) as Action<LinkedList.Method>[][];

    return (
      <VisualAlgo
        code={currentApi && code[currentApi]}
        explanation={currentApi && explanation[currentApi]}
        stepDescription={stepDescription}
        onStepChange={this.handleStepChange}
        autoPlay={autoPlay}
        onPlayingChange={this.handlePlayingChange}
        ref={this.ref}
      >
        {data ? (
          <CanvasContainer>
            <LinkedListDS
              x={100}
              y={200}
              currentStep={currentStep!}
              totalStep={stepDescription.length - 1}
              instructions={linkedListInstruction}
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
