import React, { Component } from 'react';
import { pick, groupBy, flatMap } from 'lodash';

import withReverseStep, { WithReverseStep } from 'hocs/withReverseStep';
import { getProgressDirection, keyExist } from 'utils';
import KeyList from './KeyList';
import HashFunction from './HashFunction';
import MemoryArray from './MemoryArray';
import HashIndicationArrow from './HashIndicationArrow';
import { IProps, IState } from './index.d';
import { Action } from 'types';
import transformHashTableModel from 'transformers/HashTable';
import { HashTable } from 'types/ds/HashTable';

type PropsWithHoc = IProps & WithReverseStep<HashTable.Model>;

export class HashTableDS extends Component<PropsWithHoc, IState> {
  private initialLinkedListModel: HashTable.Model;
  private wrapperRef: React.RefObject<SVGUseElement>;

  constructor(props: PropsWithHoc) {
    super(props);

    this.initialLinkedListModel = this.initHashTableModel(props);
    this.state = {
      hashTableModel: this.initialLinkedListModel,
      isVisible: true,
    };
    this.wrapperRef = React.createRef();
  }

  initHashTableModel(props: PropsWithHoc): HashTable.Model {
    return [
      { key: 'a', value: 1 },
      { key: 'b', value: 2 },
    ];
    // const { initialData } = props;
    // return initialData.map((value, index) => ({
    //   value,
    //   index,
    //   visible: true,
    //   visited: false,
    //   key: index,
    //   focus: false,
    // }));
  }

  push(currentModel: HashTable.Model, params: [number]) {
    const biggestKey = Math.max(...currentModel.map(({ key }) => key));
    const newHashTableNode: HashTable.Node = {
      value: params[0],
      key: biggestKey + 1,
      index: currentModel.length,
      visible: true,
    };
    const newModel = transformHashTableModel(currentModel, 'push', [
      newHashTableNode,
    ]);
    return newModel;
  }

  componentDidUpdate(prevProps: IProps) {
    const {
      currentStep,
      reverseToStep,
      saveStepSnapshots,
      totalStep,
    } = this.props;
    const { hashTableModel } = this.state;

    if (keyExist(this.props, ['currentStep', 'totalStep', 'instructions'])) {
      switch (
        getProgressDirection(currentStep!, prevProps.currentStep!, totalStep!)
      ) {
        case 'forward':
          saveStepSnapshots(hashTableModel, currentStep!);
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
    const { hashTableModel } = this.state;
    const { currentStep, instructions } = this.props;
    const actionsToMakeAtThisStep = instructions[currentStep!];
    if (!actionsToMakeAtThisStep || !actionsToMakeAtThisStep.length) return;

    // This consume pipeline have many side effect in each step. Each
    // method handle each action has their own side effect

    const newHashTableModel = this.consumeMultipleActions(
      actionsToMakeAtThisStep,
      hashTableModel,
    );
    this.setState({ hashTableModel: newHashTableModel });
  }

  consumeMultipleActions(
    actionList: Action<HashTable.Method>[],
    currentModel: HashTable.Model,
    onlyTranformData?: boolean,
  ): HashTable.Model {
    // Treat each action as a transformation function which take a linkedListModel
    // and return a new one. Consuming multiple actions is merely chaining those
    // transformations together
    // linkedListModel ---- action1 ----> linkedListModel1 ---- action2 ----> linkedListMode2 ---- action3 ----> linkedListModel3
    return actionList.reduce<HashTable.Model>((finalModel, action) => {
      // the main function of a handler is doing side effect before transform model
      // a handler must also return a new model
      // if no handler is specify, just transform model right away
      const { name, params } = action;
      //@ts-ignore
      const customHandler = this[name];

      if (typeof customHandler === 'function') {
        return customHandler(finalModel, params, onlyTranformData);
      } else {
        return transformHashTableModel(finalModel, name, params);
      }
    }, currentModel);
  }

  handleReverse = (stateOfPreviousStep: HashTable.Model) => {
    this.setState({ hashTableModel: stateOfPreviousStep });
  };

  handleFastForward() {
    const { hashTableModel } = this.state;
    const { instructions, saveStepSnapshots } = this.props;
    const allActions = flatMap(instructions);
    const actionsGroupedByStep = groupBy(allActions, item => item.step);

    // Loop through all the action one by one and keep updating the final model
    let finalHashTableModel = Object.entries(actionsGroupedByStep).reduce<
      HashTable.Model
    >((currentModel, [step, actionsToMakeAtThisStep]) => {
      saveStepSnapshots(currentModel, +step);
      return this.consumeMultipleActions(
        actionsToMakeAtThisStep,
        currentModel,
        true,
      );
    }, hashTableModel);
    this.updateWithoutAnimation(finalHashTableModel);
  }

  handleFastBackward() {
    this.updateWithoutAnimation(this.initialLinkedListModel);
  }

  updateWithoutAnimation(newLinkedListModel: HashTable.Model) {
    this.setState(
      { hashTableModel: newLinkedListModel, isVisible: false },
      () => this.setState({ isVisible: true }),
    );
  }

  // componentDidMount() {
  //   const { interactive } = this.props;
  //   if (interactive) this.injectHTMLIntoCanvas();
  // }

  // injectHTMLIntoCanvas() {
  //   const { hashTableModel } = this.state;
  //   const { handleExecuteApi } = this.props;
  //   setTimeout(() => {
  //     HashTableHTML.renderToView({
  //       model: hashTableModel,
  //       wrapperElement: this.wrapperRef.current,
  //       coordinate: pick(this.props, ['x', 'y']),
  //       apiHandler: handleExecuteApi,
  //     });
  //   }, 0);
  // }

  render() {
    const { hashTableModel, isVisible } = this.state;

    return (
      isVisible && (
        <>
          <use
            href='#hashTable'
            {...pick(this.props, ['x', 'y'])}
            ref={this.wrapperRef}
          />
          <defs>
            <g id='hashTable'>
              <KeyList hashTableModel={hashTableModel} />
              <HashFunction />
              <MemoryArray hashTableModel={hashTableModel} />
              <HashIndicationArrow hashTableModel={hashTableModel} />
            </g>
          </defs>
        </>
      )
    );
  }
}

export default withReverseStep<HashTable.Model, PropsWithHoc>(HashTableDS);
