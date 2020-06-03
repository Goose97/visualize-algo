import React, { Component } from 'react';
import { pick, groupBy, flatMap } from 'lodash';

import withReverseStep, { WithReverseStep } from 'hocs/withReverseStep';
import { getProgressDirection, keyExist } from 'utils';
import { IProps, IState } from './index.d';
import { Action } from 'types';
import HashMapMemoryBlock from './HashMapMemoryBlock';
import transformHashMapModel from 'transformers/HashMap';
import { HashMap } from 'types/ds/HashMap';

type PropsWithHoc = IProps & WithReverseStep<HashMap.Model>;

export class HashMapDS extends Component<PropsWithHoc, IState> {
  private initialLinkedListModel: HashMap.Model;
  private wrapperRef: React.RefObject<SVGUseElement>;

  constructor(props: PropsWithHoc) {
    super(props);

    this.initialLinkedListModel = this.initHashMapModel(props);
    this.state = {
      hashMapModel: this.initialLinkedListModel,
      isVisible: true,
    };
    this.wrapperRef = React.createRef();
  }

  initHashMapModel(props: PropsWithHoc): HashMap.Model {
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

  push(currentModel: HashMap.Model, params: [number]) {
    const biggestKey = Math.max(...currentModel.map(({ key }) => key));
    const newHashMapNode: HashMap.Node = {
      value: params[0],
      key: biggestKey + 1,
      index: currentModel.length,
      visible: true,
    };
    const newModel = transformHashMapModel(currentModel, 'push', [newHashMapNode]);
    return newModel;
  }

  componentDidUpdate(prevProps: IProps) {
    const {
      currentStep,
      reverseToStep,
      saveStepSnapshots,
      totalStep,
    } = this.props;
    const { hashMapModel } = this.state;

    if (keyExist(this.props, ['currentStep', 'totalStep', 'instructions'])) {
      switch (
        getProgressDirection(currentStep!, prevProps.currentStep!, totalStep!)
      ) {
        case 'forward':
          saveStepSnapshots(hashMapModel, currentStep!);
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
    const { hashMapModel } = this.state;
    const { currentStep, instructions } = this.props;
    const actionsToMakeAtThisStep = instructions[currentStep!];
    if (!actionsToMakeAtThisStep || !actionsToMakeAtThisStep.length) return;

    // This consume pipeline have many side effect in each step. Each
    // method handle each action has their own side effect

    const newHashMapModel = this.consumeMultipleActions(
      actionsToMakeAtThisStep,
      hashMapModel,
    );
    this.setState({ hashMapModel: newHashMapModel });
  }

  consumeMultipleActions(
    actionList: Action<HashMap.Method>[],
    currentModel: HashMap.Model,
    onlyTranformData?: boolean,
  ): HashMap.Model {
    // Treat each action as a transformation function which take a linkedListModel
    // and return a new one. Consuming multiple actions is merely chaining those
    // transformations together
    // linkedListModel ---- action1 ----> linkedListModel1 ---- action2 ----> linkedListMode2 ---- action3 ----> linkedListModel3
    return actionList.reduce<HashMap.Model>((finalModel, action) => {
      // the main function of a handler is doing side effect before transform model
      // a handler must also return a new model
      // if no handler is specify, just transform model right away
      const { name, params } = action;
      //@ts-ignore
      const customHandler = this[name];

      if (typeof customHandler === 'function') {
        return customHandler(finalModel, params, onlyTranformData);
      } else {
        return transformHashMapModel(finalModel, name, params);
      }
    }, currentModel);
  }

  handleReverse = (stateOfPreviousStep: HashMap.Model) => {
    this.setState({ hashMapModel: stateOfPreviousStep });
  };

  handleFastForward() {
    const { hashMapModel } = this.state;
    const { instructions, saveStepSnapshots } = this.props;
    const allActions = flatMap(instructions);
    const actionsGroupedByStep = groupBy(allActions, item => item.step);

    // Loop through all the action one by one and keep updating the final model
    let finalHashMapModel = Object.entries(actionsGroupedByStep).reduce<
      HashMap.Model
    >((currentModel, [step, actionsToMakeAtThisStep]) => {
      saveStepSnapshots(currentModel, +step);
      return this.consumeMultipleActions(
        actionsToMakeAtThisStep,
        currentModel,
        true,
      );
    }, hashMapModel);
    this.updateWithoutAnimation(finalHashMapModel);
  }

  handleFastBackward() {
    this.updateWithoutAnimation(this.initialLinkedListModel);
  }

  updateWithoutAnimation(newLinkedListModel: HashMap.Model) {
    this.setState({ hashMapModel: newLinkedListModel, isVisible: false }, () =>
      this.setState({ isVisible: true }),
    );
  }

  componentDidMount() {
    const { interactive } = this.props;
    if (interactive) this.injectHTMLIntoCanvas();
  }

  injectHTMLIntoCanvas() {
    const { hashMapModel } = this.state;
    const { handleExecuteApi } = this.props;
    setTimeout(() => {
      HashMapHTML.renderToView({
        model: hashMapModel,
        wrapperElement: this.wrapperRef.current,
        coordinate: pick(this.props, ['x', 'y']),
        apiHandler: handleExecuteApi,
      });
    }, 0);
  }

  render() {
    const { hashMapModel, isVisible } = this.state;
    const { blockType } = this.props;
    const hashMapMemoryBlock = hashMapModel.map(hashMapNode => (
      <HashMapMemoryBlock {...hashMapNode} blockType={blockType} />
    ));

    return (
      isVisible && (
        <>
          <use
            href='#hashMap'
            {...pick(this.props, ['x', 'y'])}
            ref={this.wrapperRef}
          />
          <defs>
            <g id='hashMap'>{hashMapMemoryBlock}</g>
          </defs>
        </>
      )
    );
  }
}

export default withReverseStep<HashMap.Model, PropsWithHoc>(HashMapDS);
