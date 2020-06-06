import React, { Component } from 'react';

import {
  GraphDS,
  StackDS,
  ArrayDS,
  QueueDS,
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
import { Queue } from 'types/ds/Queue';
import { code, explanation } from 'codes/BST';
import { QUEUE_BLOCK_WIDTH } from '../constants';

interface IState extends BaseDSPageState {
  data?: Graph.Model;
  currentApi?: Graph.Api;
}

interface IProps {}

const data =
  '[{"x":0,"y":0,"key":1,"adjacentNodes":[5,3,6],"value":1,"visible":true},{"x":74,"y":144,"key":2,"adjacentNodes":[5,4],"value":2,"visible":true},{"x":316,"y":175,"key":3,"adjacentNodes":[5,1],"value":3,"visible":true},{"x":370,"y":41,"key":4,"adjacentNodes":[5,2,6],"value":4,"visible":true},{"x":206,"y":237,"key":5,"adjacentNodes":[1,2,3,4],"value":5,"visible":true},{"x":531,"y":91,"key":6,"adjacentNodes":[1,4],"value":6,"visible":true}]';

export class BinarySearchTreePage extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      stepDescription: [],
      data: JSON.parse(data),
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

  getWidthOfDS(
    graphModel: Graph.Model | undefined,
    dataStructure: 'graph' | 'queue',
  ) {
    switch (dataStructure) {
      case 'graph': {
        if (!graphModel) return 0;
        return Math.max(...graphModel.map(({ x }) => x));
      }

      case 'queue': {
        if (!graphModel) return 0;
        return graphModel.length * QUEUE_BLOCK_WIDTH + 50;
      }
    }
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

        const widthOfGraph = this.getWidthOfDS(data, 'graph');
        const baseProps = {
          initialData: [],
          currentStep,
          totalStep: stepDescription.length - 1,
        };

        return (
          <>
            <StackDS
              x={widthOfGraph + 400}
              y={300}
              instructions={stackInstruction}
              {...baseProps}
            />

            <ArrayDS
              x={widthOfGraph + 400}
              y={450}
              instructions={arrayInstruction}
              blockType='block'
              {...baseProps}
            />
          </>
        );
      }

      case 'bfs':
        const queueInstruction = extractInstructionFromDescription(
          stepDescription,
          'queue',
        ) as Action<Queue.Method>[][];
        const arrayInstruction = extractInstructionFromDescription(
          stepDescription,
          'array',
        ) as Action<Array.Method>[][];

        const widthOfGraph = this.getWidthOfDS(data, 'graph');
        const widthOfQueue = this.getWidthOfDS(data, 'queue');
        const baseProps = {
          initialData: [],
          currentStep,
          totalStep: stepDescription.length - 1,
        };

        return (
          <>
            <QueueDS
              x={widthOfGraph + widthOfQueue / 3 + 400}
              y={300}
              instructions={queueInstruction}
              {...baseProps}
            />

            <ArrayDS
              x={widthOfGraph + 400}
              y={450}
              instructions={arrayInstruction}
              blockType='block'
              {...baseProps}
            />
          </>
        );
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
