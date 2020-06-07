import React, { Component } from 'react';
import { flatMap, groupBy, pick, isFunction, uniqBy } from 'lodash';

import { GraphMemoryBlock, GraphLikeEdges } from 'components';
import { GraphHTML } from 'components/Graph/GraphHTML';
import withReverseStep, { WithReverseStep } from 'hocs/withReverseStep';
import transformGraphModel from 'transformers/Graph';
import { getProgressDirection, keyExist } from 'utils';
import { IProps, IState } from './index.d';
import { Action, ActionWithStep, ObjectType } from 'types';
import { Graph } from 'types/ds/Graph';

type PropsWithHoc = IProps & WithReverseStep<Graph.Model>;

export class GraphDS extends Component<PropsWithHoc, IState> {
  private wrapperRef: React.RefObject<SVGUseElement>;

  constructor(props: PropsWithHoc) {
    super(props);

    this.state = {
      graphModel: props.initialData!,
      isVisible: true,
    };
    this.wrapperRef = React.createRef();
  }

  componentDidUpdate(prevProps: IProps) {
    const {
      currentStep,
      reverseToStep,
      saveStepSnapshots,
      totalStep,
    } = this.props;
    const { graphModel } = this.state;

    // Update according to algorithm progression
    if (keyExist(this.props, ['currentStep', 'totalStep', 'instructions'])) {
      switch (
        getProgressDirection(currentStep!, prevProps.currentStep!, totalStep!)
      ) {
        case 'forward':
          saveStepSnapshots(graphModel, currentStep!);
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
    // Treat each action as a transformation function which take a graphModel
    // and return a new one. Consuming multiple actions is merely chaining those
    // transformations together
    // graphModel ---- action1 ----> graphModel1 ---- action2 ----> graphMode2 ---- action3 ----> graphModel3
    const { graphModel } = this.state;
    const { currentStep, instructions } = this.props;
    const actionsToMakeAtThisStep = instructions[currentStep!];
    if (!actionsToMakeAtThisStep || !actionsToMakeAtThisStep.length) return;

    // This consume pipeline have many side effect in each step. Each
    // method handle each action has their own side effect
    const newGraphModel = this.consumeMultipleActions(
      actionsToMakeAtThisStep,
      graphModel,
    );
    this.setState({ graphModel: newGraphModel });
  }

  consumeMultipleActions(
    actionList: Action<Graph.Method>[],
    currentModel: Graph.Model,
    onlyTranformData?: boolean,
  ): Graph.Model {
    // Treat each action as a transformation function which take a graphModel
    // and return a new one. Consuming multiple actions is merely chaining those
    // transformations together
    // graphModel ---- action1 ----> graphModel1 ---- action2 ----> graphMode2 ---- action3 ----> graphModel3
    return actionList.reduce<Graph.Model>((finalModel, action) => {
      // the main function of a handler is doing side effect before transform model
      // a handler must also return a new model
      // if no handler is specify, just transform model right away
      const { name, params } = action;
      //@ts-ignore
      const customHandler = this[name];

      if (typeof customHandler === 'function') {
        return customHandler(finalModel, params, onlyTranformData);
      } else {
        return transformGraphModel(finalModel, name, params);
      }
    }, currentModel);
  }

  handleReverse = (stateOfPreviousStep: Graph.Model) => {
    this.setState({ graphModel: stateOfPreviousStep });
  };

  handleFastForward() {
    const { graphModel } = this.state;
    const { instructions, saveStepSnapshots } = this.props;
    let allActions: ActionWithStep<Graph.Method>[] = [];
    for (let i = 0; i < instructions.length; i++) {
      // Replace visit action with vist + focus
      // also add step attribute to each action
      const replacedActions: ActionWithStep<Graph.Method>[] = flatMap(
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
    let finalGraphModel = Object.entries(actionsGroupedByStep).reduce<
      Graph.Model
    >((currentModel, [step, actionsToMakeAtThisStep]) => {
      saveStepSnapshots(currentModel, +step);
      return this.consumeMultipleActions(
        actionsToMakeAtThisStep,
        currentModel,
        true,
      );
    }, graphModel);
    this.updateWithoutAnimation(finalGraphModel);
  }

  handleFastBackward() {
    this.updateWithoutAnimation(this.initialGraphModel);
  }

  updateWithoutAnimation(newGraphModel: Graph.Model) {
    this.setState({ graphModel: newGraphModel, isVisible: false }, () =>
      this.setState({ isVisible: true }),
    );
  }

  getGraphModel() {
    const { data, controlled } = this.props;
    const { graphModel } = this.state;
    return controlled ? data! : graphModel;
  }

  renderVertices() {
    return this.getGraphModel().map(node => <GraphMemoryBlock {...node} />);
  }

  renderEdges() {
    let allEdgesToRender = this.getAllEdgesToRender();
    return allEdgesToRender.map(({ key: vertexPair, highlight }) => {
      const [from, to] = vertexPair
        .split('-')
        .map(key => this.findNodeByKey(this.getGraphModel(), +key));

      if (from && to) {
        return (
          <GraphLikeEdges
            from={pick(from, ['x', 'y'])}
            to={pick(to, ['x', 'y'])}
            key={vertexPair}
            highlight={highlight}
            visible
          />
        );
      } else {
        return null;
      }
    });
  }

  getAllEdgesToRender() {
    let allEdgesToRender: Array<{ key: string; highlight: boolean }> = [];
    this.getGraphModel().forEach(({ key, adjacentNodes, highlightEdges }) => {
      adjacentNodes.forEach(adjacentKey => {
        const edgeKey = [key, adjacentKey].sort().join('-');
        const isEdgeNeedFocus = !!highlightEdges?.includes(adjacentKey);
        allEdgesToRender.push({
          key: edgeKey,
          highlight: isEdgeNeedFocus,
        });
      });
    });

    return uniqBy([...allEdgesToRender.values()], ({ key }) => key);
  }

  findNodeByKey(model: Graph.Model, nodeKey: number) {
    return model.find(({ key }) => key === nodeKey);
  }

  componentDidMount() {
    const { interactive } = this.props;
    if (interactive) this.injectHTMLIntoCanvas();
  }

  injectHTMLIntoCanvas() {
    const { graphModel } = this.state;
    const { handleExecuteApi } = this.props;
    setTimeout(() => {
      GraphHTML.renderToView({
        model: graphModel,
        wrapperElement: this.wrapperRef.current,
        coordinate: pick(this.props, ['x', 'y']),
        apiHandler: (apiName: string, params?: ObjectType<any>) => {
          if (!isFunction(handleExecuteApi)) return;
          handleExecuteApi(apiName, params);
        },
      });
    }, 0);
  }

  render() {
    const { isVisible } = this.state;
    return (
      isVisible && (
        <>
          <use
            href='#graph'
            {...pick(this.props, ['x', 'y'])}
            ref={this.wrapperRef}
          />
          <defs>
            <g id='graph'>
              {this.renderEdges()}
              {this.renderVertices()}
            </g>
          </defs>
        </>
      )
    );
  }
}

export default withReverseStep<Graph.Model, PropsWithHoc>(GraphDS);
