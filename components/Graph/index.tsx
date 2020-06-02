import React, { Component } from 'react';
import { flatMap, groupBy, pick } from 'lodash';

import { GraphMemoryBlock, GraphLikeEdges } from 'components';
import withReverseStep, { WithReverseStep } from 'hocs/withReverseStep';
import transformGraphModel from 'transformers/Graph';
import { getProgressDirection, keyExist } from 'utils';
import { IProps, IState } from './index.d';
import { Action, ActionWithStep } from 'types';
import { Graph } from 'types/ds/Graph';

type PropsWithHoc = IProps & WithReverseStep<Graph.Model>;

export class GraphDS extends Component<PropsWithHoc, IState> {
  private wrapperRef: React.RefObject<SVGUseElement>;

  constructor(props: PropsWithHoc) {
    super(props);

    this.state = {
      graphModel: this.initGraphModel(),
      isVisible: true,
    };
    this.wrapperRef = React.createRef();
  }

  initGraphModel() {
    return [
      {
        key: 1,
        value: 1,
        x: 100,
        y: 100,
        adjacentNodes: [2, 3],
        visible: true,
      },
      {
        key: 2,
        value: 2,
        x: 200,
        y: 200,
        adjacentNodes: [1, 3],
        visible: true,
      },
      {
        key: 3,
        value: 3,
        x: 150,
        y: 300,
        adjacentNodes: [1, 2],
        visible: true,
      },
    ];
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

  renderVertices() {
    const { graphModel } = this.state;
    return graphModel.map(node => <GraphMemoryBlock {...node} />);
  }

  renderEdges() {
    const { graphModel } = this.state;
    let allEdgesToRender = this.getAllEdgesToRender();
    return allEdgesToRender.map(vertexPair => {
      const [from, to] = vertexPair
        .split('-')
        .map(key => this.findNodeByKey(graphModel, +key));

      if (from && to) {
        return (
          <GraphLikeEdges
            from={pick(from, ['x', 'y'])}
            to={pick(to, ['x', 'y'])}
            key={vertexPair}
            // visible={!!this.isNodeVisible(bstModel, child)}
            visible
            // visited={visited && childVisited}
            // following={nodeAboutToVisit.has(child)}
            arrowDirection='right'
          />
        );
      } else {
        return null;
      }
    });
  }

  getAllEdgesToRender() {
    const { graphModel } = this.state;
    let allEdgesToRender: Set<string> = new Set([]);
    graphModel.forEach(({ key, adjacentNodes }) => {
      adjacentNodes.forEach(adjacentKey => {
        const edgeKey = [key, adjacentKey].sort().join('-');
        allEdgesToRender.add(edgeKey);
      });
    });

    return [...allEdgesToRender.values()];
  }

  findNodeByKey(model: Graph.Model, nodeKey: number) {
    return model.find(({ key }) => key === nodeKey);
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
              {this.renderVertices()}
              {this.renderEdges()}
            </g>
          </defs>
        </>
      )
    );
  }
}

export default withReverseStep<Graph.Model, PropsWithHoc>(GraphDS);
