import React, { Component } from 'react';
import { pick } from 'lodash';

import withDSCore, { WithDSCore } from 'hocs/withDSCore';
import { IProps, IState } from './index.d';
import ArrayMemoryBlock from './ArrayMemoryBlock';
import SortSeperationLine from './SortSeperationLine';
import ArrayHTML from './ArrayHTML';
import transformArrayModel from 'transformers/Array';
import { Array } from 'types/ds/Array';
import { ARRAY_BLOCK_WIDTH } from '../../constants';

type PropsWithHoc = IProps & WithDSCore<Array.Model>;

class ArrayDS extends Component<PropsWithHoc, IState> {
  private wrapperRef: React.RefObject<SVGUseElement>;
  private sortingLineInitialX?: number; // save initial X so we can perform animation

  constructor(props: PropsWithHoc) {
    super(props);

    this.state = {
      isVisible: true,
      sortingState: {},
    };
    this.wrapperRef = React.createRef();

    // Register custom transformer
    props.registerCustomTransformer({
      push: this.push,
      setUnsortedLine: this.setUnsortedLine,
      setCurrentInsertionSortNode: this.setCurrentInsertionSortNode,
      unsetCurrentInsertionSortNode: this.unsetCurrentInsertionSortNode,
      resetAll: this.resetAll,
    });

    // Register HTML injector
    props.registerHTMLInjector(this.injectHTMLIntoCanvas);
  }

  static initArrayModel(props: IProps): Array.Model {
    return props.initialData.map((value, index) => ({
      value,
      index,
      visible: true,
      visited: false,
      key: index,
      focus: false,
    }));
  }

  componentDidUpdate(prevProps: IProps) {
    const { currentApi } = this.props;
    if (currentApi !== prevProps.currentApi) {
      this.setState({
        sortingState: {},
      });
      this.sortingLineInitialX = undefined;
    }
  }

  injectHTMLIntoCanvas = () => {
    const { handleExecuteApi, dropdownDisabled, model } = this.props;
    setTimeout(() => {
      ArrayHTML.renderToView({
        model,
        wrapperElement: this.wrapperRef.current,
        coordinate: pick(this.props, ['x', 'y']),
        apiHandler: handleExecuteApi,
        disabled: dropdownDisabled,
      });
    }, 0);
  };

  // Custom transformers
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
    return transformArrayModel(currentModel, 'push', [newArrayNode]);
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

  renderSeparationLine = () => {
    const {
      sortingState: { currentSortingElementIndex },
    } = this.state;
    const { currentApi } = this.props;
    if (currentSortingElementIndex == null) return null;

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

    const x = ARRAY_BLOCK_WIDTH * getActualLineIndex();
    if (this.sortingLineInitialX === undefined) this.sortingLineInitialX = x;

    return (
      <SortSeperationLine
        currentApi={currentApi}
        initialX={this.sortingLineInitialX}
        currentX={x}
      />
    );
  };

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
        index={currentSortingElementIndex + 1}
        blockType={blockType}
        transform='translate(0, 100)'
      />
    );
  }

  findArrayNodeByKey(key: number) {
    const { model } = this.props;
    return model.find(({ key: keyToFind }) => key === keyToFind);
  }

  checkIndexState(index: number, stateProperty: keyof Array.Node) {
    const { model } = this.props;
    const arrayItem = model.find(({ index: itemIndex }) => index === itemIndex);
    if (!arrayItem) return false;
    return !!arrayItem[stateProperty];
  }

  render() {
    const {
      sortingState: { currentSortingElementKey },
    } = this.state;
    const { blockType, model } = this.props;

    const hollowArrayMemoryBlock = model.map(({ key }, index) => (
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

    const arrayMemoryBlock = model.map(arrayNode => {
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
    );
  }
}

export default withDSCore<Array.Model, Array.Method>({
  initModel: ArrayDS.initArrayModel,
  dataTransformer: transformArrayModel,
})(ArrayDS);
