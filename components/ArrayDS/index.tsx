import React, { Component } from 'react';
// import produce from 'immer';
import { pick } from 'lodash';

import { IProps, IState } from './index.d';
import { Action, PointCoordinate } from 'types';
import ArrayMemoryBlock from './ArrayMemoryBlock';
import transformArrayModel from 'transformers/Array';
import {Array} from 'types/ds/Array';

export class ArrayDS extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      arrayModel: this.initModel(),
    };
  }

  initModel() {
    const { initialData } = this.props;
    return initialData.map((value, index) => ({
      value,
      index,
      visible: true,
      visited: false,
      key: index,
      focus: false,
    }));
  }

  swap(currentModel: Array.Model, params: [number, number]) {
    // console.log('from', from)
    // console.log('to', to)
    const newModel = transformArrayModel(currentModel, 'swap', params);

    return newModel;
  }

  label(currentModel: Array.Model, params: [number]) {
    const newModel = transformArrayModel(currentModel, 'label', params);
    return newModel;
  }

  unlabel(currentModel: Array.Model, params: [number]) {
    const newModel = transformArrayModel(currentModel, 'unlabel', params);
    return newModel;
  }

  resetFocus(currentModel: Array.Model, params: [number, number]) {
    const newModel = transformArrayModel(currentModel, 'resetFocus', params);
    return newModel;
  }

  resetFocusAll(currentModel: Array.Model, params: []) {
    const newModel = transformArrayModel(currentModel, 'resetFocusAll', params);
    return newModel;
  }

  focus(currentModel: Array.Model, params: [number]) {
    const newModel = transformArrayModel(currentModel, 'focus', params);

    return newModel;
  }

  complete(currentModel: Array.Model, params: []) {
    const newModel = transformArrayModel(currentModel, 'complete', params);

    return newModel;
  }

  setValue(currentModel: Array.Model, params: []) {
    const newModel = transformArrayModel(currentModel, 'setValue', params);
    return newModel;
  }

  setLine(currentModel: Array.Model, params: []) {
    const newModel = transformArrayModel(currentModel, 'setLine', params);
    return newModel;
  }

  push(currentModel: Array.Model, params: [number]) {
    const biggestKey = Math.max(...currentModel.map(({ key }) => key));
    const newArrayNode: Array.Node = {
      value: params[0],
      key: biggestKey + 1,
      index: currentModel.length,
      visible: true
    }
    const newModel = transformArrayModel(currentModel, 'push', [newArrayNode]);
    return newModel;
  }

  componentDidUpdate(prevProps: IProps) {
    // const { currentStep, reverseToStep } = this.props;

    switch (this.getProgressDirection(prevProps.currentStep)) {
      case 'forward':
        this.handleForward();
        // // Treat each action as a transformation function which take a linkedListModel
        // // and return a new one. Consuming multiple actions is merely chaining those
        // // transformations together
        // // linkedListModel ---- action1 ----> linkedListModel1 ---- action2 ----> linkedListMode2 ---- action3 ----> linkedListModel3
        // const actionsToMakeAtThisStep = instructions[currentStep] || [];
        // let finalLinkedListModel = linkedListModel;
        // actionsToMakeAtThisStep.forEach(({ name, params }) => {
        //   //@ts-ignore
        //   finalLinkedListModel = this[name](finalLinkedListModel, params);
        // });
        break;

      // case 'backward':
      //   reverseToStep(currentStep);
      //   break;

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

  handleForward() {
    // Treat each action as a transformation function which take a linkedListModel
    // and return a new one. Consuming multiple actions is merely chaining those
    // transformations together
    // linkedListModel ---- action1 ----> linkedListModel1 ---- action2 ----> linkedListMode2 ---- action3 ----> linkedListModel3
    const { arrayModel } = this.state;
    const { currentStep, instructions } = this.props;
    const actionsToMakeAtThisStep = instructions[currentStep];
    if (!actionsToMakeAtThisStep || !actionsToMakeAtThisStep.length) return;

    // This consume pipeline have many side effect in each step. Each
    // method handle each action has their own side effect

    const newArrayModel = this.consumeMultipleActions(
      actionsToMakeAtThisStep,
      arrayModel,
    );
    this.setState({ arrayModel: newArrayModel });
  }

  consumeMultipleActions(
    actionList: Action[],
    currentModel: Array.Model,
  ): Array.Model {
    // Treat each action as a transformation function which take a linkedListModel
    // and return a new one. Consuming multiple actions is merely chaining those
    // transformations together
    // linkedListModel ---- action1 ----> linkedListModel1 ---- action2 ----> linkedListMode2 ---- action3 ----> linkedListModel3
    let finalArrayModel = currentModel;
    actionList.forEach(({ name, params }) => {
      //@ts-ignore
      finalArrayModel = this[name](finalArrayModel, params);
    });

    return finalArrayModel;
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

  render() {
    const { arrayModel } = this.state;
    const { blockType } = this.props;
    const origin =
      'x' in this.props
        ? pick(this.props, ['x', 'y']) as PointCoordinate
        : { x: 100, y: 200 };
    const arrayMemoryBlock = arrayModel.map(arrayNode => (
      <ArrayMemoryBlock
        {...arrayNode}
        origin={origin}
        blockType={blockType}
      />
    ));

    return (
      <g>
        {arrayMemoryBlock}
        {/* {visitMemoryBlock} */}
      </g>
    );
  }
}

export default ArrayDS;
