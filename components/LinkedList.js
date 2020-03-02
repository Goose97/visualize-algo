import React, { Component, Fragment } from "react";

import { MemoryBlock, PointerLink } from "components";

export class LinkedList extends Component {
  constructor(props) {
    super(props);

    this.data = [1, 2, 3];
  }

  getMemoryBlockPosition(blockIndex) {
    const { x: baseX, y: baseY } = this.props;
    return { x: baseX + blockIndex * 100, y: baseY };
  }

  render() {
    const listBlockCoordinates = this.data.map((value, index) =>
      this.getMemoryBlockPosition(index)
    );
    const listMemoryBlock = listBlockCoordinates.map((coordinate, index) => (
      <MemoryBlock {...coordinate} value={this.data[index]} key={index} />
    ));

    const listPointerLink = listBlockCoordinates
      .slice(0, -1)
      .map((_, index) => (
        <PointerLink
          start={listBlockCoordinates[index]}
          finish={listBlockCoordinates[index + 1]}
          key={index}
        />
      ));

    return (
      <Fragment>
        {listMemoryBlock}
        {listPointerLink}
      </Fragment>
    );
  }
}

export default LinkedList;
