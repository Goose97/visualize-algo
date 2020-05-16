import React, { Component } from 'react';
import { pick } from 'lodash';

import QueueItem from './QueueItem';
import {
  QUEUE_BLOCK_WIDTH,
  QUEUE_BLOCK_HEIGHT,
  QUEUE_BLOCK_GAP,
} from '../../constants';
import { QueueModel, IState, IProps, QueueItemModel } from './index.d';
import withReverseStep, { WithReverseStep } from 'hocs/withReverseStep';
import { Action } from 'types';
import transformModel from './ModelTransformer';
import { getProgressDirection } from 'utils';

type PropsWithHoc = IProps & WithReverseStep<QueueModel>;

export class Queue extends Component<PropsWithHoc, IState> {
  constructor(props: PropsWithHoc) {
    super(props);

    this.state = {
      queueModel: this.initQueueModel(),
    };
  }

  initQueueModel() {
    const { initialData } = this.props;
    return initialData.map((value, index) => ({
      value,
      visible: true,
      key: initialData.length - 1 - index,
      offsetFromFront: initialData.length - 1 - index,
    }));
  }

  componentDidUpdate(prevProps: IProps) {
    const { currentStep, reverseToStep, totalStep } = this.props;

    switch (
      getProgressDirection(currentStep, prevProps.currentStep, totalStep)
    ) {
      case 'forward':
        this.saveModelSnapshotAtCurrentStep();
        this.handleForward();
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

  saveModelSnapshotAtCurrentStep() {
    const { currentStep, saveStepSnapshots } = this.props;
    const { queueModel } = this.state;
    if (typeof currentStep === 'number')
      saveStepSnapshots(queueModel, currentStep);
  }

  handleForward() {
    // Treat each action as a transformation function which take a linkedListModel
    // and return a new one. Consuming multiple actions is merely chaining those
    // transformations together
    // linkedListModel ---- action1 ----> linkedListModel1 ---- action2 ----> linkedListMode2 ---- action3 ----> linkedListModel3
    const { queueModel } = this.state;
    const { currentStep, instructions } = this.props;
    const actionsToMakeAtThisStep = instructions[currentStep];
    if (!actionsToMakeAtThisStep || !actionsToMakeAtThisStep.length) return;

    // This consume pipeline have many side effect in each step. Each
    // method handle each action has their own side effect
    const newQueueModel = this.consumeMultipleActions(
      actionsToMakeAtThisStep,
      queueModel,
    );
    this.setState({ queueModel: newQueueModel });
  }

  consumeMultipleActions(
    actionList: Action[],
    currentModel: QueueModel,
  ): QueueModel {
    // Treat each action as a transformation function which take a linkedListModel
    // and return a new one. Consuming multiple actions is merely chaining those
    // transformations together
    // linkedListModel ---- action1 ----> linkedListModel1 ---- action2 ----> linkedListMode2 ---- action3 ----> linkedListModel3
    let finalQueueModel = currentModel;
    actionList.forEach(({ name, params }) => {
      //@ts-ignore
      finalQueueModel = this[name](finalQueueModel, params);
    });

    return finalQueueModel;
  }

  renderQueueBoundary() {
    const { x, y } = this.props;
    const queueWidth = this.caculateWidthOfQueue();
    const upperBound = (
      <path
        className='default-stroke has-transition'
        d={`M ${x + QUEUE_BLOCK_WIDTH} ${
          y - 20
        } l -2 2 l 8 -2 l -8 -2 l 2 2 h ${-queueWidth}`}
      ></path>
    );
    const lowerBound = (
      <path
        className='default-stroke has-transition'
        d={`M ${x + QUEUE_BLOCK_WIDTH} ${
          y + QUEUE_BLOCK_HEIGHT + 20
        } l -2 2 l 8 -2 l -8 -2 l 2 2 h ${-queueWidth}`}
      ></path>
    );
    return (
      <>
        {upperBound}
        {lowerBound}
      </>
    );
  }

  caculateWidthOfQueue() {
    const { queueModel } = this.state;
    const numberOfQueueItem = queueModel.length;
    return (
      numberOfQueueItem * (QUEUE_BLOCK_WIDTH + QUEUE_BLOCK_GAP) -
      QUEUE_BLOCK_GAP
    );
  }

  dequeue(currentModel: QueueModel, params: []) {
    const newModel = transformModel(currentModel, 'dequeue', params);
    return newModel;
  }

  enqueue(currentModel: QueueModel, params: [number]) {
    const queueItemToEnqueue: QueueItemModel = {
      value: params[0],
      visible: true,
      offsetFromFront: currentModel[0].offsetFromFront + 1,
      key: currentModel[0].key + 1,
      isNew: true,
    };
    const newModel = transformModel(currentModel, 'enqueue', [
      queueItemToEnqueue,
    ]);
    return newModel;
  }

  render() {
    const { queueModel } = this.state;
    const listQueueItem = queueModel.map(item => (
      <QueueItem {...item} origin={pick(this.props, ['x', 'y'])} />
    ));
    return (
      <g className='queue__wrapper'>
        {listQueueItem}
        {this.renderQueueBoundary()}
      </g>
    );
  }
}

export default withReverseStep<QueueModel, PropsWithHoc>(Queue);
