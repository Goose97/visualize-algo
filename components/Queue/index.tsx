import React, { Component } from 'react';
import { pick } from 'lodash';

import QueueItem from './QueueItem';
import {
  QUEUE_BLOCK_WIDTH,
  QUEUE_BLOCK_HEIGHT,
  QUEUE_BLOCK_GAP,
} from '../../constants';
import { IState, IProps } from './index.d';
import withReverseStep, { WithReverseStep } from 'hocs/withReverseStep';
import { Action } from 'types';
import { Queue } from 'types/ds/Queue';
import transformQueueModel from 'transformers/Queue';
import { getProgressDirection } from 'utils';

type PropsWithHoc = IProps & WithReverseStep<Queue.Model>;

export class QueueDS extends Component<PropsWithHoc, IState> {
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

      // case 'fastForward':
      //   console.log('fastForward');
      //   this.handleFastForward();
      //   break;

      // case 'fastBackward':
      //   console.log('fastBackward');
      //   this.handleFastBackward();
      //   break;
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
    actionList: Action<Queue.Method>[],
    currentModel: Queue.Model,
    onlyTranformData?: boolean,
  ): Queue.Model {
    // Treat each action as a transformation function which take a linkedListModel
    // and return a new one. Consuming multiple actions is merely chaining those
    // transformations together
    // linkedListModel ---- action1 ----> linkedListModel1 ---- action2 ----> linkedListMode2 ---- action3 ----> linkedListModel3
    return actionList.reduce<Queue.Model>((finalModel, action) => {
      // the main function of a handler is doing side effect before transform model
      // a handler must also return a new model
      // if no handler is specify, just transform model right away
      const { name, params } = action;
      //@ts-ignore
      const customHandler = this[name];

      if (typeof customHandler === 'function') {
        return customHandler(finalModel, params, onlyTranformData);
      } else {
        return transformQueueModel(finalModel, name, params);
      }
    }, currentModel);
  }

  enqueue(currentModel: Queue.Model, params: [number]) {
    const firstItem = currentModel[0];
    const firstVisibleItem = currentModel.filter(({ visible }) => !!visible)[0];

    const queueItemToEnqueue: Queue.ItemModel = {
      value: params[0],
      visible: true,
      offsetFromFront: firstVisibleItem
        ? firstVisibleItem.offsetFromFront + 1
        : 0,
      key: firstItem ? firstItem.key + 1 : 0,
      isNew: true,
    };
    const newModel = transformQueueModel(currentModel, 'enqueue', [
      queueItemToEnqueue,
    ]);
    return newModel;
  }

  handleReverse = (stateOfPreviousStep: Queue.Model) => {
    this.setState({ queueModel: stateOfPreviousStep });
  };

  renderQueueBoundary() {
    const queueWidth = this.caculateWidthOfQueue();
    const upperBound = (
      <path
        className='default-stroke has-transition'
        d={`M ${QUEUE_BLOCK_WIDTH} ${-20} l -2 2 l 8 -2 l -8 -2 l 2 2 h ${-queueWidth}`}
      ></path>
    );
    const lowerBound = (
      <path
        className='default-stroke has-transition'
        d={`M ${QUEUE_BLOCK_WIDTH} ${
          QUEUE_BLOCK_HEIGHT + 20
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
    const numberOfQueueItem = queueModel.filter(({ visible }) => !!visible)
      .length;
    return (
      numberOfQueueItem * (QUEUE_BLOCK_WIDTH + QUEUE_BLOCK_GAP) -
      QUEUE_BLOCK_GAP
    );
  }

  render() {
    const { queueModel } = this.state;
    const listQueueItem = queueModel.map(item => <QueueItem {...item} />);
    return (
      <>
        <use href='#queue' {...pick(this.props, ['x', 'y'])} />
        <defs>
          <g id='queue' className='queue__wrapper'>
            {listQueueItem}
            {this.renderQueueBoundary()}
          </g>
        </defs>
      </>
    );
  }
}

export default withReverseStep<Queue.Model, PropsWithHoc>(QueueDS);
