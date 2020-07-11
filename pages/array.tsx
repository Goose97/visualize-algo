import React, { Component } from 'react';

import { CanvasContainer, ArrayDS, InitArrayInput } from 'components';
import withDSPage, { WithDSPage } from 'hocs/withDSPage';
import { extractInstructionFromDescription } from 'utils';
import { arrayInstruction } from 'instructions/Array';
import { code, explanation } from 'codes/Array';
import { Action } from 'types';
import { Array } from 'types/ds/Array.d';

export class ArrayPage extends Component<WithDSPage<Array.Api>> {
  render() {
    const {
      sideBarWidth,
      autoPlay,
      currentStep,
      stepDescription,
      data,
      onDataChange,
      currentApi,
      executedApiCount,
      onExecuteApi,
    } = this.props;
    const arrayInstruction = extractInstructionFromDescription(
      stepDescription,
      'array',
    ) as Action<Array.Method>[][];

    return data ? (
      <CanvasContainer>
        <ArrayDS
          x={100}
          y={200}
          blockType='block'
          initialData={data}
          currentStep={currentStep}
          instructions={arrayInstruction}
          totalStep={stepDescription.length - 1}
          handleExecuteApi={onExecuteApi}
          interactive
          executedApiCount={executedApiCount}
          currentApi={currentApi}
          dropdownDisabled={autoPlay}
        />
      </CanvasContainer>
    ) : (
      <div
        className='h-full fx-center linked-list-page__init-button'
        style={{ transform: `translateX(-${(sideBarWidth || 0) / 2}px)` }}
      >
        <InitArrayInput onSubmit={onDataChange} text='Create new array' />
      </div>
    );
  }
}

export default withDSPage<Array.Api>({
  code,
  explanation,
  instructionGenerator: arrayInstruction,
})(ArrayPage);
