import React, { Component } from 'react';
import produce from 'immer';

import { MemoryBlock, PointerLink } from 'components';

export class LinkedList extends Component {
  constructor(props) {
    super(props);

    this.data = props.data;
    this.key = this.data.length;
    this.state = {
      blockInfo: this.initiateMemoryBlockInfo(),
      nodeAboutToAppear: new Set([]),
      currentFocusNode: props.currentNode,
    };
    this.actionLogs = [];
  }

  saveActionToLogs(actionName, params) {
    const { currentStep } = this.props;
    const action = {
      name: actionName,
      params,
      step: currentStep,
    };
    this.actionLogs.push(action);
  }

  static getDerivedStateFromProps(props, state) {
    const { currentFocusNode } = state;
    if (
      'currentFocusNode' in props &&
      props.currentFocusNode !== currentFocusNode
    )
      return { currentFocusNode: props.currentFocusNode };

    return {};
  }

  componentDidUpdate(prevProps) {
    const { data, currentNode, currentStep } = this.props;
    // Handle backward step
    // Abort any other changes handler below
    if (currentStep < prevProps.currentStep) {
      return this.handleBackwardStep(currentStep);
    }

    // Handle data changes
    this.detectChangeInDataAndReact(prevProps.data, data);

    // Handle currentNode changes
    if (currentNode !== prevProps.currentNode) {
      this.visitNode(currentNode);
    }
  }

  detectChangeInDataAndReact(oldData, newData) {
    for (let i = 0; i < newData.length; i++) {
      if (oldData[i] !== newData[i]) {
        // there is some changes
        if (oldData.length < newData.length) {
          this.addNode(newData[i], i);
        } else if (oldData.length > newData.length) {
          this.removeNode(i);
        }
        break;
      }
    }
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
    return { x: baseX + blockIndex * (2 * LINKED_LIST_BLOCK_WIDTH), y: baseY };
  }

  focusNode(nodeIndex) {
    const { currentFocusNode } = this.state;
    this.saveActionToLogs('focusNode', [currentFocusNode]);
    this.setState({ currentFocusNode: nodeIndex });
  }

  visitNode(nodeIndex) {
    const { currentFocusNode } = this.state;
    this.saveActionToLogs('visitNode', [currentFocusNode]);
    this.followLinkToNode(nodeIndex);
  }

  followLinkToNode(nodeIndex) {
    const { blockInfo } = this.state;
    this.setState({ nodeAboutToVisit: blockInfo[nodeIndex].key });
  }

  handleFinishFollowLink = startBlockIndex => () => {
    // mark the node who hold the link as visited
    const destinationNodeIndex = this.findNextBlock(startBlockIndex, true);
    this.setState({
      nodeAboutToVisit: null,
      blockInfo: this.produceNewBlockInfo('visit', {
        index: startBlockIndex,
      }),
    });

    // mark the node on the other end as current focus
    this.focusNode(destinationNodeIndex);
  };

  removeNode(nodeIndex) {
    this.saveActionToLogs('removeNode', [nodeIndex]);
    this.setState({
      blockInfo: this.produceNewBlockInfo('remove', { index: nodeIndex }),
    });
  }

  addNode(value, nodeIndex) {
    this.saveActionToLogs('addNode', [value, nodeIndex]);
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

  produceNewBlockInfo(operation, payload) {
    const { blockInfo } = this.state;
    switch (operation) {
      case 'remove': {
        const { index } = payload;
        return produce(blockInfo, draft => {
          draft[index].visible = false;
        });
      }

      case 'reverseRemove': {
        const { index } = payload;
        return produce(blockInfo, draft => {
          draft[index].visible = true;
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
            .map(blockInfo => ({ ...blockInfo, x: blockInfo.x + 160 }));
          draft.splice(index + 1, shiftedNodes.length, ...shiftedNodes);
        });
      }

      case 'reverseAdd': {
        const { index, value } = payload;
        return produce(blockInfo, draft => {
          // shift left every node in the right of the removed node
          const shiftedNodes = draft
            .slice(index + 1)
            .map(blockInfo => ({ ...blockInfo, x: blockInfo.x - 160 }));
          draft.splice(index + 1, shiftedNodes.length, ...shiftedNodes);
          draft.splice(index, 1);
        });
      }

      case 'visit': {
        const { index } = payload;
        return produce(blockInfo, draft => {
          draft[index].visited = true;
        });
      }

      case 'reverseVisit': {
        const { index } = payload;
        return produce(blockInfo, draft => {
          draft[index].visited = false;
        });
      }

      default:
        return blockInfo;
    }
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
          following={this.isLinkNeedToBeFollowed(blockIndex)}
          visited={visited}
          visible={visible}
          key={key}
          name={blockInfo[blockIndex].key}
          onFinishFollow={this.handleFinishFollowLink(key)}
        />
      );
  }

