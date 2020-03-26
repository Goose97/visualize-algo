import React, { Component, Fragment } from "react";

import { MemoryBlock } from "components";

class Array extends Component {
  constructor(props) {
    super(props);

    this.data = props.data;
    this.key = this.data.length;
    this.state = {
			blockInfo: this.initiateMemoryBlockInfo()
		};
  }

  caculateblockInfo(blockIndex) {
    const { x: baseX, y: baseY } = this.props;
    return { x: baseX + blockIndex * (2 * LINKED_LIST_BLOCK_WIDTH), y: baseY };
  }

  initiateMemoryBlockInfo() {
    return this.data.map((value, index) => ({
			...this.caculateblockInfo(index),
			value,
			visible: true,
			visited: false,
			key: index
		}));
  }

  render() {
		const { blockInfo } = this.state;
    const listMemoryBlock = blockInfo.map(blockInfo => (
			<MemoryBlock
				{...blockInfo}
				name={blockInfo.key}
				focus={blockInfo.key === 1}
			/>
		))
    return (
      <Fragment>
        {listMemoryBlock}
      </Fragment>
    );
  }
}

export default Array;
