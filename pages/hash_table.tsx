import React, { Component } from 'react';

import { CanvasContainer, HashTableDS, InitHashTableInput } from 'components';
import withDSPage, { WithDSPage } from 'hocs/withDSPage';
import { extractInstructionFromDescription } from 'utils';
import { hashTableInstruction } from 'instructions/HashTable';
import { code, explanation } from '../codes/HashTable';
import { Action, ObjectType } from 'types';
import { HashTable } from 'types/ds/HashTable.d';

interface IState {
  collisionResolution: 'chaining' | 'linearProbe';
}

export class HashTablePage extends Component<
  WithDSPage<HashTable.Api>,
  IState
> {
  constructor(props: WithDSPage<HashTable.Api>) {
    super(props);

    this.state = {
      collisionResolution: 'chaining',
    };
  }

  handleExecuteApi = (api: HashTable.Api, params: ObjectType<any>) => {
    const { onExecuteApi } = this.props;
    const { collisionResolution } = this.state;
    onExecuteApi(api, { ...params, collisionResolution });
  };

  render() {
    const {
      data,
      onDataChange,
      currentStep,
      stepDescription,
      autoPlay,
      executedApiCount,
      sideBarWidth,
    } = this.props;
    const { collisionResolution } = this.state;
    const hashTableInstruction = extractInstructionFromDescription(
      stepDescription,
      'hashTable',
    ) as Action<HashTable.Method>[][];

    return data ? (
      <CanvasContainer>
        <HashTableDS
          x={100}
          y={200}
          blockType='block'
          initialData={data}
          currentStep={currentStep}
          instructions={hashTableInstruction}
          totalStep={stepDescription.length - 1}
          //@ts-ignore
          handleExecuteApi={this.handleExecuteApi}
          collisionResolution={collisionResolution}
          interactive
          dropdownDisabled={autoPlay}
          executedApiCount={executedApiCount}
        />
      </CanvasContainer>
    ) : (
      <div
        className='h-full fx-center linked-list-page__init-button'
        style={{ transform: `translateX(-${(sideBarWidth || 0) / 2}px)` }}
      >
        <InitHashTableInput
          onSubmit={(data, collisionResolution) => {
            onDataChange(data);
            this.setState({ collisionResolution });
          }}
        />
      </div>
    );
  }
}

export default withDSPage<HashTable.Api>({
  code,
  explanation,
  instructionGenerator: hashTableInstruction,
})(HashTablePage);
