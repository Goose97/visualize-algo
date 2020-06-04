import React, { Component } from 'react';

import { GraphDS, CanvasContainer, InitGraphInput } from 'components';
import { VisualAlgo } from 'layout';
import { extractInstructionFromDescription } from 'utils';
import { bstInstruction } from 'instructions/BST';
import { BaseDSPageState, Action, ObjectType } from 'types';
import { Graph } from 'types/ds/Graph';
import { code, explanation } from 'codes/BST';

interface IState extends BaseDSPageState {
  data?: Graph.Model;
  currentApi?: Graph.Api;
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

  handleExecuteApi = (api: Graph.Api, params: ObjectType<any>) => {
    console.log('api', api)
    console.log('params', params)
    // const stepDescription = this.generateStepDescription(api, params);
    // this.setState({ stepDescription, autoPlay: true, currentApi: api });
  };

  generateStepDescription(currentApi: Graph.Api, params: any) {
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
    ) as Action<Graph.Method>[][];

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
            <GraphDS
              x={200}
              y={200}
              instructions={bstInstruction}
              initialData={data}
              currentStep={currentStep}
              totalStep={stepDescription.length - 1}
              //@ts-ignore
              handleExecuteApi={this.handleExecuteApi}
              interactive
            />
          </CanvasContainer>
        ) : (
          <div className='h-full fx-center linked-list-page__init-button'>
            <InitGraphInput
              onSubmit={graphModel => {
                this.setState({ data: graphModel });
              }}
            />
          </div>
        )}
      </VisualAlgo>
    );
  }
}

export default BinarySearchTreePage;
