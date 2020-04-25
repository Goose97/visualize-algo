import React, { Component } from 'react';
import produce from 'immer';

import { MemoryBlock, PointerLink } from 'components';
import transformData from 'components/DataTransformer';
import HeadPointer from './HeadPointer';
import { promiseSetState } from 'utils';
import { withReverseStep } from 'hocs';
import { LinkedListModel, LinkedListMethod, IProps, IState } from './index.d';
import { Action } from 'types';

export class LinkedList extends Component<IProps, IState> {
  private initialBlockInfo: LinkedListModel;
  private key: number;
  private promiseSetState: (state: Record<string, any>) => Promise<undefined>;
  constructor(props: IProps) {
    super(props);

    this.initialBlockInfo = this.initiateMemoryBlockInfo(props);
    this.state = {
      blockInfo: this.initialBlockInfo,
      nodeAboutToAppear: new Set([]),
      isVisible: true,
    };
    this.key = this.state.blockInfo.length;
    this.promiseSetState = promiseSetState.bind(this);
  }

  initiateMemoryBlockInfo(props: IProps) {
    const { initialData } = props;
    return initialData.map((value, index) => ({
      ...this.caculateBlockCoordinate(index),
      value,
      index,
      visible: true,
      visited: false,
      key: index,
      focus: false,
    }));
  }

  pushReverseAction(actionName: string, params: any[]) {
    const { currentStep, saveReverseLogs } = this.props;
    saveReverseLogs(actionName, params, currentStep);
  }

