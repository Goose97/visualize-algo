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
import { ObjectType, Action } from 'types';
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
    return hashTableModel.find(({ key }) => key === keyToFind)!.value;
  }

  renderListMemoryBlock() {
    return (
      <g className='hash-table__memory-blocks'>
        {Array(HASH_TABLE_UNIVERSAL_KEY_SIZE)
          .fill(0)
          .map((_, index) => {
            const blur = this.shouldThisAddressBlur(index);

            return (
              <g className={`hash-table__memory-block${blur ? ' blur' : ''}`}>
                <MemoryBlock
                  key={index}
                  width={ARRAY_BLOCK_WIDTH}
                  height={ARRAY_BLOCK_HEIGHT}
                  x={HASH_TABLE_ARRAY_X}
                  y={index * ARRAY_BLOCK_HEIGHT}
                  value={null}
                  visible
                  type='rectangle'
                  labelDirection='left'
                  label={[index.toString()]}
                />
                {this.renderLinkedListAtAddress(index)}
              </g>
            );
          })}
      </g>
    );
  }

  shouldThisAddressBlur(address: number) {
    const { hashTableModel } = this.props;
    const hasNewKey = hashTableModel.some(({ isNew }) => isNew);
    if (!hasNewKey) return false;
    const addressesOfNewKey = this.getAddressesOfNewKey();
    return !addressesOfNewKey.includes(address);
  }

  getAddressesOfNewKey() {
    const { hashTableModel } = this.props;
    return hashTableModel
      .filter(({ isNew }) => isNew)
      .map(({ key }) => caculateKeyHash(key, HASH_TABLE_UNIVERSAL_KEY_SIZE));
  }

  renderLinkedListAtAddress(address: number) {
    const valuesInArrayAddress = this.getArrayAddressValuesMap();
    const values = valuesInArrayAddress[address];
    return values ? (
      <>
        {this.renderPointerLinkToLinkedList(+address)}
        <LinkedListDS
          key={address}
          x={HASH_TABLE_ARRAY_X + ARRAY_BLOCK_WIDTH + 50}
          y={+address * ARRAY_BLOCK_HEIGHT + 5}
          instructions={[]}
          data={values.map(({ value }) => value)}
          controlled
          // {...linkedListInstructionAndStep[address]}
          totalStep={10}
        />
      </>
    ) : null;
  }

  getArrayAddressValuesMap(): ObjectType<
    { key: string; value: number | string }[]
  > {
    const { hashTableModel } = this.props;
    return hashTableModel.reduce<
      ObjectType<{ key: string; value: number | string }[]>
    >((acc, { key, value, isNew }) => {
      const hash = caculateKeyHash(key, HASH_TABLE_UNIVERSAL_KEY_SIZE);
      if (isNew) return acc;

      if (acc[hash]) {
        acc[hash].push({ key, value });
      } else {
        acc[hash] = [{ key, value }];
      }

      return acc;
    }, {});
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
