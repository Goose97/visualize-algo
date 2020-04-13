import React, { Component, Fragment } from "react";

import { MemoryBlockWithSwap } from "components";

class Array extends Component {
  constructor(props) {
    super(props);

    this.data = props.data;
    this.key = this.data.length;
    this.structureType = "array";

    this.state = {
      blockInfo: this.initiateMemoryBlockInfo(),
      focusNode: this.props.focusNode,
      swapNode: this.props.swapNode,
    };
  }

  componentDidUpdate() {
    if (this.props.focusNode !== this.state.focusNode) {
      this.setState({
        focusNode: this.props.focusNode,
      });
    }

    if (this.props.swapNode !== this.state.swapNode) {
      this.setState({
        swapNode: this.props.swapNode,
      });
    }
  }

  caculateblockInfo(blockIndex) {
    const { x: baseX, y: baseY } = this.props;
    return { x: baseX + blockIndex * ARRAY_BLOCK_WIDTH, y: baseY };
  }

  initiateMemoryBlockInfo() {
    return this.data.map((value, index) => ({
      ...this.caculateblockInfo(index),
      value,
      visible: true,
      visited: false,
      key: index,
    }));
  }

  render() {
    const { blockInfo, focusNode, swapNode } = this.state;
    console.log(swapNode);
    const listMemoryBlock = blockInfo.map((blockInfo) => {
      const isSwap = swapNode.includes(blockInfo.key) ? (swapNode[0] == blockInfo.key ? 1 : -1) : 0; 
      return (
        <MemoryBlockWithSwap
          {...blockInfo}
          name={blockInfo.key}
          structureType={this.structureType}
          focus={focusNode.includes(blockInfo.key)}
          isSwap={isSwap}
        />
      );
    });
    return <Fragment>{listMemoryBlock}</Fragment>;
  }
}

export default Array;
