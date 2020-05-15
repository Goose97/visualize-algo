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
import transformArrayModel from './ModelTransformer';

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
        index: 0,
      },
      {
        value: 2,
        key: 1,
        visible: true,
        index: 1,
      },
      {
        value: 3,
        key: 2,
        visible: true,
        index: 2,
      },
    ];
  }

  componentDidMount() {
    setTimeout(() => {
      this.swap(0, 2);
    }, 2000);
    setTimeout(() => {
      this.swap(0, 2);
    }, 3000);
    setTimeout(() => {
      this.swap(0, 2);
    }, 4000);
  }

  swap(from: number, to: number) {
    const { arrayModel } = this.state;
    const newModel = transformArrayModel(arrayModel, 'swap', [from, to]);
    this.setState({
      arrayModel: newModel,
    });
  }

  render() {
    const { arrayModel } = this.state;
    console.log('arrayModel', arrayModel);
    const arrayMemoryBlock = arrayModel.map(arrayNode => (
      <ArrayMemoryBlock
        {...arrayNode}
        origin={{
          x: 100,
          y: 100,
        }}
      />
    ));

    console.log('arrayMemoryBlock', arrayMemoryBlock);

    return arrayMemoryBlock;
  }
}

export default Array;
