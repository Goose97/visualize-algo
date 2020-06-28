import React, { Component } from 'react';
import { pick, groupBy, flatMap } from 'lodash';

import { Line, AutoTransformGroup, CanvasObserver } from 'components';
import withReverseStep, { WithReverseStep } from 'hocs/withReverseStep';
import { getProgressDirection, keyExist } from 'utils';
import { IProps, IState } from './index.d';
import { Action } from 'types';
import ArrayMemoryBlock from './ArrayMemoryBlock';
import ArrayHTML from './ArrayHTML';
import transformArrayModel from 'transformers/Array';
import { Array } from 'types/ds/Array';
import {
  ARRAY_BLOCK_WIDTH,
  ARRAY_BLOCK_HEIGHT,
  LINE_HEIGHT,
} from '../../constants';

type PropsWithHoc = IProps & WithReverseStep<Array.Model>;

export class ArrayDS extends Component<PropsWithHoc, IState> {
  private initialArrayModel: Array.Model;
  private wrapperRef: React.RefObject<SVGUseElement>;

  constructor(props: PropsWithHoc) {
    super(props);

    this.initialArrayModel = this.initArrayModel(props);
    this.state = {
      arrayModel: this.initialArrayModel,
      isVisible: true,
      sortingState: {},
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
    const biggestKey = currentModel.length
      ? Math.max(...currentModel.map(({ key }) => key))
      : -1;
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
      executedApiCount,
    } = this.props;
    const { arrayModel } = this.state;

    if (keyExist(this.props, ['currentStep', 'totalStep', 'instructions'])) {
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

        case 'switch':
          this.handleSwitchApi();
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

  setUnsortedLine = (currentModel: Array.Model, [key]: [number]) => {
    const { sortingState } = this.state;
    const elementWithLine = currentModel.find(
      ({ key: itemKey }) => itemKey === key,
    );
    if (!elementWithLine) return currentModel;

    this.setState({
      sortingState: Object.assign({}, sortingState, {
        currentSortingElementIndex: elementWithLine.index,
      }),
    });

    return currentModel;
  };

  setCurrentInsertionSortNode = (
    currentModel: Array.Model,
    [key]: [number],
  ) => {
    const { sortingState } = this.state;
    const currentSortingElement = currentModel.find(
      ({ key: itemKey }) => key === itemKey,
    );
    this.setState({
      sortingState: Object.assign({}, sortingState, {
        currentSortingElementKey: currentSortingElement?.key,
      }),
    });
    return currentModel;
  };

  unsetCurrentInsertionSortNode = (currentModel: Array.Model) => {
    const { sortingState } = this.state;
    this.setState({
      sortingState: Object.assign({}, sortingState, {
        currentSortingElementKey: null,
      }),
    });
    return currentModel;
  };

  resetAll = (currentModel: Array.Model) => {
    this.setState({
      sortingState: {},
    });
    return transformArrayModel(currentModel, 'resetAll', []);
  };

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
    this.updateWithoutAnimation(this.initialArrayModel);
  }

  updateWithoutAnimation(newLinkedListModel: Array.Model) {
    this.setState({ arrayModel: newLinkedListModel, isVisible: false }, () =>
      this.setState({ isVisible: true }),
    );
  }

  handleSwitchApi() {
    const { keepStateWhenSwitchingApi } = this.props;
    if (!keepStateWhenSwitchingApi) {
      this.handleFastBackward();
    }
  }

  componentDidMount() {
    const { interactive } = this.props;
    if (interactive) this.injectHTMLIntoCanvas();
    CanvasObserver.register(this.injectHTMLIntoCanvas);
  }

  injectHTMLIntoCanvas = () => {
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
  };

  // Use IFEE to store private variable in closure
  renderSeparationLine = (() => {
    let initialX: number;

    const getRenderSequence = () => {
      const { currentApi } = this.props;
      switch (currentApi!) {
        case 'bubbleSort':
          return ['unsorted', 'line', 'sorted'];
        case 'insertionSort':
          return ['sorted', 'line', 'unsorted'];
        case 'selectionSort':
          return ['sorted', 'line', 'unsorted'];
      }
    };

    // Because line could appear before or after the block, we need to plus one if needed
    const getActualLineIndex = () => {
      const {
        sortingState: { currentSortingElementIndex },
      } = this.state;
      const { currentApi } = this.props;
      switch (currentApi!) {
        case 'selectionSort':
        case 'bubbleSort':
          return currentSortingElementIndex!;
        case 'insertionSort':
          return currentSortingElementIndex! + 1;
      }
    };

    const getXCoordinationBySequenceIndex = (index: number, text: string) => {
      switch (index) {
        case 0: {
          const offset = text.length * 10;
          return initialX - offset;
        }

        case 1:
          return initialX;
        case 2:
          return initialX + 10;
      }
    };

    return () => {
      const {
        sortingState: { currentSortingElementIndex },
      } = this.state;
      if (currentSortingElementIndex == null) return null;

      const x = ARRAY_BLOCK_WIDTH * getActualLineIndex();
      if (initialX === undefined) initialX = x;
      const y1 = ARRAY_BLOCK_HEIGHT + LINE_HEIGHT;
      const y2 = -LINE_HEIGHT;

      return (
        <AutoTransformGroup origin={{ x, y: 0 }}>
          {getRenderSequence()!.map((item, index) => {
            const x = getXCoordinationBySequenceIndex(index, item)!;
            if (item === 'sorted')
              return (
                <text x={x} y={y2} key={item}>
                  Sorted
                </text>
              );

            if (item === 'unsorted')
              return (
                <text x={x} y={y2} key={item}>
                  Unsorted
                </text>
              );

            if (item === 'line')
              return <Line x1={x} x2={x} y1={y1} y2={y2} key={item} />;
          })}
        </AutoTransformGroup>
      );
    };
  })();

  renderCurrentSortingItem() {
    const {
      sortingState: { currentSortingElementIndex, currentSortingElementKey },
    } = this.state;
    const { blockType } = this.props;

    if (currentSortingElementKey == undefined) return null;
    const currentSortingNode = this.findArrayNodeByKey(
      currentSortingElementKey,
    );
    if (
      currentSortingElementIndex === undefined ||
      currentSortingNode === undefined
    )
      return null;

    return (
      <ArrayMemoryBlock
        visible
        value={null}
        index={currentSortingElementIndex}
        blockType={blockType}
        transform='translate(0, 100)'
      />
    );
  }

  findArrayNodeByKey(key: number) {
    const { arrayModel } = this.state;
    return arrayModel.find(({ key: keyToFind }) => key === keyToFind);
  }

  checkIndexState(index: number, stateProperty: keyof Array.Node) {
    const { arrayModel } = this.state;
    const arrayItem = arrayModel.find(
      ({ index: itemIndex }) => index === itemIndex,
    );
    if (!arrayItem) return false;
    return !!arrayItem[stateProperty];
  }

  render() {
    const {
      arrayModel,
      isVisible,
      sortingState: { currentSortingElementKey },
    } = this.state;
    const { blockType } = this.props;

    const hollowArrayMemoryBlock = arrayModel.map(({ key }, index) => (
      <ArrayMemoryBlock
        key={key}
        visible
        value={null}
        index={index}
        blockType={blockType}
        blur={this.checkIndexState(index, 'blur')}
        focus={this.checkIndexState(index, 'focus')}
      />
    ));

    const arrayMemoryBlock = arrayModel.map(arrayNode => {
      const { key } = arrayNode;
      return (
        <ArrayMemoryBlock
          {...arrayNode}
          blockType={blockType}
          className='array-memory-block--only-value'
          isInsertionSorting={currentSortingElementKey === key}
          labelDirection='bottom'
        />
      );
    });

    return (
      isVisible && (
        <>
          <use
            href='#array'
            {...pick(this.props, ['x', 'y'])}
            ref={this.wrapperRef}
          />
          <defs>
            <g id='array'>
              {this.renderCurrentSortingItem()}
              {hollowArrayMemoryBlock}
              {arrayMemoryBlock}
              {this.renderSeparationLine()}
            </g>
          </defs>
        </>
      )
    );
  }
}

export default withReverseStep<Array.Model, PropsWithHoc>(ArrayDS);
