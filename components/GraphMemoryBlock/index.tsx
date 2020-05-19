import React, { Component } from 'react';
import { pick } from 'lodash';

import { MemoryBlock, AutoTransformGroup } from 'components';
import { IProps } from './index.d';
import { GRAPH_NODE_RADIUS } from '../../constants';
import { withExtendClassName } from 'hocs/';
import { PointCoordinate } from 'types';

export class GraphMemoryBlock extends Component<IProps> {
  private initialCoordinate: PointCoordinate;
  constructor(props) {
    super(props);

    this.initialCoordinate = { x: props.x, y: props.y };
  }

  render() {
    const { value } = this.props;
    return (
      <AutoTransformGroup origin={pick(this.props, ['x', 'y'])}>
        <MemoryBlock
          {...pick(this.props, ['focus', 'visited'])}
          {...this.initialCoordinate}
          value={value}
          visible
          width={GRAPH_NODE_RADIUS * 2}
          height={GRAPH_NODE_RADIUS * 2}
          type='round'
        />
      </AutoTransformGroup>
    );
  }
}

export default GraphMemoryBlock;
