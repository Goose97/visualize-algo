import React, { Component } from 'react';
import produce from 'immer';
import { omit, flatMap, groupBy, pick, isFunction, isEqual } from 'lodash';

import transformLinkedListModel from 'transformers/LinkedList';
import HeadPointer from './HeadPointer';
import LinkedListHTML from './LinkedListHTML';
import LinkedListMemoryBlock from './LinkedListMemoryBlock';
import LinkedListPointer from './LinkedListPointer';
import withReverseStep, { WithReverseStep } from 'hocs/withReverseStep';
import { getProgressDirection, keyExist } from 'utils';
import { IProps, IState } from './index.d';
import { Action, ActionWithStep, ObjectType } from 'types';
import { LinkedList } from 'types/ds/LinkedList';
import {
  LINKED_LIST_BLOCK_WIDTH,
  LINKED_LIST_BLOCK_HEIGHT,
} from '../../constants';

type PropsWithHoc = IProps & WithReverseStep<LinkedList.Model>;

export class LinkedListDS extends Component<PropsWithHoc, IState> {
  private initialLinkedListModel: LinkedList.Model;
  private wrapperRef: React.RefObject<SVGUseElement>;
  private randomId: number;

  constructor(props: PropsWithHoc) {
    super(props);

    this.initialLinkedListModel = this.initLinkedListModel(
      this.getInitialData(),
    );
    this.state = {
      linkedListModel: this.initialLinkedListModel,
      nodeAboutToAppear: new Set([]),
      isVisible: true,
    };
    this.wrapperRef = React.createRef();
    this.randomId = Math.round(Math.random() * 100000);
  }

  getInitialData() {
    const { initialData, data, controlled } = this.props;
    let result;
    if (controlled) result = data;
    else result = initialData;
    return result || [];
  }

  initLinkedListModel(data: Array<string | number>): LinkedList.Model {
    return data.map((value, index) => ({
      ...this.caculateBlockCoordinate(index),
      value,
      index,
      visible: true,
      visited: false,
      key: index,
      focus: false,
      pointer: index === data.length - 1 ? null : index + 1,
    }));
  }

  componentDidMount() {
    const { interactive } = this.props;
    if (interactive) this.injectHTMLIntoCanvas();
  }

  injectHTMLIntoCanvas() {
    const { linkedListModel } = this.state;
    const { handleExecuteApi } = this.props;
    setTimeout(() => {
      LinkedListHTML.renderToView({
        model: linkedListModel,
        wrapperElement: this.wrapperRef.current,
        coordinate: pick(this.props, ['x', 'y']),
        apiHandler: (apiName: string, params?: ObjectType<any>) => {
          if (!isFunction(handleExecuteApi)) return;
          const paramsToInvoke = this.produceParametersToExecuteApi(
            apiName,
            params,
          );
          handleExecuteApi(apiName, paramsToInvoke);
        },
      });
    }, 0);
  }

  produceParametersToExecuteApi = (
    apiName: string,
    params?: ObjectType<any>,
  ) => {
    const { linkedListModel } = this.state;
    switch (apiName) {
      case 'search': {
        //@ts-ignore
        const { key, value } = params;
        let valueToSearch = value;
        if (valueToSearch == null) {
          const nodeToSearch = linkedListModel.find(
            ({ key: nodeKey }) => nodeKey === key,
          );
          valueToSearch = nodeToSearch && nodeToSearch.value;
        }

        return { value: valueToSearch };
      }

      case 'insert': {
        //@ts-ignore
        const { key, value, index } = params;
        let indexToInsert = index;
        if (indexToInsert == null) {
          indexToInsert = linkedListModel.findIndex(
            ({ key: nodeKey }) => nodeKey === key,
          );
        }

        return { index: indexToInsert, value };
      }

      case 'delete': {
        //@ts-ignore
        const { key, index } = params;
        let indexToDelete = index;
        if (indexToDelete == null) {
          indexToDelete = linkedListModel.findIndex(
            ({ key: nodeKey }) => nodeKey === key,
          );
        }

        return { index: indexToDelete };
      }
    }
  };

