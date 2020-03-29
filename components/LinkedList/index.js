import React, { Component } from 'react';
import produce from 'immer';
import { isEqual } from 'lodash';

import { MemoryBlock, PointerLink } from 'components';
import transformData from 'components/DataTransformer';
import HeadPointer from './HeadPointer';
import withReverseStep from 'hocs/withReverseStep';

export class LinkedList extends Component {
  constructor(props) {
    super(props);

    this.data = props.currentState.data;
    this.key = this.data.length;
    this.state = {
      blockInfo: this.initiateMemoryBlockInfo(),
      nodeAboutToAppear: new Set([]),
      currentFocusNode: props.currentState.currentNode,
    };
    this.actionLogs = [];
  }

  pushReverseAction(actionName, params) {
    const { currentStep, saveReverseLogs } = this.props;
    saveReverseLogs(actionName, params, currentStep);
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
    const {
      currentState: { data, currentNode },
      currentStep,
      reverseToStep,
    } = this.props;

    switch (this.getProgressDirection(prevProps.currentStep)) {
      case 'forward':
        this.getActionAndParams(prevProps).forEach(({ name, params }) =>
          this[name](...params),
        );
        break;

      case 'backward':
        reverseToStep(currentStep);
        break;

      case 'fastForward':
        console.log('fastForward');
        this.handleFastForward();
        break;

      case 'fastBackward':
        console.log('fastBackward');
        break;
    }
  }

  getProgressDirection(previousStep) {
    const { totalStep, currentStep } = this.props;
    if (currentStep === previousStep) return 'stay';
    if (currentStep > previousStep) {
      if (currentStep - previousStep === 1) return 'forward';
      else if (currentStep === totalStep) return 'fastForward';
    } else {
      if (previousStep - currentStep === 1) return 'backward';
      else if (currentStep === 0) return 'fastBackward';
    }
  }

  getActionAndParams(prevProps) {
    const {
      currentState: { data: newData, currentNode },
    } = this.props;
    let actions = [];

    // Detect changes in data
    const oldData = prevProps.currentState.data;
    for (let i = 0; i < newData.length; i++) {
      let action;
      if (oldData[i] !== newData[i]) {
        // there is some changes
        if (oldData.length < newData.length) {
          action = {
            name: 'addNode',
            params: [newData[i], i],
          };
        } else if (oldData.length > newData.length) {
          action = {
            name: 'removeNode',
            params: [i],
          };
        }

        actions.push(action);
        break;
      }
    }

    // Detect changes in currentNode
    if (currentNode !== prevProps.currentState.currentNode) {
      actions.push({
        name: 'visitNode',
        params: [currentNode],
      });
    }

    return actions;
  }

  produceNewState(currentState, action) {
    const { blockInfo } = currentState;
    const { name, params } = action;
    switch (name) {
      case 'addNode': {
        const [value, nodeIndex] = params;
        const newNodeData = {
          ...this.caculateBlockCoordinate(nodeIndex),
          value,
          index: nodeIndex,
          key: this.key++,
        };
        const newBlockInfo = transformData('linkedList', blockInfo, 'add', {
          nodeData: newNodeData,
        });
        return {
          blockInfo: newBlockInfo,
        };
      }

      case 'removeNode': {
        const [index] = params;
        const newBlockInfo = transformData('linkedList', blockInfo, 'remove', {
          index,
        });
        return {
          blockInfo: newBlockInfo,
        };
      }

      case 'visitNode': {
        const [index] = params;
        return {
          currentFocusNode: index,
        };
      }
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
      ...this.caculateBlockCoordinate(index),
      value,
      visible: true,
      visited: false,
      key: index,
    }));
  }

  caculateBlockCoordinate(blockIndex) {
    const { x: baseX, y: baseY } = this.props;
    return { x: baseX + blockIndex * (2 * LINKED_LIST_BLOCK_WIDTH), y: baseY };
  }

  focusNode(nodeIndex) {
    const { currentFocusNode } = this.state;
    this.pushReverseAction('reverseFocusNode', [currentFocusNode]);
    this.setState({ currentFocusNode: nodeIndex });
  }

  visitNode(nodeIndex) {
    const { currentFocusNode } = this.state;
    this.pushReverseAction('reverseVisitNode', [currentFocusNode]);
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
    const params = [nodeIndex];
    this.pushReverseAction('reverseRemoveNode', params);
    const newState = this.produceNewState(this.state, {
      name: 'removeNode',
      params,
    });
    this.setState(newState);
  }

  addNode(value, nodeIndex) {
    const params = [value, nodeIndex];
    this.pushReverseAction('reverseAddNode', params);
    const newState = this.produceNewState(this.state, {
      name: 'addNode',
      params,
    });
    this.setState(newState);

    const keyOfNewNode = this.key - 1;
    this.addOrRemoveNodeAboutToAppear(keyOfNewNode);
    setTimeout(() => {
      this.toggleNodeVisibility(nodeIndex);
      this.addOrRemoveNodeAboutToAppear(keyOfNewNode);
    }, 800);
  }

  produceNewBlockInfo(operation, payload) {
    const { blockInfo } = this.state;
    return transformData('linkedList', blockInfo, operation, payload);
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

  handleFastForward() {
    const { fullState, currentStep } = this.props;
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
        <HeadPointer headBlock={this.findNextBlock(-1)} />
        {listMemoryBlock}
        {listPointerLink}
      </g>
    );
  }
}

export default withReverseStep(LinkedList);
