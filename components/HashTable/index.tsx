import React, { Component } from 'react';
import { pick, groupBy, flatMap } from 'lodash';

import withReverseStep, { WithReverseStep } from 'hocs/withReverseStep';
import { getProgressDirection, keyExist } from 'utils';
import KeyList from './KeyList';
import HashFunction from './HashFunction';
import MemoryArray from './MemoryArray';
import HashTableHTML from './HashTableHTML';
import HashIndicationArrow from './HashIndicationArrow';
import { IProps, IState } from './index.d';
import { Action } from 'types';
import transformHashTableModel from 'transformers/HashTable';
import { HashTable } from 'types/ds/HashTable';
import { caculateKeyHash } from './helper';
import { HASH_TABLE_UNIVERSAL_KEY_SIZE } from '../../constants';

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
      keyAboutToBeAdded: [],
      keyAboutToBeDeleted: [],
    };
    this.wrapperRef = React.createRef();
  }

  initHashTableModel(props: PropsWithHoc): HashTable.Model {
    const keys = [
      { key: 'a', value: 1 },
      { key: 'b', value: 2 },
      { key: 'l', value: 3 },
    ];

    return {
      keys,
      memoryAddresses: this.produceMemoryAddressesFromKeys(keys),
    };
  }

  produceMemoryAddressesFromKeys(
    keys: HashTable.Model['keys'],
  ): HashTable.Model['memoryAddresses'] {
    let memoryAddresses = keys.map(({ key, value }) => ({
      key: caculateKeyHash(key, HASH_TABLE_UNIVERSAL_KEY_SIZE),
      value,
    }));
    return Object.entries(groupBy(memoryAddresses, ({ key }) => key)).map(
      ([address, values]) => ({
        key: +address,
        values: values.map(({ value }) => value),
      }),
    );
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

  insert = (model: HashTable.Model, [key, value]: [string, any]) => {
    const { keyAboutToBeAdded } = this.state;
    this.setState({ keyAboutToBeAdded: keyAboutToBeAdded.concat(key) });
    setTimeout(() => {
      this.setState({
        hashTableModel: transformHashTableModel(model, 'insertValue', [
          key,
          value,
        ]),
      });
    }, 1800);
    return transformHashTableModel(model, 'insertKey', [key, value]);
  };

  delete = (model: HashTable.Model, [key]: [string]) => {
    const { keyAboutToBeDeleted } = this.state;
    this.setState({ keyAboutToBeDeleted: keyAboutToBeDeleted.concat(key) });
    setTimeout(() => {
      // wait for the animation to finish
      this.setState({
        hashTableModel: transformHashTableModel(model, 'delete', [key]),
      });
    }, 1000);

    return model;
  };

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

  handlePointerLinkAnimationEnd = (key: string, animationName: string) => {
    const { hashTableModel } = this.state;
    console.log('animationName', animationName);
    if (animationName === 'appear') {
      this.setState({
        hashTableModel: transformHashTableModel(hashTableModel, 'toggleIsNew', [
          key,
        ]),
      });
    }
  };

  componentDidMount() {
    const { interactive } = this.props;
    if (interactive) this.injectHTMLIntoCanvas();
  }

  injectHTMLIntoCanvas() {
    const { hashTableModel } = this.state;
    const { handleExecuteApi } = this.props;
    setTimeout(() => {
      HashTableHTML.renderToView({
        model: hashTableModel,
        wrapperElement: this.wrapperRef.current,
        coordinate: pick(this.props, ['x', 'y']),
        apiHandler: handleExecuteApi,
      });
    }, 0);
  }

  render() {
    const {
      hashTableModel,
      isVisible,
      keyAboutToBeDeleted,
      keyAboutToBeAdded,
    } = this.state;

    return (
      isVisible && (
        <>
          <use href='#hashTable' {...pick(this.props, ['x', 'y'])} />
          <defs>
            <g id='hashTable' ref={this.wrapperRef}>
              <KeyList hashTableModel={hashTableModel} />
              <HashFunction />
              <MemoryArray
                hashTableModel={hashTableModel}
                keyAboutToBeDeleted={keyAboutToBeDeleted}
              />
              <HashIndicationArrow
                hashTableModel={hashTableModel}
                onAnimationEnd={this.handlePointerLinkAnimationEnd}
                keyAboutToBeDeleted={keyAboutToBeDeleted}
                keyAboutToBeAdded={keyAboutToBeAdded}
              />
            </g>
          </defs>
        </>
      )
    );
  }
}

export default withReverseStep<HashTable.Model, PropsWithHoc>(HashTableDS);
