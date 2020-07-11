import React, { Component } from 'react';

import {
  BinarySearchTreeDS,
  CanvasContainer,
  InitBSTInput,
  ArrayDS,
} from 'components';
import withDSPage, { WithDSPage } from 'hocs/withDSPage';
import { extractInstructionFromDescription } from 'utils';
import { bstInstruction } from 'instructions/BST';
import { Action } from 'types';
import { BST } from 'types/ds/BST';
import { code, explanation } from 'codes/BST';

export class BinarySearchTreePage extends Component<WithDSPage<BST.Api>> {
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
    const bstInstruction = extractInstructionFromDescription(
      stepDescription,
      'bst',
    ) as Action<BST.Method>[][];
    const arrayInstruction = extractInstructionFromDescription(
      stepDescription,
      'array',
    );

    return data ? (
      <CanvasContainer>
        <BinarySearchTreeDS
          x={100}
          y={50}
          instructions={bstInstruction}
          initialData={data}
          currentStep={currentStep}
          totalStep={stepDescription.length - 1}
          handleExecuteApi={onExecuteApi}
          interactive
          dropdownDisabled={autoPlay}
          executedApiCount={executedApiCount}
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
      <div
        className='h-full fx-center linked-list-page__init-button'
        style={{ transform: `translateX(-${(sideBarWidth || 0) / 2}px)` }}
      >
        <InitBSTInput onSubmit={onDataChange} />
      </div>
    );
  }
}

export default withDSPage<BST.Api>({
  code,
  explanation,
  instructionGenerator: bstInstruction,
})(BinarySearchTreePage);
