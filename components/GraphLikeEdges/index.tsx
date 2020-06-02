import React, { PureComponent } from 'react';
import { omit } from 'lodash';

import { PointerLink } from 'components';
import { caculatePointerPathFromTwoNodeCenter } from 'utils';
import { GRAPH_NODE_RADIUS } from '../../constants';
import { IProps } from './index.d';

export class GraphLikeEdges extends PureComponent<IProps> {
  render() {
    const { from, to } = this.props;
    const fromCenter = {
      x: from.x + GRAPH_NODE_RADIUS,
      y: from.y + GRAPH_NODE_RADIUS,
    };
    const toCenter = {
      x: to.x + GRAPH_NODE_RADIUS,
      y: to.y + GRAPH_NODE_RADIUS,
    };
    const pathAndRotation = caculatePointerPathFromTwoNodeCenter(
      fromCenter,
      toCenter,
      GRAPH_NODE_RADIUS,
    );

    return (
      <PointerLink {...omit(this.props, ['from', 'to'])} {...pathAndRotation} />
    );
  }
}

export default GraphLikeEdges;
