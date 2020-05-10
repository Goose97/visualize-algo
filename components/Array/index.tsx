import React, { Component } from 'react';
import produce from 'immer';
import { pick, omit } from 'lodash';

import { MemoryBlock, AutoTransformGroup } from 'components';
import transformModel from './ModelTransformer';
import HeadPointer from './HeadPointer';
import LinkedListPointer from './LinkedListPointer';
import { promiseSetState } from 'utils';
import { withReverseStep } from 'hocs';
import { IProps, IState, ArrayModel } from './index.d';
import { Action } from 'types';
import {
  LINKED_LIST_BLOCK_WIDTH,
  LINKED_LIST_BLOCK_HEIGHT,
} from '../../constants';
import ArrayMemoryBlock from './ArrayMemoryBlock';

export class Array extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      arrayModel: this.initModel(),
    };
  }

  initModel() {
    return [
      {
        value: 1,
        key: 0,
        visible: true,
      },
      {
        value: 2,
        key: 1,
        visible: true,
      },
      {
        value: 3,
        key: 2,
        visible: true,
      },
    ];
  }

  render() {
    const { arrayModel } = this.state;
    const arrayMemoryBlock = arrayModel.map((arrayNode, index) => (
      <ArrayMemoryBlock
        {...arrayNode}
        index={index}
        origin={{
          x: 100,
          y: 100,
        }}
        // structureType={this.structureType}
        // focus={focusNode.includes(blockInfo.key)}
        // isSwap={isSwap}
        // swapNode={swapNode}
        // swapDistance={swapDistance}
      />
    ));

    console.log('arrayMemoryBlock', arrayMemoryBlock);

    return arrayMemoryBlock;
  }
}

export default Array;
