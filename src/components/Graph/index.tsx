import React, { Component } from 'react';
import { pick, isFunction, uniqBy } from 'lodash';

import { GraphMemoryBlock, GraphLikeEdges } from 'components';
import { GraphHTML } from 'components/Graph/GraphHTML';
import withDSCore, { WithDSCore } from 'hocs/withDSCore';
import transformGraphModel from 'transformers/Graph';
import { IProps } from './index.d';
import { ObjectType } from 'types';
import { Graph } from 'types/ds/Graph';

type PropsWithHoc = IProps & WithDSCore<Graph.Model>;

export class GraphDS extends Component<PropsWithHoc> {
  private wrapperRef: React.RefObject<SVGUseElement>;

  constructor(props: PropsWithHoc) {
    super(props);

    this.wrapperRef = React.createRef();

    // Register HTML injector
    props.registerHTMLInjector(this.injectHTMLIntoCanvas);
  }

  static initGraphModel(props: IProps) {
    return props.initialData || [];
  }

  getGraphModel() {
    const { data, controlled, model } = this.props;
    return controlled ? data! : model;
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

  injectHTMLIntoCanvas = () => {
    const { model } = this.props;
    const { handleExecuteApi, dropdownDisabled } = this.props;
    setTimeout(() => {
      GraphHTML.renderToView({
        model,
        wrapperElement: this.wrapperRef.current,
        coordinate: pick(this.props, ['x', 'y']),
        apiHandler: (apiName: string, params?: ObjectType<any>) => {
          if (!isFunction(handleExecuteApi)) return;
          handleExecuteApi(apiName, params);
        },
        disabled: dropdownDisabled,
      });
    }, 0);
  };

  render() {
    return (
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
    );
  }
}

export default withDSCore({
  initModel: GraphDS.initGraphModel,
  dataTransformer: transformGraphModel,
  //@ts-ignore
})(GraphDS);
