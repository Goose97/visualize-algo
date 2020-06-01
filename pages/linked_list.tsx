import React, { Component } from 'react';

import { LinkedListDS, CanvasContainer, InitArrayInput } from 'components';
import { VisualAlgo } from 'layout';
import { extractInstructionFromDescription } from 'utils';
import { linkedListInstruction } from 'instructions/LinkedList';
import { LinkedList } from 'types/ds/LinkedList';
import { code, explanation } from 'codes/LinkedList';
import { StepInstruction, Action, ObjectType } from 'types';

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
  private ref: React.RefObject<any>;

  constructor(props: IProps) {
    super(props);

    this.state = {
      parameters: {},
      stepDescription: [],
      autoPlay: false,
    };
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

  handleExecuteApi = (api: LinkedList.Api, params: ObjectType<any>) => {
    const stepDescription = this.generateStepDescription(api, params);
    this.setState({ stepDescription, autoPlay: true, currentApi: api });
  };

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
              //@ts-ignore
              handleExecuteApi={this.handleExecuteApi}
              interactive
            />
          </CanvasContainer>
        ) : (
          <div className='h-full fx-center linked-list-page__init-button'>
            <InitArrayInput
              onSubmit={linkedListData =>
                this.setState({ data: linkedListData })
              }
              text='Create new linked list'
            />
          </div>
        )}
      </VisualAlgo>
    );
  }
}

export default LinkedListPage;
