import React, { Component } from 'react';
import { pick, last } from 'lodash';

import StackItem from './StackItem';
import {
  STACK_BLOCK_WIDTH,
  STACK_BLOCK_HEIGHT,
  STACK_BLOCK_GAP,
  STACK_BOUNDARY_GAP,
} from '../../constants';
import { StackModel, IState, IProps, StackItemModel } from './index.d';
import withReverseStep, { WithReverseStep } from 'hocs/withReverseStep';
import { Action } from 'types';
import transformModel from './ModelTransformer';
import { getProgressDirection } from 'utils';

type PropsWithHoc = IProps & WithReverseStep<StackModel>;

export class Stack extends Component<PropsWithHoc, IState> {
  constructor(props: PropsWithHoc) {
    super(props);

    this.state = {
      stackModel: this.initStackModel(),
    };
  }

  initStackModel() {
    const { initialData } = this.props;
    return initialData.map((value, index) => ({
      value,
      visible: true,
      key: index,
      offsetFromFront: index,
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
    const { stackModel } = this.state;
    if (typeof currentStep === 'number')
      saveStepSnapshots(stackModel, currentStep);
  }

  handleForward() {
    // Treat each action as a transformation function which take a linkedListModel
    // and return a new one. Consuming multiple actions is merely chaining those
    // transformations together
    // linkedListModel ---- action1 ----> linkedListModel1 ---- action2 ----> linkedListMode2 ---- action3 ----> linkedListModel3
    const { stackModel } = this.state;
    const { currentStep, instructions } = this.props;
    const actionsToMakeAtThisStep = instructions[currentStep];
    if (!actionsToMakeAtThisStep || !actionsToMakeAtThisStep.length) return;

    // This consume pipeline have many side effect in each step. Each
    // method handle each action has their own side effect
    const newStackModel = this.consumeMultipleActions(
      actionsToMakeAtThisStep,
      stackModel,
    );
    this.setState({ stackModel: newStackModel });
  }

  consumeMultipleActions(
    actionList: Action[],
    currentModel: StackModel,
  ): StackModel {
    // Treat each action as a transformation function which take a linkedListModel
    // and return a new one. Consuming multiple actions is merely chaining those
    // transformations together
    // linkedListModel ---- action1 ----> linkedListModel1 ---- action2 ----> linkedListMode2 ---- action3 ----> linkedListModel3
    let finalStackModel = currentModel;
    actionList.forEach(({ name, params }) => {
      //@ts-ignore
      finalStackModel = this[name](finalStackModel, params);
    });

    return finalStackModel;
  }

  pop(currentModel: StackModel, params: []) {
    const newModel = transformModel(currentModel, 'pop', params);
    return newModel;
  }

  push(currentModel: StackModel, params: [number]) {
    const stackItemToPush: StackItemModel = {
      value: params[0],
      visible: true,
      offsetFromFront: last(currentModel)!.offsetFromFront + 1,
      key: last(currentModel)!.key + 1,
      isNew: true,
    };
    const newModel = transformModel(currentModel, 'push', [stackItemToPush]);
    return newModel;
  }

  renderBoundary() {
    const { x, y } = this.props;
    const moveToCenterPoint = `M ${x + STACK_BLOCK_WIDTH / 2} ${
      y + STACK_BLOCK_HEIGHT + 10
    }`;
    const goUpToTop = `v ${-this.caculateStackHeight() - 20}`;
    return (
      <path
        className='default-stroke no-fill stroke-1'
        d={`${moveToCenterPoint} h ${
          STACK_BLOCK_WIDTH / 2 + STACK_BOUNDARY_GAP
        } ${goUpToTop} ${moveToCenterPoint} h ${
          -STACK_BLOCK_WIDTH / 2 - STACK_BOUNDARY_GAP
        } ${goUpToTop}`}
      ></path>
    );
  }

  caculateStackHeight() {
    const { stackModel } = this.state;
    const itemCount = stackModel.filter(({ visible }) => !!visible).length;
    return itemCount * (STACK_BLOCK_HEIGHT + STACK_BLOCK_GAP);
  }

  render() {
    const { stackModel } = this.state;
    const listStackItem = stackModel.map(item => (
      <StackItem {...item} origin={pick(this.props, ['x', 'y'])} />
    ));
    return (
      <g className='queue__wrapper'>
        {listStackItem}
        {this.renderBoundary()}
      </g>
    );
  }
}

export default withReverseStep<StackModel, PropsWithHoc>(Stack);
