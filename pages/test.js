import React, { Component } from 'react';

import { LinkedList, CanvasContainer } from 'components';
import { VisualAlgo } from 'layout';
import 'styles/main.scss';

export class Test extends Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();
  }

  render() {
    const code = `search(value) {
  let index = 0;
  let current = this.list;
  while (current.val !== value) {
    current = current.next;
    index++;
    if (!current) return null;
  }

  return index;
}`;

    return (
      <VisualAlgo code={code} highlightLine={1}>
        <CanvasContainer height={800}>
          <LinkedList x={100} y={100} />
        </CanvasContainer>
      </VisualAlgo>
    );
  }
}

export default Test;
