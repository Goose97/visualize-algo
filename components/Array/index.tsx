import React, { Component } from 'react';
import { pick, groupBy, flatMap } from 'lodash';

import withReverseStep, { WithReverseStep } from 'hocs/withReverseStep';
import { getProgressDirection, keyExist } from 'utils';
import { IProps, IState } from './index.d';
import { Action } from 'types';
import ArrayMemoryBlock from './ArrayMemoryBlock';
import ArrayHTML from './ArrayHTML';
import transformArrayModel from 'transformers/Array';
import { Array } from 'types/ds/Array';

type PropsWithHoc = IProps & WithReverseStep<Array.Model>;

export class ArrayDS extends Component<PropsWithHoc, IState> {
  private initialLinkedListModel: Array.Model;
  private wrapperRef: React.RefObject<SVGUseElement>;

  constructor(props: PropsWithHoc) {
    super(props);

    this.initialLinkedListModel = this.initArrayModel(props);
    this.state = {
      arrayModel: this.initialLinkedListModel,
      isVisible: true,
    };
    this.wrapperRef = React.createRef();
  }

  initArrayModel(props: PropsWithHoc): Array.Model {
    const { initialData } = props;
    return initialData.map((value, index) => ({
      value,
      index,
      visible: true,
      visited: false,
      key: index,
      focus: false,
    }));
  }

  push(currentModel: Array.Model, params: [number]) {
    const biggestKey = Math.max(...currentModel.map(({ key }) => key));
    const newArrayNode: Array.Node = {
      value: params[0],
      key: biggestKey + 1,
      index: currentModel.length,
      visible: true,
    };
    const newModel = transformArrayModel(currentModel, 'push', [newArrayNode]);
    return newModel;
  }

  componentDidUpdate(prevProps: IProps) {
    const {
      currentStep,
      reverseToStep,
      saveStepSnapshots,
      totalStep,
    } = this.props;
    const { arrayModel } = this.state;

    if (keyExist(this.props, ['currentStep', 'totalStep', 'instructions'])) {
      switch (
        getProgressDirection(currentStep!, prevProps.currentStep!, totalStep!)
      ) {
        case 'forward':
          saveStepSnapshots(arrayModel, currentStep!);
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
  }

  handleForward() {
    // Treat each action as a transformation function which take a linkedListModel
    // and return a new one. Consuming multiple actions is merely chaining those
    // transformations together
    // linkedListModel ---- action1 ----> linkedListModel1 ---- action2 ----> linkedListMode2 ---- action3 ----> linkedListModel3
    const { arrayModel } = this.state;
    const { currentStep, instructions } = this.props;
    const actionsToMakeAtThisStep = instructions[currentStep!];
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
    actionList: Action<Array.Method>[],
    currentModel: Array.Model,
    onlyTranformData?: boolean,
  ): Array.Model {
    // Treat each action as a transformation function which take a linkedListModel
    // and return a new one. Consuming multiple actions is merely chaining those
    // transformations together
    // linkedListModel ---- action1 ----> linkedListModel1 ---- action2 ----> linkedListMode2 ---- action3 ----> linkedListModel3
    return actionList.reduce<Array.Model>((finalModel, action) => {
      // the main function of a handler is doing side effect before transform model
      // a handler must also return a new model
      // if no handler is specify, just transform model right away
      const { name, params } = action;
      //@ts-ignore
      const customHandler = this[name];

      if (typeof customHandler === 'function') {
        return customHandler(finalModel, params, onlyTranformData);
      } else {
        return transformArrayModel(finalModel, name, params);
      }
    }, currentModel);
  }

  handleReverse = (stateOfPreviousStep: Array.Model) => {
    this.setState({ arrayModel: stateOfPreviousStep });
  };

  handleFastForward() {
    const { arrayModel } = this.state;
    const { instructions, saveStepSnapshots } = this.props;
    const allActions = flatMap(instructions);
    const actionsGroupedByStep = groupBy(allActions, item => item.step);

    // Loop through all the action one by one and keep updating the final model
    let finalArrayModel = Object.entries(actionsGroupedByStep).reduce<
      Array.Model
    >((currentModel, [step, actionsToMakeAtThisStep]) => {
      saveStepSnapshots(currentModel, +step);
      return this.consumeMultipleActions(
        actionsToMakeAtThisStep,
        currentModel,
        true,
      );
    }, arrayModel);
    this.updateWithoutAnimation(finalArrayModel);
  }

  handleFastBackward() {
    this.updateWithoutAnimation(this.initialLinkedListModel);
  }

  updateWithoutAnimation(newLinkedListModel: Array.Model) {
    this.setState({ arrayModel: newLinkedListModel, isVisible: false }, () =>
      this.setState({ isVisible: true }),
    );
  }

  componentDidMount() {
    const { interactive } = this.props;
    if (interactive) this.injectHTMLIntoCanvas();
  }

  injectHTMLIntoCanvas() {
    const { arrayModel } = this.state;
    const { handleExecuteApi } = this.props;
    setTimeout(() => {
      ArrayHTML.renderToView({
        model: arrayModel,
        wrapperElement: this.wrapperRef.current,
        coordinate: pick(this.props, ['x', 'y']),
        apiHandler: handleExecuteApi,
      });
    }, 0);
  }

  render() {
    const { arrayModel, isVisible } = this.state;
    const { blockType } = this.props;
    const arrayMemoryBlock = arrayModel.map(arrayNode => (
      <ArrayMemoryBlock {...arrayNode} blockType={blockType} />
    ));

    return (
      isVisible && (
        <>
          <use
            href='#array'
            {...pick(this.props, ['x', 'y'])}
            ref={this.wrapperRef}
          />
          <defs>
            <g id='array'>{arrayMemoryBlock}</g>
          </defs>
        </>
      )
    );
  }
}

export default withReverseStep<Array.Model, PropsWithHoc>(ArrayDS);