  componentDidUpdate(prevProps: IProps) {
    const {
      currentStep,
      reverseToStep,
      saveStepSnapshots,
      totalStep,
      controlled,
      data,
    } = this.props;
    const { linkedListModel } = this.state;

    // Update according to algorithm progression
    if (keyExist(this.props, ['currentStep', 'totalStep', 'instructions'])) {
      switch (
        getProgressDirection(currentStep!, prevProps.currentStep!, totalStep!)
      ) {
        case 'forward':
          this.checkIfHTMLNeedToRerender(prevProps.currentStep!);
          saveStepSnapshots(linkedListModel, currentStep!);
          this.handleForward();
          break;

        case 'backward':
          reverseToStep(currentStep!);
          break;

        case 'fastForward':
          this.handleFastForward();
          break;

        case 'fastBackward':
          this.handleFastBackward();
          break;
      }
    }

    // Update according to controlled data
    if (controlled) {
      if (!isEqual(data, prevProps.data)) {
        this.setState({
          linkedListModel: data ? this.initLinkedListModel(data) : [],
        });
      }
    }
  }

  handleForward() {
    // Treat each action as a transformation function which take a linkedListModel
    // and return a new one. Consuming multiple actions is merely chaining those
    // transformations together
    // linkedListModel ---- action1 ----> linkedListModel1 ---- action2 ----> linkedListMode2 ---- action3 ----> linkedListModel3
    const { linkedListModel } = this.state;
    const { currentStep, instructions } = this.props;
    const actionsToMakeAtThisStep = instructions[currentStep!];
    if (!actionsToMakeAtThisStep || !actionsToMakeAtThisStep.length) return;

    // This consume pipeline have many side effect in each step. Each
    // method handle each action has their own side effect
    const newLinkedListModel = this.consumeMultipleActions(
      actionsToMakeAtThisStep,
      linkedListModel,
    );
    this.setState({ linkedListModel: newLinkedListModel });
  }

  consumeMultipleActions(
    actionList: Action<LinkedList.Method>[],
    currentModel: LinkedList.Model,
    onlyTranformData?: boolean,
  ): LinkedList.Model {
    // Treat each action as a transformation function which take a linkedListModel
    // and return a new one. Consuming multiple actions is merely chaining those
    // transformations together
    // linkedListModel ---- action1 ----> linkedListModel1 ---- action2 ----> linkedListMode2 ---- action3 ----> linkedListModel3
    return actionList.reduce<LinkedList.Model>((finalModel, action) => {
      // the main function of a handler is doing side effect before transform model
      // a handler must also return a new model
      // if no handler is specify, just transform model right away
      const { name, params } = action;
      //@ts-ignore
      const customHandler = this[name];

      if (typeof customHandler === 'function') {
        return customHandler(finalModel, params, onlyTranformData);
      } else {
        return transformLinkedListModel(finalModel, name, params);
      }
    }, currentModel);
  }

  checkIfHTMLNeedToRerender(previousStep: number) {
    const { instructions } = this.props;
    const actionMadeAtPreviousStep = instructions[previousStep] || [];
    if (!actionMadeAtPreviousStep || !actionMadeAtPreviousStep.length) return;

    // Check if in those action we made, if exists any action that affect the position layout
    // of the svg. Then we must rerender the html
    if (
      actionMadeAtPreviousStep.some(({ name }) =>
        ['insert', 'remove'].includes(name),
      )
    ) {
      this.injectHTMLIntoCanvas();
    }
  }

  getCurrentFocusNode() {
    const { linkedListModel } = this.state;
    const focusNode = linkedListModel.find(({ focus }) => !!focus);
    return focusNode ? focusNode.key : null;
  }

  caculateBlockCoordinate(nodeIndex: number) {
    return { x: nodeIndex * (2 * LINKED_LIST_BLOCK_WIDTH), y: 0 };
  }

  visit = (currentModel: LinkedList.Model, params: [number, number]) => {
    // Nếu node không phải node đầu tiên thì ta sẽ thực thi hàm followLinkToNode
    // Hàm này chịu trách nhiệm thực hiện animation, sau khi animation hoàn thành
    // callback handleAfterVisitAnimationFinish sẽ được thực hiện
    // Nếu node là node đầu tiên thì ta không có animation để thực hiện, focus luôn vào node
    const [nodeKeyToStart, nodeKeyToVisit] = params;
    if (nodeKeyToVisit !== 0) {
      this.followLinkToNode(nodeKeyToVisit);
      setTimeout(() => {
        this.handleAfterVisitAnimationFinish(nodeKeyToStart, nodeKeyToVisit);
      }, 400);

      return currentModel;
    } else {
      return transformLinkedListModel(currentModel, 'focus', [
        nodeKeyToVisit,
        false,
      ]);
    }
  };

