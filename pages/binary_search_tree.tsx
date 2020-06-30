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
import { BaseDSPageState, Action, ObjectType } from 'types';
import { BST } from 'types/ds/BST';
import { code, explanation } from 'codes/BST';

interface IState extends BaseDSPageState {
  data?: Array<number | null>;
  currentApi?: BST.Api;
}

interface IProps {}

export class BinarySearchTreePage extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      stepDescription: [],
      autoPlay: false,
    };
  }

  handleStepChange = (stepIndex: number) => {
    this.setState({ currentStep: stepIndex });
  };

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
              dropdownDisabled={autoPlay}
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