  componentDidUpdate(prevProps: IProps) {
    const { currentStep, reverseToStep, instructions } = this.props;

    switch (this.getProgressDirection(prevProps.currentStep)) {
      case 'forward':
        const actionsToMakeAtThisStep = instructions[currentStep] || [];
        actionsToMakeAtThisStep.forEach(({ name, params }) =>
          //@ts-ignore
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
        this.handleFastBackward();
        break;
    }
  }

  getProgressDirection(previousStep: number) {
    const { totalStep, currentStep } = this.props;
    if (previousStep === undefined) return 'forward';
    if (currentStep === previousStep) return 'stay';
    if (currentStep > previousStep) {
      if (currentStep - previousStep === 1) return 'forward';
      else if (currentStep === totalStep) return 'fastForward';
    } else {
      if (previousStep - currentStep === 1) return 'backward';
      else if (currentStep === 0) return 'fastBackward';
    }
  }

  // getActionAndParams(previousState, currentState, noAnimation = false) {
  //   const { data: newData, currentNode } = currentState;
  //   let actions = [];

  //   // Detect changes in data
  //   const oldData = previousState.data;
  //   for (let i = 0; i < Math.max(newData.length, oldData.length); i++) {
  //     let action;
  //     if (oldData[i] !== newData[i]) {
  //       // there is some changes
  //       if (oldData.length < newData.length) {
  //         action = {
  //           name: 'addNode',
  //           params: [newData[i], i],
  //         };
  //       } else if (oldData.length > newData.length) {
  //         action = {
  //           name: 'removeNode',
  //           params: [i],
  //         };
  //       }

  //       action && actions.push(action);
  //       break;
  //     }
  //   }

  //   // Detect changes in currentNode
  //   if (currentNode !== previousState.currentNode) {
  //     // Trường hợp currentNode === null nghĩa là đang unfocus tất cả các node
  //     if (noAnimation || currentNode === null) {
  //       actions.push({
  //         name: 'focusNode',
  //         params: [currentNode],
  //       });
  //     } else {
  //       actions.push({
  //         name: 'visitNode',
  //         params: [currentNode],
  //       });
  //     }
  //   }

  //   return actions;
  // }

  // blockInfo is the single source of truth - all the data structure state is hold
  // in this object
  produceNewState(
    action: Action,
    blockInfo = this.state.blockInfo,
  ): LinkedListModel {
    const { name, params } = action;
    switch (name) {
      case 'addNode': {
        const [value, nodeIndex] = params;
        const newNodeData = {
          ...this.caculateBlockCoordinate(nodeIndex),
          value,
          index: nodeIndex,
          key: this.key++,
          visible: true,
        };
        const newBlockInfo = transformData('linkedList', blockInfo, 'add', {
          nodeData: newNodeData,
        });
        return newBlockInfo;
      }

      case 'reverseAddNode': {
        const [value, index] = params;
        const newBlockInfo = transformData(
          'linkedList',
          blockInfo,
          'reverseAdd',
          {
            index,
            value,
          },
        );
        return newBlockInfo;
      }

      case 'removeNode': {
        const [index] = params;
        const newBlockInfo = transformData('linkedList', blockInfo, 'remove', {
          index,
        });
        return newBlockInfo;
      }

      case 'reverseRemoveNode': {
        const [index] = params;
        const newBlockInfo = transformData(
          'linkedList',
          blockInfo,
          'reverseRemove',
          {
            index,
          },
        );
        return newBlockInfo;
      }

      case 'visitNode': {
        return blockInfo;
      }

      case 'focusNode': {
        const [index] = params;
        const newBlockInfo = transformData('linkedList', blockInfo, 'focus', {
          index,
        });
        return newBlockInfo;
      }

      default:
        return blockInfo;
    }
  }

  getCurrentFocusNode() {
    const { blockInfo } = this.state;
    return blockInfo.findIndex(({ focus }) => !!focus);
  }

  caculateBlockCoordinate(blockIndex: number) {
    const { x: baseX, y: baseY } = this.props;
    //@ts-ignore
    return { x: baseX + blockIndex * (2 * LINKED_LIST_BLOCK_WIDTH), y: baseY };
  }

  focusNode(nodeIndex: number) {
    const currentFocusNode = this.getCurrentFocusNode();
    this.pushReverseAction('reverseFocusNode', [currentFocusNode]);

    const action = {
      name: 'focusNode',
      params: [nodeIndex],
    };
    const newBlockInfo = this.produceNewState(action);
    this.setState({ blockInfo: newBlockInfo });
  }

  visitNode(nodeIndex: number) {
    // Nếu node không phải node đầu tiên thì ta sẽ thực thi hàm followLinkToNode
    // Hàm này chịu trách nhiệm thực hiện animation, sau khi animation hoàn thành
    // callbackk handleFinishFollowLink sẽ được thực hiện
    // Nếu node là node đầu tiên thì ta không có animation để thực hiện, focus luôn vào node
    const currentFocusNode = this.getCurrentFocusNode();
    this.pushReverseAction('reverseVisitNode', [currentFocusNode]);
    if (nodeIndex !== 0) {
      this.followLinkToNode(nodeIndex);
    } else {
      this.focusNode(nodeIndex);
    }
  }

  followLinkToNode(nodeIndex: number) {
    const { blockInfo } = this.state;
    this.setState({ nodeAboutToVisit: blockInfo[nodeIndex].key });
  }

  handleFinishFollowLink = (startBlockIndex: number) => () => {
    // mark the node who hold the link as visited
    const destinationNodeIndex = this.findNextBlock(
      startBlockIndex,
      true,
    ) as number;
    this.setState({
      nodeAboutToVisit: undefined,
      blockInfo: this.produceNewBlockInfo('visit', {
        index: startBlockIndex,
      }),
    });

    // mark the node on the other end as current focus
    this.focusNode(destinationNodeIndex);
  };

  removeNode(nodeIndex: number) {
    const params = [nodeIndex];
    this.pushReverseAction('reverseRemoveNode', params);

    const action = {
      name: 'removeNode',
      params,
    };
    const newBlockInfo = this.produceNewState(action);
    this.setState({ blockInfo: newBlockInfo });
  }

  addNode(value: number, nodeIndex: number) {
    const params = [value, nodeIndex];
    this.pushReverseAction('reverseAddNode', params);

    const action = {
      name: 'addNode',
      params,
    };
    let newBlockInfo = this.produceNewState(action);
    // We have to turn off visibility for the new node
    // For the purpose of doing animation
    newBlockInfo = produce(newBlockInfo, draft => {
      const nodeTurnVisibleFalse = { ...draft[nodeIndex], visible: false };
      draft[nodeIndex] = nodeTurnVisibleFalse;
    });
    this.setState({ blockInfo: newBlockInfo });

    const keyOfNewNode = this.key - 1;
    this.addOrRemoveNodeAboutToAppear(keyOfNewNode);
    setTimeout(() => {
      this.toggleNodeVisibility(nodeIndex);
      this.addOrRemoveNodeAboutToAppear(keyOfNewNode);
    }, 800);
  }

  produceNewBlockInfo(operation: LinkedListMethod, payload: Object) {
    const { blockInfo } = this.state;
    return transformData('linkedList', blockInfo, operation, payload);
  }

  // nodeAboutToAppear is a list of node which already in the state
  // but about to get animated to appear
  addOrRemoveNodeAboutToAppear(nodeKey: number) {
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

  toggleNodeVisibility(nodeIndex: number) {
    const { blockInfo } = this.state;
    const newPosition = produce(blockInfo, draft => {
      const oldVisibleState = draft[nodeIndex].visible;
      draft[nodeIndex].visible = !oldVisibleState;
    });
    this.setState({ blockInfo: newPosition });
  }

  renderPointerLinkForMemoryBlock(blockIndex: number) {
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

  caculateStartAndFinishOfPointer(blockIndex: number) {
    const { blockInfo, nodeAboutToAppear } = this.state;
    let { x, y, visible, key } = blockInfo[blockIndex];
    let nextVisibleBlock = this.findNextBlock(blockIndex);

    const start = {
      //@ts-ignore
      x: x + LINKED_LIST_BLOCK_WIDTH - 10,
      //@ts-ignore
      y: y + LINKED_LIST_BLOCK_HEIGHT / 2,
    };
    let finish;
    if (nextVisibleBlock && visible) {
      let { x: x1, y: y1 } = nextVisibleBlock;

      if (nodeAboutToAppear.has(key)) {
        finish = { ...start };
      } else {
        //@ts-ignore
        finish = { x: x1, y: y1 + LINKED_LIST_BLOCK_HEIGHT / 2 };
      }
      return { start, finish };
    } else {
      return null;
    }
  }

  // Start block is the block which hold the link and point to another block
  isLinkNeedToBeFollowed(startBlockIndex: number) {
    const { nodeAboutToVisit } = this.state;
    const nextVisibleBlock = this.findNextBlock(startBlockIndex) as
      | LinkedListModel
      | undefined;
    return nextVisibleBlock && nextVisibleBlock.key === nodeAboutToVisit;
  }

  // Find block which is still visible or in about to appear state
  findNextBlock(index: number, getIndex = false) {
    const { blockInfo, nodeAboutToAppear } = this.state;
    for (let i = index + 1; i < blockInfo.length; i++) {
      const { visible, key } = blockInfo[i];
      if (visible || nodeAboutToAppear.has(key)) {
        return getIndex ? i : blockInfo[i];
      }
    }
  }

  reverseAddNode = (value: number, nodeIndex: number) => {
    const action = {
      name: 'reverseAddNode',
      params: [value, nodeIndex],
    };
    const newBlockInfo = this.produceNewState(action);
    this.promiseSetState({ blockInfo: newBlockInfo });
  };

  reverseRemoveNode = (nodeIndex: number) => {
    const action = {
      name: 'reverseRemoveNode',
      params: [nodeIndex],
    };
    const newBlockInfo = this.produceNewState(action);
    this.promiseSetState({ blockInfo: newBlockInfo });
  };

  // TODO need change
  reverseVisitNode = (nodeIndex: number) => {
    const newBlockInfo = this.produceNewBlockInfo('reverseVisit', {
      index: nodeIndex,
    });
    this.promiseSetState({ blockInfo: newBlockInfo });
  };

  reverseFocusNode = (previousFocusNode: number) => {
    const newBlockInfo = this.produceNewBlockInfo('reverseFocus', {
      index: previousFocusNode,
    });
    return this.promiseSetState({ blockInfo: newBlockInfo });
  };

  handleFastForward() {
    const { blockInfo } = this.state;
    const { instructions } = this.props;

    const allActions = instructions
      .reduce((acc, instruction) => acc.concat(instruction), [])
      .map(instruction => {
        const { name, params } = instruction;
        return name === 'visitNode'
          ? { name: 'focusNode', params }
          : instruction;
      });
    let finalBlockInfo = blockInfo;
    for (let i = 0; i < allActions.length; i++) {
      finalBlockInfo = this.produceNewState(allActions[i], finalBlockInfo);
    }

    this.updateWithoutAnimation(finalBlockInfo);
  }

  handleFastBackward() {
    this.updateWithoutAnimation(this.initialBlockInfo);
  }

  updateWithoutAnimation(newBlockInfo: LinkedListModel) {
    this.setState({ blockInfo: newBlockInfo, isVisible: false }, () =>
      this.setState({ isVisible: true }),
    );
  }

  render() {
    const { blockInfo, isVisible } = this.state;
    const listMemoryBlock = blockInfo.map(blockInfo => (
      <MemoryBlock
        {...blockInfo}
        name={blockInfo.key}
        focus={!!blockInfo.focus}
      />
    ));

    const listPointerLink = blockInfo
      .slice(0, -1)
      .map((_, index) => this.renderPointerLinkForMemoryBlock(index));

    return (
      isVisible && (
        <g>
          <HeadPointer headBlock={this.findNextBlock(-1)} />
          {listMemoryBlock}
          {listPointerLink}
        </g>
      )
    );
  }
}

export default withReverseStep(LinkedList);
