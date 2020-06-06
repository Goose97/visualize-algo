import React, { Component } from 'react';
import { pick } from 'lodash';

import { MemoryBlock, AutoTransformGroup } from 'components';
import { IProps } from './index.d';
import { GRAPH_NODE_RADIUS } from '../../constants';
import { PointCoordinate } from 'types';
import { classNameHelper } from 'utils';

export class GraphMemoryBlock extends Component<IProps> {
  private initialCoordinate: PointCoordinate;
  constructor(props: IProps) {
    super(props);

    this.initialCoordinate = { x: props.x, y: props.y };
  }

  produceClassName() {
    const { aboutToDelete, isNew } = this.props;
    return classNameHelper({
      base: '',
      ['focus-to-delete']: !!aboutToDelete,
      ['appearing']: !!isNew,
    });
  }

  render() {
    const { value } = this.props;
    return (
      <AutoTransformGroup origin={pick(this.props, ['x', 'y'])}>
        <MemoryBlock
          {...pick(this.props, ['focus', 'visited', 'visible', 'label', 'highlight'])}
          {...this.initialCoordinate}
          value={value}
          width={GRAPH_NODE_RADIUS * 2}
          height={GRAPH_NODE_RADIUS * 2}
          type='round'
          className={this.produceClassName()}
        />
      </AutoTransformGroup>
    );
  }
}

export default GraphMemoryBlock;
