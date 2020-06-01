import React, { Component } from 'react';

import {
  BinarySearchTreeDS,
  CanvasContainer,
  InitBSTInput,
  ArrayDS,
} from 'components';
import { VisualAlgo } from 'layout';
import { extractInstructionFromDescription } from 'utils';
import { bstInstruction } from 'instructions/BST';
import { StepInstruction, Action, ObjectType } from 'types';
import { BST } from 'types/ds/BST';
import { code, explanation } from 'codes/BST';

interface IState {
  data?: Array<number | null>;
  currentStep?: number;
  currentApi?: BST.Api;
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
  //     await this.initBSTData(true);
  //     await this.handlePlayingChange(true);
  //   } catch (error) {
  //     console.log('error', error);
  //     setTimeout(this.handleStartAlgorithm, 50);
  //   }
  // };

  // initBSTData = useOldData => {
  //   const {
  //     parameters: { value },
  //   } = this.state;
  //   let bstData;
  //   if (useOldData && this.originalBSTData) {
  //     bstData = this.originalBSTData;
  //   } else {
  //     if (value && value.length) bstData = value;
  //     // bstData = Array(5)
  //     //   .fill(0)
  //     //   .map(() => Math.round(Math.random() * 10));
  //     else bstData = [4, 1, 8, 0, 2, 6, 9];

  //     this.originalBSTData = bstData;
  //   }

  //   // Phải làm thế này để buộc component linked list unmount
  //   // Linked list chỉ khởi tạo state của nó 1 lần trong constructor
  //   return new Promise(resolve =>
  //     this.setState({ data: undefined }, () => {
  //       this.setState({ data: bstData }, () => resolve());
  //     }),
  //   );
  // };

  handleExecuteApi = (api: BST.Api, params: ObjectType<any>) => {
    const stepDescription = this.generateStepDescription(api, params);
    this.setState({ stepDescription, autoPlay: true, currentApi: api });
  };

  generateStepDescription(currentApi: BST.Api, params: any) {
    const { data } = this.state;
    if (!currentApi) return [];
    return bstInstruction(data!, currentApi, params);
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
    const bstInstruction = extractInstructionFromDescription(
      stepDescription,
      'bst',
    ) as Action<BST.Method>[][];
    const arrayInstruction = extractInstructionFromDescription(
      stepDescription,
      'array',
    );

    return (
      <VisualAlgo
        code={currentApi && code[currentApi]}
        explanation={currentApi && explanation[currentApi]}
        stepDescription={stepDescription}
        onStepChange={this.handleStepChange}
        autoPlay={autoPlay}
        onPlayingChange={this.handlePlayingChange}
        // ref={this.ref}
      >
        {data ? (
          <CanvasContainer>
            <BinarySearchTreeDS
              x={100}
              y={50}
              instructions={bstInstruction}
              initialData={data}
              currentStep={currentStep}
              totalStep={stepDescription.length - 1}
              //@ts-ignore
              handleExecuteApi={this.handleExecuteApi}
              interactive
            />

            <ArrayDS
              initialData={[]}
              blockType='block'
              instructions={arrayInstruction}
              x={800}
              y={200}
              currentStep={currentStep}
              totalStep={stepDescription.length - 1}
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
