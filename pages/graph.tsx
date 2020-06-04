import React, { Component } from 'react';

import {
  GraphDS,
  StackDS,
  ArrayDS,
  CanvasContainer,
  InitGraphInput,
} from 'components';
import { VisualAlgo } from 'layout';
import { extractInstructionFromDescription } from 'utils';
import { graphInstruction } from 'instructions/Graph';
import { BaseDSPageState, Action, ObjectType } from 'types';
import { Graph } from 'types/ds/Graph';
import { Stack } from 'types/ds/Stack';
import { Array } from 'types/ds/Array';
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
    const stepDescription = this.generateStepDescription(api, params);
    this.setState({ stepDescription, autoPlay: true, currentApi: api });
  };

  generateStepDescription(currentApi: Graph.Api, params: any) {
    const { data } = this.state;
    if (!currentApi) return [];
    return graphInstruction(data!, currentApi, params);
  }

  handlePlayingChange = (newPlayingState: boolean) => {
    this.setState({ autoPlay: newPlayingState });
  };

  getWidthOfGraph(graphModel?: Graph.Model) {
    if (!graphModel) return 0;
    return Math.max(...graphModel.map(({ x }) => x));
  }
  renderExtraDSForApi() {
    const { currentApi, data, stepDescription, currentStep } = this.state;
    switch (currentApi) {
      case 'dfs': {
        const stackInstruction = extractInstructionFromDescription(
          stepDescription,
          'stack',
        ) as Action<Stack.Method>[][];
        const arrayInstruction = extractInstructionFromDescription(
          stepDescription,
          'array',
        ) as Action<Array.Method>[][];

        const baseProps = {
          initialData: [],
          currentStep,
          totalStep: stepDescription.length - 1,
        };

        return (
          <>
            <StackDS
              x={this.getWidthOfGraph(data) + 400}
              y={300}
              instructions={stackInstruction}
              {...baseProps}
            />

            <ArrayDS
              x={this.getWidthOfGraph(data) + 400}
              y={450}
              instructions={arrayInstruction}
              blockType='block'
              {...baseProps}
            />
          </>
        );
      }
    }
  }

  render() {
    const {
      data,
      currentStep,
      currentApi,
      stepDescription,
      autoPlay,
    } = this.state;
    const graphInstruction = extractInstructionFromDescription(
      stepDescription,
      'graph',
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
              instructions={graphInstruction}
              initialData={data}
              currentStep={currentStep}
              totalStep={stepDescription.length - 1}
              //@ts-ignore
              handleExecuteApi={this.handleExecuteApi}
              interactive
            />

            {this.renderExtraDSForApi()}
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
