import React, { Component, Fragment, useImperativeHandle } from 'react';
import produce from 'immer';

import { MemoryBlock, PointerLink } from 'components';

export class LinkedList extends Component {
  constructor(props) {
    super(props);

    this.data = [1, 2, 3, 4, 5];
    this.key = this.data.length;
    this.state = {
      blockInfo: this.initiateMemoryBlockInfo(),
      nodeAboutToAppear: new Set([]),
    };
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

  caculateblockInfo(blockIndex) {
    const { x: baseX, y: baseY } = this.props;
    return { x: baseX + blockIndex * 125, y: baseY };
  }

  componentDidMount() {
    setTimeout(() => {
      this.visitNode(0);
    }, 3000);
  }

  visitNode(nodeIndex) {
    this.setState({
      blockInfo: this.produceNewBlockInfo('visit', { index: nodeIndex }),
    });
  }

  removeNode(nodeIndex) {
    this.setState({
      blockInfo: this.produceNewBlockInfo('remove', { index: nodeIndex }),
    });
  }

  addNode(value, nodeIndex) {
    const newBlockInfo = this.produceNewBlockInfo('add', {
      value,
      index: nodeIndex,
    });
    const newNodeKey = newBlockInfo[nodeIndex].key;
    this.setState({
      blockInfo: newBlockInfo,
    });
    this.addOrRemoveNodeAboutToAppear(newNodeKey);
    setTimeout(() => {
      this.toggleNodeVisibility(nodeIndex);
      this.addOrRemoveNodeAboutToAppear(newNodeKey);
    }, 800);
  }

  // nodeAboutToAppear is a list of node which already in the state
  // but about to get animated to appear
  addOrRemoveNodeAboutToAppear(nodeKey) {
    const { nodeAboutToAppear } = this.state;
    if (nodeAboutToAppear.has(nodeKey)) {
      const cloneState = new Set(nodeAboutToAppear);
      cloneState.delete(nodeKey);
      this.setState({ nodeAboutToAppear: cloneState });
    } else {
      this.setState({
        nodeAboutToAppear: nodeAboutToAppear.add(nodeKey),
      });
    }
  }

  produceNewBlockInfo(operation, payload) {
    const { blockInfo } = this.state;
    switch (operation) {
      case 'remove': {
        const { index } = payload;
        return produce(blockInfo, draft => {
          draft[index].visible = false;
        });
      }

      case 'add': {
        const { index, value } = payload;
        const newNodeInfo = {
          ...this.caculateblockInfo(index),
          value,
          key: this.key++,
          visible: false,
          visited: false,
        };
        return produce(blockInfo, draft => {
          draft.splice(index, 0, newNodeInfo);
          // shift right every node in the right of the new node
          const shiftedNodes = draft
            .slice(index + 1)
            .map(blockInfo => ({ ...blockInfo, x: blockInfo.x + 125 }));
          draft.splice(index + 1, shiftedNodes.length, ...shiftedNodes);
        });
      }

      case 'visit': {
        const { index } = payload;
        return produce(blockInfo, draft => {
          draft[index].visited = true;
        });
      }

      default:
        return blockInfo;
    }
  }

  toggleNodeVisibility(nodeIndex) {
    const { blockInfo } = this.state;
    const newPosition = produce(blockInfo, draft => {
      const oldVisibleState = draft[nodeIndex].visible;
      draft[nodeIndex].visible = !oldVisibleState;
    });
    this.setState({ blockInfo: newPosition });
  }

  renderPointerLinkForMemoryBlock(blockIndex) {
    const { blockInfo } = this.state;
    const startAndFinish = this.caculateStartAndFinishOfPointer(blockIndex);
    let { visible, visited, key } = blockInfo[blockIndex];
    if (startAndFinish)
      return (
        <PointerLink
          {...startAndFinish}
          visited={visited}
          visible={visible}
          key={key}
          name={blockInfo[blockIndex].key}
        />
      );
  }

  caculateStartAndFinishOfPointer(blockIndex) {
    const { blockInfo, nodeAboutToAppear } = this.state;
    let { x, y, visible, key } = blockInfo[blockIndex];
    let nextVisibleBlock = this.findNextBlock(blockIndex);

    const start = { x: x + MEM_BLOCK_WIDTH, y: y + MEM_BLOCK_HEIGHT / 2 };
    let finish;
    if (nextVisibleBlock && visible) {
      let { x: x1, y: y1 } = nextVisibleBlock;

      if (nodeAboutToAppear.has(key)) {
        finish = { ...start };
      } else {
        finish = { x: x1, y: y1 + MEM_BLOCK_HEIGHT / 2 };
      }
      return { start, finish };
    } else {
      return null;
    }
  }

  // Find block which is still visible or in about to appear state
  findNextBlock(index) {
    const { blockInfo, nodeAboutToAppear } = this.state;
    for (let i = index + 1; i < blockInfo.length; i++) {
      const { visible, key } = blockInfo[i];
      if (visible || nodeAboutToAppear.has(key)) {
        return blockInfo[i];
      }
    }
  }

  render() {
    const { blockInfo } = this.state;
    const listMemoryBlock = blockInfo.map(blockInfo => (
      <MemoryBlock {...blockInfo} name={blockInfo.key} />
    ));

    const listPointerLink = blockInfo
      .slice(0, -1)
      .map((_, index) => this.renderPointerLinkForMemoryBlock(index));

    return (
      <Fragment>
        {listMemoryBlock}
        {listPointerLink}
      </Fragment>
    );
  }
}

export default LinkedList;
