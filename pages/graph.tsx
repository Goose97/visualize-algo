import React, { Component } from 'react';

import {
  GraphDS,
  StackDS,
  ArrayDS,
  QueueDS,
  CanvasContainer,
  InitGraphInput,
} from 'components';
import withDSPage, { WithDSPage } from 'hocs/withDSPage';
import { extractInstructionFromDescription } from 'utils';
import { graphInstruction } from 'instructions/Graph';
import { Action } from 'types';
import { Graph } from 'types/ds/Graph';
import { Stack } from 'types/ds/Stack';
import { Array } from 'types/ds/Array';
import { Queue } from 'types/ds/Queue';
import { code, explanation } from 'codes/BST';
import { QUEUE_BLOCK_WIDTH } from '../constants';

// const data =
// '[{"x":0,"y":0,"key":1,"adjacentNodes":[5,3,6],"value":1,"visible":true},{"x":74,"y":144,"key":2,"adjacentNodes":[5,4],"value":2,"visible":true},{"x":316,"y":175,"key":3,"adjacentNodes":[5,1],"value":3,"visible":true},{"x":370,"y":41,"key":4,"adjacentNodes":[5,2,6],"value":4,"visible":true},{"x":206,"y":237,"key":5,"adjacentNodes":[1,2,3,4],"value":5,"visible":true},{"x":531,"y":91,"key":6,"adjacentNodes":[1,4],"value":6,"visible":true}]';

export class BinarySearchTreePage extends Component<WithDSPage<Graph.Api>> {
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
    const { currentApi, data, stepDescription, currentStep } = this.props;
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
      onDataChange,
      currentStep,
      stepDescription,
      autoPlay,
      executedApiCount,
      sideBarWidth,
      onExecuteApi,
    } = this.props;
    const graphInstruction = extractInstructionFromDescription(
      stepDescription,
      'graph',
    ) as Action<Graph.Method>[][];

    return data ? (
      <CanvasContainer>
        <GraphDS
          x={200}
          y={200}
          instructions={graphInstruction}
          initialData={data}
          currentStep={currentStep}
          totalStep={stepDescription.length - 1}
          handleExecuteApi={onExecuteApi}
          interactive
          dropdownDisabled={autoPlay}
          executedApiCount={executedApiCount}
        />

        {this.renderExtraDSForApi()}
      </CanvasContainer>
    ) : (
      <div
        className='h-full fx-center linked-list-page__init-button'
        style={{ transform: `translateX(-${(sideBarWidth || 0) / 2}px)` }}
      >
        <InitGraphInput onSubmit={onDataChange} />
      </div>
    );
  }
}

export default withDSPage<Graph.Api>({
  code,
  explanation,
  instructionGenerator: graphInstruction,
})(BinarySearchTreePage);