  followLinkToNode = (nodeIndex: number) => {
    const { linkedListModel } = this.state;
    this.setState({ nodeAboutToVisit: linkedListModel[nodeIndex].key });
  };

  handleAfterVisitAnimationFinish = (
    startNodeKey: number | null,
    destinationNodeKey: number,
  ) => {
    // mark the node who hold the link as visited
    const { linkedListModel } = this.state;
    let newLinkedListModel = linkedListModel;
    if (typeof startNodeKey === 'number') {
      newLinkedListModel = transformLinkedListModel(
        newLinkedListModel,
        'visited',
        [startNodeKey],
      );
    }

    // mark the node on the other end as current focus
    newLinkedListModel = transformLinkedListModel(newLinkedListModel, 'focus', [
      destinationNodeKey,
      false,
    ]);

    this.setState({
      nodeAboutToVisit: undefined,
      linkedListModel: newLinkedListModel,
    });
  };

  insert = (
    currentModel: LinkedList.Model,
    params: [number, number, number],
    onlyTranformData?: boolean,
  ) => {
    const [value, prevNodeKey, newNodeKey] = params;
    const newNode = this.produceNewNodeToInsert({
      currentModel,
      value,
      prevNodeKey,
      newNodeKey,
    });
    let newLinkedListModel = transformLinkedListModel(currentModel, 'insert', [
      newNode,
      prevNodeKey,
    ]);

    if (!onlyTranformData) {
      // We have to turn off visibility for the new node
      // For the purpose of doing animation
      newLinkedListModel = produce(newLinkedListModel, draft => {
        let newBlock = draft.find(({ key }) => key === newNodeKey);
        newBlock!.visible = false;
      });

      this.addOrRemoveNodeAboutToAppear(newNodeKey);
      setTimeout(() => {
        this.toggleNodeVisibility(newNodeKey);
        this.addOrRemoveNodeAboutToAppear(newNodeKey);
      }, 800);
    }

    return newLinkedListModel;
  };

