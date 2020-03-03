import React, { Component, Fragment } from "react";

import { MemoryBlock, PointerLink } from "components";

export class LinkedList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      animatingPointerIndex: new Set([])
    };

    this.data = [1, 2, 3];
    this.initiateMemoryBlockPosition();
    this.initiateRefList();
  }

  initiateMemoryBlockPosition() {
    this.blockPosition = this.data.map((value, index) =>
      this.getMemoryBlockPosition(index)
    );
  }

  initiateRefList() {
    this.blockRefs = Array(this.data.length)
      .fill(0)
      .map(() => React.createRef());
    this.pointerRefs = Array(this.data.length - 1)
      .fill(0)
      .map(() => React.createRef());
  }

  removeNode(nodeIndex) {
    const { animatingPointerIndex } = this.state;
    let clonedState = new Set(animatingPointerIndex);
    this.setState({ animatingPointerIndex: clonedState.add(nodeIndex - 1) });
  }

  removeNodeInState(nodeIndex) {
    this.blockPosition.splice(nodeIndex, 1);
  }

  addNode(value, nodeIndex) {
    this.addNodeInState(value, nodeIndex);
    this.shiftNodeFromIndexToRight(nodeIndex);
  }

  addNodeInState(value, nodeIndex) {
    this.data.splice(nodeIndex, 0, value);
    this.initiateMemoryBlockPosition();
  }

  shiftNodeFromIndexToRight(beginIndexToShift) {
    this.blockRefs.forEach((ref, index) => {
      if (index >= beginIndexToShift) {
        // move block
        const block = ref.current;
        block && block.move(100, "right");

        // move pointer
        const pointer = this.pointerRefs[index];
        pointer && pointer.current && pointer.current.move(100, "right");
      }
    });
  }

  resetElementTransform() {
    this.blockRefs.forEach((ref, index) => {
      // move block
      const block = ref.current;
      block && block.resetTransform();

      // move pointer
      const pointer = this.pointerRefs[index];
      pointer && pointer.current && pointer.current.resetTransform();
    });
  }

  getMemoryBlockPosition(blockIndex) {
    const { x: baseX, y: baseY } = this.props;
    return { x: baseX + blockIndex * 125, y: baseY };
  }

  handleFinishPointerAnimation = index => () => {
    const { animatingPointerIndex } = this.state;
    let clonedState = new Set(animatingPointerIndex);
    clonedState.delete(index);
    this.setState({ animatingPointerIndex: clonedState });
  };

  render() {
    const { animatingPointerIndex } = this.state;
    const listMemoryBlock = this.blockPosition.map((coordinate, index) => (
      <MemoryBlock
        {...coordinate}
        value={this.data[index]}
        key={index}
        ref={this.blockRefs[index]}
      />
    ));

    const listPointerLink = this.blockPosition
      .slice(0, -1)
      .map((_, index) => (
        <PointerLink
          start={this.blockPosition[index]}
          finish={this.blockPosition[index + 1]}
          key={index}
          isAnimating={animatingPointerIndex.has(index)}
          onFinishAnimation={this.handleFinishPointerAnimation(index)}
          ref={this.pointerRefs[index]}
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
