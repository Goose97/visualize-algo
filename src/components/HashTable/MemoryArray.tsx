import React, { Component } from 'react';
import { isEqual } from 'lodash';
import { produce } from 'immer';

import { MemoryBlock, LinkedListDS, PointerLink } from 'components';
import { caculateKeyHash } from './helper';
import {
  HASH_TABLE_UNIVERSAL_KEY_SIZE,
  ARRAY_BLOCK_WIDTH,
  ARRAY_BLOCK_HEIGHT,
  HASH_TABLE_ARRAY_X,
} from '../../constants';
import { MemoryArrayProps, MemoryArrayState } from './index.d';
import { Action } from 'types';
import { LinkedList } from 'types/ds/LinkedList';

export class MemoryArray extends Component<MemoryArrayProps, MemoryArrayState> {
  constructor(props: MemoryArrayProps) {
    super(props);

    this.state = {
      linkedListInstructionAndStep: {},
    };
  }

  componentDidUpdate(prevProps: MemoryArrayProps) {
    const { keyAboutToBeDeleted } = this.props;
    if (!isEqual(keyAboutToBeDeleted, prevProps.keyAboutToBeDeleted)) {
      this.checkKeyToDelete(prevProps.keyAboutToBeDeleted, keyAboutToBeDeleted);
    }
  }

  checkKeyToDelete(prevKeyToDelete: string[], currentKeyToDelete: string[]) {
    const { linkedListInstructionAndStep } = this.state;
    const keyToDelete = currentKeyToDelete.find(
      key => !prevKeyToDelete.includes(key),
    );
    if (keyToDelete !== undefined) {
      const hashValue = caculateKeyHash(
        keyToDelete,
        HASH_TABLE_UNIVERSAL_KEY_SIZE,
      );
      const newState = produce(linkedListInstructionAndStep, draft => {
        const oldInstructions =
          (draft[hashValue] && draft[hashValue].instructions) || [];
        const newInstructions = [
          ...oldInstructions,
          [
            {
              name: 'removeByValue',
              params: [this.getValueOfKey(keyToDelete)],
            },
          ],
        ] as Action<LinkedList.Method>[][];

        const oldCurrentStep = draft[hashValue] && draft[hashValue].currentStep;
        const newCurrentStep =
          oldCurrentStep !== undefined ? oldCurrentStep + 1 : 0;

        draft[hashValue] = {
          instructions: newInstructions,
          currentStep: newCurrentStep,
        };
      });

      this.setState({
        linkedListInstructionAndStep: newState,
      });
    }
  }

  getValueOfKey(keyToFind: string) {
    const { hashTableModel } = this.props;
    return hashTableModel.keys.find(({ key }) => key === keyToFind)!.value;
  }

  renderListMemoryBlock() {
    const { collisionResolution } = this.props;
    return (
      <g className='hash-table__memory-blocks'>
        {Array(HASH_TABLE_UNIVERSAL_KEY_SIZE)
          .fill(0)
          .map((_, index) => {
            const blur = this.shouldThisAddressBlur(index);

            return (
              <g
                className={`hash-table__memory-block${blur ? ' blur' : ''}`}
                key={index}
              >
                <MemoryBlock
                  width={ARRAY_BLOCK_WIDTH}
                  height={ARRAY_BLOCK_HEIGHT}
                  x={HASH_TABLE_ARRAY_X}
                  y={index * ARRAY_BLOCK_HEIGHT}
                  value={
                    collisionResolution === 'linearProbe'
                      ? this.getValueAtAddress(index)
                      : null
                  }
                  visible
                  type='rectangle'
                  labelDirection='left'
                  label={[index.toString()]}
                />
                {collisionResolution === 'chaining' &&
                  this.renderLinkedListAtAddress(index)}
              </g>
            );
          })}
      </g>
    );
  }

  getValueAtAddress(address: number) {
    const { hashTableModel } = this.props;
    return (
      hashTableModel.memoryAddresses.find(({ key }) => key === address)
        ?.values[0] || null
    );
  }

  shouldThisAddressBlur(address: number) {
    const { hashTableModel } = this.props;
    const hasAddressNeedHighlight = hashTableModel.memoryAddresses.some(
      ({ highlight }) => highlight,
    );
    if (!hasAddressNeedHighlight) return false;
    const currentAddress = hashTableModel.memoryAddresses.find(
      ({ key }) => key === address,
    );
    return !currentAddress?.highlight;
  }

  getLabelAndValueProps(value: string | number, address: number) {
    const { collisionResolution } = this.props;
    switch (collisionResolution) {
      case 'chaining': {
        return {
          labelDirection: 'left',
          label: [address.toString()],
          value: null,
        };
      }

      case 'linearProbe': {
        return {
          label: [
            {
              value: address.toString(),
              direction: 'left',
            },
            {
              value: address.toString(),
              direction: 'right',
            },
          ],
          value,
        };
      }
    }
  }

  renderLinkedListAtAddress(address: number) {
    const { hashTableModel } = this.props;
    const memoryAddress = hashTableModel.memoryAddresses.find(
      ({ key }) => key == address,
    );

    if (!memoryAddress) return null;
    if (!memoryAddress.values.length) return null;

    return (
      <>
        {this.renderPointerLinkToLinkedList(+address)}
        <LinkedListDS
          key={address}
          x={HASH_TABLE_ARRAY_X + ARRAY_BLOCK_WIDTH + 50}
          y={+address * ARRAY_BLOCK_HEIGHT + 5}
          instructions={[]}
          data={memoryAddress.values}
          controlled
          // {...linkedListInstructionAndStep[address]}
          totalStep={10}
        />
      </>
    );
  }

  renderPointerLinkToLinkedList(address: number) {
    return (
      <PointerLink
        path={`M ${HASH_TABLE_ARRAY_X + ARRAY_BLOCK_WIDTH / 2} ${
          +address * ARRAY_BLOCK_HEIGHT + ARRAY_BLOCK_HEIGHT / 2
        } H ${HASH_TABLE_ARRAY_X + ARRAY_BLOCK_WIDTH + 50 - 6}`}
        arrowDirection='right'
      />
    );
  }

  render() {
    return this.renderListMemoryBlock();
  }
}

export default MemoryArray;
