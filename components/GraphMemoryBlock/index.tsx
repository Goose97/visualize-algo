import React, { Component } from 'react';
import { pick } from 'lodash';

import { MemoryBlock, AutoTransformGroup } from 'components';
import { IProps } from './index.d';
import { GRAPH_NODE_RADIUS } from '../../constants';
import { PointCoordinate } from 'types';

export class GraphMemoryBlock extends Component<IProps> {
  private initialCoordinate: PointCoordinate;
  constructor(props: IProps) {
    super(props);

    this.initialCoordinate = { x: props.x, y: props.y };
  }

  render() {
    const { value, aboutToDelete } = this.props;
    return (
      <AutoTransformGroup origin={pick(this.props, ['x', 'y'])}>
        <MemoryBlock
          {...pick(this.props, ['focus', 'visited', 'visible'])}
          {...this.initialCoordinate}
          value={value}
          width={GRAPH_NODE_RADIUS * 2}
          height={GRAPH_NODE_RADIUS * 2}
          type='round'
          className={aboutToDelete ? 'focus-to-delete' : ''}
        />
      </AutoTransformGroup>
    );
  }
}

export default GraphMemoryBlock;