  caculateStartAndFinishOfPointer(blockIndex) {
    const { blockInfo, nodeAboutToAppear } = this.state;
    let { x, y, visible, key } = blockInfo[blockIndex];
    let nextVisibleBlock = this.findNextBlock(blockIndex);

    const start = {
      x: x + LINKED_LIST_BLOCK_WIDTH - 10,
      y: y + LINKED_LIST_BLOCK_HEIGHT / 2,
    };
    let finish;
    if (nextVisibleBlock && visible) {
      let { x: x1, y: y1 } = nextVisibleBlock;

      if (nodeAboutToAppear.has(key)) {
        finish = { ...start };
      } else {
        finish = { x: x1, y: y1 + LINKED_LIST_BLOCK_HEIGHT / 2 };
      }
      return { start, finish };
    } else {
      return null;
    }
  }

  // Start block is the block which hold the link and point to another block
  isLinkNeedToBeFollowed(startBlockIndex) {
    const { nodeAboutToVisit } = this.state;
    const nextVisibleBlock = this.findNextBlock(startBlockIndex);
    return nextVisibleBlock.key === nodeAboutToVisit;
  }

  // Find block which is still visible or in about to appear state
  findNextBlock(index, getIndex = false) {
    const { blockInfo, nodeAboutToAppear } = this.state;
    for (let i = index + 1; i < blockInfo.length; i++) {
      const { visible, key } = blockInfo[i];
      if (visible || nodeAboutToAppear.has(key)) {
        return getIndex ? i : blockInfo[i];
      }
    }
  }

  // We will walk from currentStep to targetStep (backward)
  handleBackwardStep(targetStep) {
    const reverseHandler = {
      addNode: this.reverseAddNode,
      removeNode: this.reverseRemoveNode,
      visitNode: this.reverseVisitNode,
      focusNode: this.reverseFocusNode,
    };
    while (this.actionLogs.length) {
      const stepToReverse = this.getLastStepToReverse();
      if (!stepToReverse) return;
      const { step, name, params } = stepToReverse;
      if (step === targetStep) return;
      const handler = reverseHandler[name];
      handler && handler(...params);
      this.actionLogs.pop();
    }
  }

  getLastStepToReverse() {
    const length = this.actionLogs.length;
    return length ? this.actionLogs[length - 1] : null;
  }

  reverseAddNode = (value, nodeIndex) => {
    const newBlockInfo = this.produceNewBlockInfo('reverseAdd', {
      value,
      index: nodeIndex,
    });
    this.setState({ blockInfo: newBlockInfo });
  };

  reverseRemoveNode = nodeIndex => {
    const newBlockInfo = this.produceNewBlockInfo('reverseRemove', {
      index: nodeIndex,
    });
    this.setState({ blockInfo: newBlockInfo });
  };

  reverseVisitNode = nodeIndex => {
    const newBlockInfo = this.produceNewBlockInfo('reverseVisit', {
      index: nodeIndex,
    });
    this.setState({ blockInfo: newBlockInfo });
  };

  reverseFocusNode = nodeBeforeFocus => {
    this.setState({ currentFocusNode: nodeBeforeFocus });
  };

  renderHeadPointer() {
    const firstBlock = this.findNextBlock(-1);
    if (firstBlock) {
      const { x, y } = firstBlock;
      const start = {
        x: x + LINKED_LIST_BLOCK_WIDTH / 2,
        y: y + LINKED_LIST_BLOCK_HEIGHT * 3,
      };
      const finish = {
        x: x + LINKED_LIST_BLOCK_WIDTH / 2,
        y: y + LINKED_LIST_BLOCK_HEIGHT,
      };

      return (
        <g>
          <text
            x={x + LINKED_LIST_BLOCK_WIDTH / 2}
            y={y + LINKED_LIST_BLOCK_HEIGHT * 3}
            dominantBaseline='middle'
            textAnchor='middle'
          >
            HEAD
          </text>
          <path
            d={`M ${start.x} ${start.y - 15} L ${finish.x} ${finish.y + 10}`}
            className='default-stroke'
          />
          <path
            d={`M ${finish.x} ${finish.y + 15} l -5 2 l 5 -12 l 5 12 l -5 -2`}
            className='default-stroke'
          />
        </g>
      );
    } else return null;
  }

  render() {
    const { blockInfo, currentFocusNode } = this.state;
    const listMemoryBlock = blockInfo.map(blockInfo => (
      <MemoryBlock
        {...blockInfo}
        name={blockInfo.key}
        focus={currentFocusNode === blockInfo.key}
      />
    ));

    const listPointerLink = blockInfo
      .slice(0, -1)
      .map((_, index) => this.renderPointerLinkForMemoryBlock(index));

    return (
      <g>
        {this.renderHeadPointer()}
        {listMemoryBlock}
        {listPointerLink}
      </g>
    );
  }
}

export default LinkedList;
