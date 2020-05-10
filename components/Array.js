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
      focusNode: [],
      swapNode: [],
      swapDistance: 0,
    };
  }


  focusNode(nodeIndexs) {
    this.setState({ focusNode: nodeIndexs });
  }

  swapNode(nodeIndexs) {
    this.setState({ swapNode: nodeIndexs });
  }

  swap = (nodeIndexs) => () => {
    this.focusNode(nodeIndexs);
    this.swapNode(nodeIndexs);
    const distance = Math.abs(nodeIndexs[1] - nodeIndexs[0]);
    this.setState({
      swapDistance: distance
    })
  };

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
    const { blockInfo, focusNode, swapNode, swapDistance } = this.state;
    const listMemoryBlock = blockInfo.map((blockInfo) => {
      const isSwap = swapNode.includes(blockInfo.key) ? (swapNode[0] == blockInfo.key ? 1 : -1) : 0; 
      return (
        <MemoryBlockWithSwap
          {...blockInfo}
          name={blockInfo.key}
          structureType={this.structureType}
          focus={focusNode.includes(blockInfo.key)}
          isSwap={isSwap}
          swapNode={swapNode}
          swapDistance={swapDistance}
        />
      );
    });
    return <Fragment>{listMemoryBlock}</Fragment>;
  }
}

export default Array;
