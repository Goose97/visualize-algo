import React, { Component } from 'react';
import { pick } from 'lodash';

import { MemoryBlock } from 'components';
import { IProps } from './index.d';
import { GRAPH_NODE_RADIUS } from '../../constants';

export class GraphMemoryBlock extends Component<IProps> {
  render() {
    return (
      //@ts-ignore
      <MemoryBlock
        {...pick(this.props, [
          'x',
          'y',
          'value',
          // 'visible',
          'focus',
          'visited',
        ])}
        visible
        width={GRAPH_NODE_RADIUS * 2}
        height={GRAPH_NODE_RADIUS * 2}
        type='round'
      />
    );
  }
}

export default GraphMemoryBlock;
