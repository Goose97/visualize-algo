import React, { Component } from 'react';
// import produce from 'immer';
// import { pick, omit } from 'lodash';

// import { MemoryBlock, AutoTransformGroup } from 'components';
// import transformModel from './ModelTransformer';
// import HeadPointer from './HeadPointer';
// import LinkedListPointer from './LinkedListPointer';
// import { promiseSetState } from 'utils';
// import { withReverseStep } from 'hocs';
import { IProps, IState, ArrayModel } from '.';
import { Action } from 'types';
// import {
//   LINKED_LIST_BLOCK_WIDTH,
//   LINKED_LIST_BLOCK_HEIGHT,
// } from '../../constants';
import ArrayMemoryBlock from './ArrayMemoryBlock';
import transformArrayModel from './ModelTransformer';

export class Array extends Component<IProps, IState> {
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
    }))
  }

  swap(from: number, to: number) {
    console.log('from', from)
    console.log('to', to)
    const { arrayModel } = this.state;
    const newModel = transformArrayModel(arrayModel, 'swap', [from, to]);
    this.setState({
      arrayModel: newModel,
    });
  }

  componentDidUpdate(prevProps: IProps) {
    const { currentStep, reverseToStep } = this.props;

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

    actionsToMakeAtThisStep.forEach(action => {
      if (action.name === 'swap') this.swap(...action.params)
    })

    // const newLinkedListModel = this.consumeMultipleActions(
    //   actionsToMakeAtThisStep,
    //   linkedListModel,
    // );
    // this.setState({ linkedListModel: newLinkedListModel });
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
    const arrayMemoryBlock = arrayModel.map(arrayNode => (
      <ArrayMemoryBlock
        {...arrayNode}
        origin={{
          x: 100,
          y: 100,
        }}
      />
    ));

    return arrayMemoryBlock;
  }
}

export default Array;
