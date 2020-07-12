import React, { Component } from 'react';
import { flatMap, groupBy, isFunction } from 'lodash';

import { CanvasObserver } from 'components';
import { BaseDSProps, Action, ObjectType } from 'types';
import { keyExist, getProgressDirection } from 'utils';

export interface WithDSCore<T> {
  model: T;
  isVisible: boolean;
  saveReverseLog: (actionName: string, params: any[], step: number) => void;
  saveStepSnapshots: (snapshot: T, step: number) => void;
  reverseToStep: (targetStep: number) => void;
  registerCustomTransformer: (callbackObject: ObjectType<Function>) => void;
  registerHTMLInjector: (injector: () => void) => void;
}

interface IState<T> {
  model: T;
  isVisible: boolean;
}

interface DSCoreParams<Model, Method> {
  initModel: (initialData: any) => Model;
  dataTransformer: (
    currentModel: Model,
    operation: Method,
    payload: any[],
  ) => Model;
}

interface ActionLog {
  name: string;
  params: any[];
  step: number;
}

interface SnapshotLog<T> {
  snapshot: T;
  step: number;
}

function withDSCore<Model, Method extends string>(
  initObject: DSCoreParams<Model, Method>,
) {
  return <P extends BaseDSProps>(Page: React.ComponentType<P>) => {
    class WrapperComponent extends Component<
      P & WithDSCore<Model>,
      IState<Model>
    > {
      // DS core stuff
      private initialModel: Model;
      private customTransformers: ObjectType<
        (model: Model, payload: any[], onlyTranformData?: boolean) => Model
      >;
      private htmlInjector?: () => void;

      // Reverse related stuff
      private reverseLogs: ActionLog[];
      private stepSnapshots: SnapshotLog<Model>[];
      private ref: React.RefObject<React.ReactElement>;

      constructor(props: P & WithDSCore<Model>) {
        super(props);
        this.state = {
          model: initObject.initModel(props.initialData),
          isVisible: true,
        };

        this.initialModel = this.state.model;
        this.customTransformers = {};

        this.reverseLogs = [];
        this.stepSnapshots = [];
        this.ref = React.createRef();
      }

      componentDidMount() {
        const { interactive } = this.props;
        if (interactive && isFunction(this.htmlInjector)) {
          this.htmlInjector();
          CanvasObserver.register(this.htmlInjector);
        }
      }

      componentDidUpdate(prevProps: P & WithDSCore<Model>) {
        const {
          currentStep,
          reverseToStep,
          totalStep,
          executedApiCount,
          dropdownDisabled,
          interactive,
        } = this.props;
        const { model } = this.state;

        if (
          keyExist(this.props, ['currentStep', 'totalStep', 'instructions'])
        ) {
          switch (
            getProgressDirection(
              currentStep!,
              prevProps.currentStep!,
              totalStep!,
              executedApiCount !== prevProps.executedApiCount &&
                prevProps.executedApiCount !== 0,
            )
          ) {
            case 'forward':
              this.saveStepSnapshots(model, currentStep!);
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

            case 'switch':
              this.handleSwitchApi();
              break;
          }
        }

        if (
          interactive &&
          dropdownDisabled !== prevProps.dropdownDisabled &&
          isFunction(this.htmlInjector)
        ) {
          this.htmlInjector();
        }
      }

      handleForward() {
        // Treat each action as a transformation function which take a linkedListModel
        // and return a new one. Consuming multiple actions is merely chaining those
        // transformations together
        // linkedListModel ---- action1 ----> linkedListModel1 ---- action2 ----> linkedListMode2 ---- action3 ----> linkedListModel3
        const { model } = this.state;
        const { currentStep, instructions } = this.props;
        const actionsToMakeAtThisStep = instructions[currentStep!];
        if (!actionsToMakeAtThisStep || !actionsToMakeAtThisStep.length) return;

        // This consume pipeline have many side effect in each step. Each
        // method handle each action has their own side effect

        const newArrayModel = this.consumeMultipleActions(
          actionsToMakeAtThisStep,
          model,
        );
        this.setState({ model: newArrayModel });
      }

      consumeMultipleActions(
        actionList: Action<string>[],
        currentModel: Model,
        onlyTranformData?: boolean,
      ): Model {
        // Treat each action as a transformation function which take a linkedListModel
        // and return a new one. Consuming multiple actions is merely chaining those
        // transformations together
        // linkedListModel ---- action1 ----> linkedListModel1 ---- action2 ----> linkedListMode2 ---- action3 ----> linkedListModel3
        return actionList.reduce<Model>((finalModel, action) => {
          // the main function of a handler is doing side effect before transform model
          // a handler must also return a new model
          // if no handler is specify, just transform model right away
          const { name, params } = action;
          //@ts-ignore
          const customHandler = this.customTransformers[name];

          if (typeof customHandler === 'function') {
            return customHandler(finalModel, params, onlyTranformData);
          } else {
            //@ts-ignore
            return initObject.dataTransformer(finalModel, name, params);
          }
        }, currentModel);
      }

      handleReverse = (stateOfPreviousStep: Model) => {
        this.setState({ model: stateOfPreviousStep });
      };

      handleFastForward() {
        const { model } = this.state;
        const { instructions } = this.props;
        const allActions = flatMap(instructions);
        //@ts-ignore
        const actionsGroupedByStep = groupBy(allActions, item => item.step);

        // Loop through all the action one by one and keep updating the final model
        let finalArrayModel = Object.entries(actionsGroupedByStep).reduce<
          Model
        >((currentModel, [step, actionsToMakeAtThisStep]) => {
          this.saveStepSnapshots(currentModel, +step);
          return this.consumeMultipleActions(
            actionsToMakeAtThisStep,
            currentModel,
            true,
          );
        }, model);
        this.updateWithoutAnimation(finalArrayModel);
      }

      handleFastBackward() {
        this.updateWithoutAnimation(this.initialModel);
      }

      updateWithoutAnimation(newLinkedListModel: Model) {
        this.setState({ model: newLinkedListModel, isVisible: false }, () =>
          this.setState({ isVisible: true }),
        );
      }

      handleSwitchApi() {
        const { keepStateWhenSwitchingApi } = this.props;
        if (!keepStateWhenSwitchingApi) {
          this.handleFastBackward();
        }
      }

      registerCustomTransformer = (
        callbackWithAction: WrapperComponent['customTransformers'],
      ) => {
        //@ts-ignore
        Object.assign(this.customTransformers, callbackWithAction);
      };

      registerHTMLInjector = (injector: WrapperComponent['htmlInjector']) => {
        this.htmlInjector = injector;
      };

      saveReverseLog = (
        reverseActionName: string,
        params: any[],
        step: number,
      ) => {
        const action = {
          name: reverseActionName,
          params,
          step,
        };
        this.reverseLogs.push(action);
        this.forceUpdate();
      };

      saveStepSnapshots = (snapshot: Model, step: number) => {
        this.stepSnapshots.push({
          snapshot,
          step,
        });
      };

      reverseToStep = async (targetStep: number) => {
        const snapshotOfTargetStep = this.stepSnapshots.find(
          ({ step }) => step === targetStep,
        );
        if (snapshotOfTargetStep) {
          //@ts-ignore
          const handler = this.getRef().handleReverse;
          handler(snapshotOfTargetStep.snapshot);
        }
      };

      getLastStepToReverse() {
        const length = this.reverseLogs.length;
        return length ? this.reverseLogs[length - 1] : null;
      }

      getRef() {
        const component = this.ref.current;
        return component || {};
      }

      render() {
        //@ts-ignore
        const { innerRef, ...rest } = this.props;
        const { isVisible } = this.state;

        return (
          isVisible && (
            <Page
              {...(rest as P)}
              {...this.state}
              ref={this.ref}
              registerCustomTransformer={this.registerCustomTransformer}
              registerHTMLInjector={this.registerHTMLInjector}
            />
          )
        );
      }
    }

    return WrapperComponent;

    // return React.forwardRef((props: P, ref) => (
    //   //@ts-ignore
    //   <WrapperComponent innerRef={ref} {...props} />
    // ));
  };
}

export default withDSCore;
