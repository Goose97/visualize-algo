import React, { Component } from 'react';

import { LinkedListDS, CanvasContainer, InitArrayInput } from 'components';
import withDSPage, { WithDSPage } from 'hocs/withDSPage';
import { extractInstructionFromDescription } from 'utils';
import { linkedListInstruction } from 'instructions/LinkedList';
import { LinkedList } from 'types/ds/LinkedList';
import { code, explanation } from 'codes/LinkedList';
import { Action } from 'types';

export class LinkedListPage extends Component<WithDSPage<LinkedList.Api>> {
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
    const linkedListInstruction = extractInstructionFromDescription(
      stepDescription,
      'linkedList',
    ) as Action<LinkedList.Method>[][];

    return data ? (
      <CanvasContainer>
        <LinkedListDS
          x={100}
          y={200}
          currentStep={currentStep!}
          totalStep={stepDescription.length - 1}
          instructions={linkedListInstruction}
          initialData={data}
          handleExecuteApi={onExecuteApi}
          interactive
          dropdownDisabled={autoPlay}
          executedApiCount={executedApiCount}
          keepStateWhenSwitchingApi
        />
      </CanvasContainer>
    ) : (
      <div
        className='h-full fx-center linked-list-page__init-button'
        style={{ transform: `translateX(-${(sideBarWidth || 0) / 2}px)` }}
      >
        <InitArrayInput
          onSubmit={onDataChange}
          text='Create new linked list'
          defaultLength={5}
        />
      </div>
    );
  }
}

export default withDSPage<LinkedList.Api>({
  code,
  explanation,
  instructionGenerator: linkedListInstruction,
})(LinkedListPage);
