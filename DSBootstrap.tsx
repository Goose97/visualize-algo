import React, { Component } from 'react';
import { flatMap, groupBy,  } from 'lodash';

import withReverseStep, { WithReverseStep } from 'hocs/withReverseStep';
import { getProgressDirection, keyExist } from 'utils';
import { IProps, IState } from './index.d';
import { Action, ActionWithStep } from 'types';
import { LinkedList } from 'types/ds/LinkedList';

type PropsWithHoc = IProps & WithReverseStep<LinkedList.Model>;

export class LinkedListDS extends Component<PropsWithHoc, IState> {
  private wrapperRef: React.RefObject<SVGUseElement>;

  constructor(props: PropsWithHoc) {
    super(props);

    this.state = {};
    this.wrapperRef = React.createRef();
  }

  componentDidUpdate(prevProps: IProps) {
    const {
      currentStep,
      reverseToStep,
      saveStepSnapshots,
      totalStep,
    } = this.props;
    const { linkedListModel } = this.state;

    // Update according to algorithm progression
    if (keyExist(this.props, ['currentStep', 'totalStep', 'instructions'])) {
      switch (
        getProgressDirection(currentStep!, prevProps.currentStep!, totalStep!)
      ) {
        case 'forward':
          saveStepSnapshots(linkedListModel, currentStep!);
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
    const { linkedListModel } = this.state;
    const { currentStep, instructions } = this.props;
    const actionsToMakeAtThisStep = instructions[currentStep!];
    if (!actionsToMakeAtThisStep || !actionsToMakeAtThisStep.length) return;

    // This consume pipeline have many side effect in each step. Each
    // method handle each action has their own side effect
    const newLinkedListModel = this.consumeMultipleActions(
      actionsToMakeAtThisStep,
      linkedListModel,
    );
    this.setState({ linkedListModel: newLinkedListModel });
  }

  consumeMultipleActions(
    actionList: Action<LinkedList.Method>[],
    currentModel: LinkedList.Model,
    onlyTranformData?: boolean,
  ): LinkedList.Model {
    // Treat each action as a transformation function which take a linkedListModel
    // and return a new one. Consuming multiple actions is merely chaining those
    // transformations together
    // linkedListModel ---- action1 ----> linkedListModel1 ---- action2 ----> linkedListMode2 ---- action3 ----> linkedListModel3
    return actionList.reduce<LinkedList.Model>((finalModel, action) => {
      // the main function of a handler is doing side effect before transform model
      // a handler must also return a new model
      // if no handler is specify, just transform model right away
      const { name, params } = action;
      //@ts-ignore
      const customHandler = this[name];

      if (typeof customHandler === 'function') {
        return customHandler(finalModel, params, onlyTranformData);
      } else {
        return transformLinkedListModel(finalModel, name, params);
      }
    }, currentModel);
  }

  handleReverse = (stateOfPreviousStep: LinkedList.Model) => {
    this.setState({ linkedListModel: stateOfPreviousStep });
  };

  handleFastForward() {
    const { linkedListModel } = this.state;
    const { instructions, saveStepSnapshots } = this.props;
    let allActions: ActionWithStep<LinkedList.Method>[] = [];
    for (let i = 0; i < instructions.length; i++) {
      // Replace visit action with vist + focus
      // also add step attribute to each action
      const replacedActions: ActionWithStep<LinkedList.Method>[] = flatMap(
        instructions[i],
        action => {
          const { name, params } = action;
          return name === 'visit'
            ? [
                { name: 'visited', params: params.slice(0, 1), step: i },
                { name: 'focus', params: params.slice(1), step: i },
              ]
            : { ...action, step: i };
        },
      );

      allActions.push(...replacedActions);
    }

    const actionsGroupedByStep = groupBy(allActions, item => item.step);

    // Loop through all the action one by one and keep updating the final model
    let finalLinkedListModel = Object.entries(actionsGroupedByStep).reduce<
      LinkedList.Model
    >((currentModel, [step, actionsToMakeAtThisStep]) => {
      saveStepSnapshots(currentModel, +step);
      return this.consumeMultipleActions(
        actionsToMakeAtThisStep,
        currentModel,
        true,
      );
    }, linkedListModel);
    this.updateWithoutAnimation(finalLinkedListModel);
  }

  handleFastBackward() {
    this.updateWithoutAnimation(this.initialLinkedListModel);
  }

  updateWithoutAnimation(newLinkedListModel: LinkedList.Model) {
    this.setState(
      { linkedListModel: newLinkedListModel, isVisible: false },
      () => this.setState({ isVisible: true }),
    );
  }

  render() {
    const { isVisible } = this.state;
    return (
      isVisible && (
        // <>
        //   <use
        //     href='#linked-list'
        //     {...pick(this.props, ['x', 'y'])}
        //     ref={this.wrapperRef}
        //   />
        //   <defs>
        //     <g id='linked-list'>
        //       <HeadPointer headBlock={this.findNextBlock(-1)} />
        //       {listMemoryBlock}
        //       {listPointerLink}
        //     </g>
        //   </defs>
        // </>
      )
    );
  }
}

export default withReverseStep<LinkedList.Model, PropsWithHoc>(LinkedListDS);