  produceNewNodeToInsert(params: {
    value: number;
    prevNodeKey: number;
    newNodeKey: number;
    currentModel: LinkedList.Model;
  }) {
    const { value, prevNodeKey, newNodeKey, currentModel } = params;
    const previousNodeIndex = currentModel.findIndex(
      ({ key }) => key === prevNodeKey,
    );
    return {
      ...this.caculateBlockCoordinate(previousNodeIndex + 1),
      value,
      index: previousNodeIndex + 1,
      key: newNodeKey,
      visible: true,
    };
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

  toggleNodeVisibility(nodeKey: number) {
    const { linkedListModel } = this.state;
    const newPosition = produce(linkedListModel, draft => {
      const targetBlock = draft.find(({ key }) => key === nodeKey);
      const oldVisibleState = targetBlock!.visible;
      targetBlock!.visible = !oldVisibleState;
    });
    this.setState({ linkedListModel: newPosition });
  }

  caculateStartAndFinishOfPointer(nodeIndex: number) {
    const { linkedListModel, nodeAboutToAppear } = this.state;
    let { x, y, visible, key, pointer } = linkedListModel[nodeIndex];
    let nextVisibleBlock = pointer ? this.findNodeByKey(pointer) : null;

    const start = {
      x: x + LINKED_LIST_BLOCK_WIDTH - 10,
      y: y + LINKED_LIST_BLOCK_HEIGHT / 2,
    };
    let finish;
    if (nextVisibleBlock && visible) {
      let { x: x1, y: y1 } = nextVisibleBlock as LinkedList.NodeModel;

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

  findNodeByKey(key: number | null) {
    const { linkedListModel } = this.state;
    const nodeWithKey = linkedListModel.find(
      ({ key: nodeKey }) => key === nodeKey,
    );
    return nodeWithKey || null;
  }

  renderPointerLinkForMemoryBlock(nodeIndex: number) {
    const { linkedListModel, nodeAboutToAppear } = this.state;
    const { key, pointer, visible, visited } = linkedListModel[nodeIndex];
    const pointToNode = this.findNodeByKey(pointer);
    return (
      <LinkedListPointer
        nodeAboutToAppear={nodeAboutToAppear}
        key={key}
        from={key}
        to={pointer}
        linkedListModel={linkedListModel}
        following={this.isLinkNeedToBeFollowed(nodeIndex)}
        visited={visited}
        visible={visible && pointToNode?.visible}
      />
    );
  }

  // Start block is the block which hold the link and point to another block
  isLinkNeedToBeFollowed(startBlockIndex: number) {
    const { nodeAboutToVisit } = this.state;
    const nextVisibleBlock = this.findNextBlock(startBlockIndex) as
      | LinkedList.NodeModel
      | undefined;
    return nextVisibleBlock && nextVisibleBlock.key === nodeAboutToVisit;
  }

  // Find block which is still visible or in about to appear state
  findNextBlock(index: number, getIndex = false) {
    const { linkedListModel, nodeAboutToAppear } = this.state;
    for (let i = index + 1; i < linkedListModel.length; i++) {
      const { visible, key } = linkedListModel[i];
      if (visible || nodeAboutToAppear.has(key)) {
        return getIndex ? i : linkedListModel[i];
      }
    }
  }

  handleReverse = (stateOfPreviousStep: LinkedList.Model) => {
    this.setState({ linkedListModel: stateOfPreviousStep });
  };

  handleFastForward() {
    const { linkedListModel } = this.state;
    const { instructions, saveStepSnapshots } = this.props;
    let allActions: ActionWithStep<LinkedList.Method>[] = [];
    for (let i = 0; i < instructions.length; i++) {
      // Replace visit action with vist + focus
      // also add step attribute to each action
      const replacedActions: ActionWithStep<LinkedList.Method>[] = flatMap(
        instructions[i],
        action => {
          const { name, params } = action;
          return name === 'visit'
            ? [
                { name: 'visited', params: params.slice(0, 1), step: i },
                { name: 'focus', params: params.slice(1), step: i },
              ]
            : { ...action, step: i };
        },
      );

      allActions.push(...replacedActions);
    }

    const actionsGroupedByStep = groupBy(allActions, item => item.step);

    // Loop through all the action one by one and keep updating the final model
    let finalLinkedListModel = Object.entries(actionsGroupedByStep).reduce<
      LinkedList.Model
    >((currentModel, [step, actionsToMakeAtThisStep]) => {
      saveStepSnapshots(currentModel, +step);
      return this.consumeMultipleActions(
        actionsToMakeAtThisStep,
        currentModel,
        true,
      );
    }, linkedListModel);
    this.updateWithoutAnimation(finalLinkedListModel);
  }

  handleFastBackward() {
    this.updateWithoutAnimation(this.initialLinkedListModel);
  }

  updateWithoutAnimation(newLinkedListModel: LinkedList.Model) {
    this.setState(
      { linkedListModel: newLinkedListModel, isVisible: false },
      () => this.setState({ isVisible: true }),
    );
  }

  render() {
    const { headArrowVisible } = this.props;
    const { linkedListModel, isVisible } = this.state;
    const listMemoryBlock = linkedListModel.map(linkedListNode => (
      <LinkedListMemoryBlock
        {...omit(linkedListNode, ['key'])}
        key={linkedListNode.key}
      />
    ));
    const listPointerLink = linkedListModel.map((_, index) =>
      this.renderPointerLinkForMemoryBlock(index),
    );

    return (
      isVisible && (
        <>
          <use
            href={`#linked-list-${this.randomId}`}
            {...pick(this.props, ['x', 'y'])}
            ref={this.wrapperRef}
          />
          <defs>
            <g id={`linked-list-${this.randomId}`}>
              {headArrowVisible && (
                <HeadPointer headBlock={this.findNextBlock(-1)} />
              )}
              {listMemoryBlock}
              {listPointerLink}
            </g>
          </defs>
        </>
      )
    );
  }
}

export default withReverseStep<LinkedList.Model, PropsWithHoc>(LinkedListDS);
