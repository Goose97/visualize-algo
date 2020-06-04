import React, { Component } from 'react';
import { pick, last } from 'lodash';

import StackItem from './StackItem';
import {
  STACK_BLOCK_WIDTH,
  STACK_BLOCK_HEIGHT,
  STACK_BLOCK_GAP,
  STACK_BOUNDARY_GAP,
} from '../../constants';
import { IState, IProps } from './index.d';
import withReverseStep, { WithReverseStep } from 'hocs/withReverseStep';
import { Action } from 'types';
import { Stack } from 'types/ds/Stack';
import transformStackModel from 'transformers/Stack';
import { getProgressDirection } from 'utils';

type PropsWithHoc = IProps & WithReverseStep<Stack.Model>;

export class StackDS extends Component<PropsWithHoc, IState> {
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
    actionList: Action<Stack.Method>[],
    currentModel: Stack.Model,
    onlyTranformData?: boolean,
  ): Stack.Model {
    // Treat each action as a transformation function which take a linkedListModel
    // and return a new one. Consuming multiple actions is merely chaining those
    // transformations together
    // linkedListModel ---- action1 ----> linkedListModel1 ---- action2 ----> linkedListMode2 ---- action3 ----> linkedListModel3
    return actionList.reduce<Stack.Model>((finalModel, action) => {
      // the main function of a handler is doing side effect before transform model
      // a handler must also return a new model
      // if no handler is specify, just transform model right away
      const { name, params } = action;
      //@ts-ignore
      const customHandler = this[name];

      if (typeof customHandler === 'function') {
        return customHandler(finalModel, params, onlyTranformData);
      } else {
        return transformStackModel(finalModel, name, params);
      }
    }, currentModel);
  }

  push(
    currentModel: Stack.Model,
    params: [number],
    onlyTranformData?: boolean,
  ) {
    const itemOnTop = last(currentModel);
    const stackItemToPush: Stack.ItemModel = {
      value: params[0],
      visible: true,
      offsetFromFront: itemOnTop ? itemOnTop.offsetFromFront + 1 : 0,
      key: itemOnTop ? itemOnTop.key + 1 : 0,
      isNew: true,
    };
    return transformStackModel(currentModel, 'push', [stackItemToPush]);
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

export default withReverseStep<Stack.Model, PropsWithHoc>(StackDS);
