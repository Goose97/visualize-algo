import React, { Component } from 'react';
import produce from 'immer';
import { omit, pick, isFunction } from 'lodash';

import { CanvasObserver } from 'components';
import withDSCore, { WithDSCore } from 'hocs/withDSCore';
import transformLinkedListModel from 'transformers/LinkedList';
import HeadPointer from './HeadPointer';
import LinkedListHTML from './LinkedListHTML';
import LinkedListMemoryBlock from './LinkedListMemoryBlock';
import LinkedListPointer from './LinkedListPointer';
import { IProps, IState } from './index.d';
import { ObjectType } from 'types';
import { LinkedList } from 'types/ds/LinkedList';
import { LINKED_LIST_BLOCK_WIDTH } from '../../constants';

type PropsWithHoc = IProps & WithDSCore<LinkedList.Model>;

export class LinkedListDS extends Component<PropsWithHoc, IState> {
  // private initialLinkedListModel: LinkedList.Model;
  private wrapperRef: React.RefObject<SVGUseElement>;
  private randomId: number;

  constructor(props: PropsWithHoc) {
    super(props);

    this.state = {
      nodeAboutToAppear: new Set([]),
    };
    this.wrapperRef = React.createRef();
    this.randomId = Math.round(Math.random() * 100000);

    // Register custom transformer
    props.registerCustomTransformer({
      visit: this.visit,
      insert: this.insert,
    });

    // Register HTML injector
    props.registerHTMLInjector(this.injectHTMLIntoCanvas);
  }

  static initLinkedListModel(props: IProps): LinkedList.Model {
    const getInitialData = () => {
      const { initialData, data, controlled } = props;
      let result;
      if (controlled) result = data;
      else result = initialData;
      return result || [];
    };

    const data = getInitialData();
    return data.map((value, index) => ({
      ...LinkedListDS.caculateBlockCoordinate(index),
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
    if (interactive) {
      this.injectHTMLIntoCanvas();
      CanvasObserver.register(this.injectHTMLIntoCanvas);
    }
  }

  injectHTMLIntoCanvas = () => {
    const { handleExecuteApi, dropdownDisabled, model } = this.props;
    setTimeout(() => {
      LinkedListHTML.renderToView({
        model,
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
        disabled: dropdownDisabled,
      });
    }, 0);
  };

  produceParametersToExecuteApi = (
    apiName: string,
    params?: ObjectType<any>,
  ) => {
    const { model } = this.props;
    switch (apiName) {
      case 'search': {
        //@ts-ignore
        const { key, value } = params;
        let valueToSearch = value;
        if (valueToSearch == null) {
          const nodeToSearch = model.find(
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
          indexToInsert = model.findIndex(
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
          indexToDelete = model.findIndex(
            ({ key: nodeKey }) => nodeKey === key,
          );
        }

        return { index: indexToDelete };
      }
    }
  };

  componentDidUpdate(prevProps: IProps) {
    this.checkIfHTMLNeedToRerender(prevProps.currentStep!);
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
    const { model } = this.props;
    const focusNode = model.find(({ focus }) => !!focus);
    return focusNode ? focusNode.key : null;
  }

  static caculateBlockCoordinate(nodeIndex: number) {
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
    const { model } = this.props;
    this.setState({ nodeAboutToVisit: model[nodeIndex].key });
  };

  handleAfterVisitAnimationFinish = (
    startNodeKey: number | null,
    destinationNodeKey: number,
  ) => {
    // mark the node who hold the link as visited
    const { model, updateModel } = this.props;
    let newLinkedListModel = model;
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
    });
    updateModel(newLinkedListModel);
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
      ...LinkedListDS.caculateBlockCoordinate(previousNodeIndex + 1),
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
    const { model, updateModel } = this.props;
    const newPosition = produce(model, draft => {
      const targetBlock = draft.find(({ key }) => key === nodeKey);
      const oldVisibleState = targetBlock!.visible;
      targetBlock!.visible = !oldVisibleState;
    });
    updateModel(newPosition);
  }

  renderPointerLinkForMemoryBlock(nodeIndex: number) {
    const { nodeAboutToAppear } = this.state;
    const { model } = this.props;
    const { key, pointer, visible, visited } = model[nodeIndex];
    const pointToNode = this.findNodeByKey(pointer);
    return (
      <LinkedListPointer
        nodeAboutToAppear={nodeAboutToAppear}
        key={key}
        from={key}
        to={pointer}
        linkedListModel={model}
        following={this.isLinkNeedToBeFollowed(nodeIndex)}
        visited={visited}
        visible={visible && pointToNode?.visible}
      />
    );
  }

  findNodeByKey(key: number | null) {
    const { model } = this.props;
    const nodeWithKey = model.find(({ key: nodeKey }) => key === nodeKey);
    return nodeWithKey || null;
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
    const { nodeAboutToAppear } = this.state;
    const { model } = this.props;
    for (let i = index + 1; i < model.length; i++) {
      const { visible, key } = model[i];
      if (visible || nodeAboutToAppear.has(key)) {
        return getIndex ? i : model[i];
      }
    }
  }

  render() {
    const { headArrowVisible, model } = this.props;
    const listMemoryBlock = model.map(linkedListNode => (
      <LinkedListMemoryBlock
        {...omit(linkedListNode, ['key'])}
        key={linkedListNode.key}
      />
    ));
    const listPointerLink = model.map((_, index) =>
      this.renderPointerLinkForMemoryBlock(index),
    );

    return (
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
    );
  }
}

export default withDSCore({
  initModel: LinkedListDS.initLinkedListModel,
  dataTransformer: transformLinkedListModel,
})(LinkedListDS);
