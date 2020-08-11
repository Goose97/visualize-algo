import React, { Component, MouseEvent } from 'react';
import ReactDOM from 'react-dom';

import { Button, CustomModal, GraphDS } from 'components';
import withExtendClassName, {
  WithExtendClassName,
} from 'hocs/withExtendClassName';
import {
  caculatePointerPathFromTwoNodeCenter,
  caculateDistanceToALine,
} from 'utils';
import transformGraphModel from 'transformers/Graph';
import { IProps, IState } from './index.d';
import { GRAPH_NODE_RADIUS } from '../../constants';
import { PointCoordinate } from 'types';
import { Graph } from 'types/ds/Graph';

type PropsWithHoc = IProps & WithExtendClassName;

export class InitGraphInput extends Component<PropsWithHoc, IState> {
  private inputRef: React.RefObject<HTMLInputElement>;
  private svgWrapper?: SVGElement;
  private currentlyHoverOnEdges: SVGPathElement[];
  constructor(props: IProps) {
    super(props);

    this.state = {
      input: [],
      error: null,
      isModalVisible: false,
      graphData: [],
    };
    this.inputRef = React.createRef();
    this.currentlyHoverOnEdges = [];
  }

  handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const stateChanges = this.getBSTRepresentationFromInputText(e.target.value);
    //@ts-ignore
    this.setState({ ...stateChanges, textInput: e.target.value });
  };

  getBSTRepresentationFromInputText(
    inputText: string,
  ): { input?: Array<number | null>; error?: string | null } {
    const regex = /^\[([(\d|null),\s]+)\]$/;
    const match = inputText.match(regex);
    if (!match) return { error: 'Sai cú pháp' };
    return {
      input: match[1]
        .split(',')
        .map(string => (string.includes('null') ? null : parseInt(string)))
        .filter(item => item === null || typeof item === 'number'),
      error: null,
    };
  }

  focusToInput = () => {
    const inputElement = this.inputRef.current;
    const htmlInput = ReactDOM.findDOMNode(inputElement) as HTMLInputElement;
    htmlInput?.focus();
  };

  renderGhostNode() {
    return (
      <g
        className='init-graph-canvas__ghost-node'
        transform='translate(-100, -100)'
      >
        <circle cx={0} cy={0} r={GRAPH_NODE_RADIUS}></circle>
        <text x={0} y={0} dominantBaseline='middle' textAnchor='middle'>
          +
        </text>
      </g>
    );
  }

  handleMouseEnter = (e: React.MouseEvent) => {
    const svgElement = e.currentTarget as SVGElement | null;
    if (svgElement) {
      this.svgWrapper = svgElement;
      //@ts-ignore
      svgElement.addEventListener('mousemove', e => this.handleMouseMove(e));
      svgElement.addEventListener('mouseleave', () => this.handleMouseLeave());
    }
  };

  handleMouseMove = (e: MouseEvent) => {
    const ghostNode = this.svgWrapper!.querySelector(
      '.init-graph-canvas__ghost-node',
    );
    if (!ghostNode) return;

    const mousePosition = this.getRelativeMousePositionWithSvg(e);
    // Make ghost node follow mouse position
    const transformString = `translate(${mousePosition.x}, ${mousePosition.y})`;
    ghostNode.setAttribute('transform', transformString);

    // Hide ghost node if currently hover on ghost edge
    const ghostEdgesMouseCurrentlyHover = this.getGhostEdgesMouseCurrentlyHover(
      e,
    );
    ghostNode.setAttribute(
      'opacity',
      ghostEdgesMouseCurrentlyHover.length ? '0' : '1',
    );

    // Hide ghost edges which are not currently hover on
    // Show those got hovered
    this.showAndHideGhostEdges(ghostEdgesMouseCurrentlyHover);

    // Save current hovered edges
    this.currentlyHoverOnEdges = ghostEdgesMouseCurrentlyHover;
  };

  showAndHideGhostEdges(currentHoverOnEdges: SVGPathElement[]) {
    currentHoverOnEdges.forEach(edge => {
      (edge.parentNode as SVGGElement).classList.add('show');
    });
    const allGhostEdges = this.svgWrapper!.querySelectorAll<SVGPathElement>(
      '.init-graph-canvas__ghost-edge-hover-area',
    );
    Array.from(allGhostEdges).forEach(edge => {
      if (!currentHoverOnEdges.includes(edge))
        (edge.parentNode as SVGGElement).classList.remove('show');
    });
  }

  getRelativeMousePositionWithSvg(e: MouseEvent) {
    const { left, top } = this.svgWrapper!.getBoundingClientRect();
    const offsetLeft = e.clientX - left;
    const offsetTop = e.clientY - top;
    return {
      x: offsetLeft,
      y: offsetTop,
    };
  }

  getGhostEdgesMouseCurrentlyHover(mouseEvent: MouseEvent) {
    const allGhostEdges = this.svgWrapper!.querySelectorAll<SVGPathElement>(
      '.init-graph-canvas__ghost-edge > .init-graph-canvas__ghost-edge-hover-area',
    );
    const { x: mouseX, y: mouseY } = this.getRelativeMousePositionWithSvg(
      mouseEvent,
    );

    if (!allGhostEdges) return [];
    return Array.from(allGhostEdges).filter(item => {
      // We consider point which stay in range of the line
      // and also have distance to the line smaller than 10
      const [startX, startY, endX, endY] = [
        'start-x',
        'start-y',
        'end-x',
        'end-y',
      ].map(attrs => {
        const value = item.getAttribute(attrs);
        return value != null ? parseInt(value) : 0;
      });

      const inRangeOfLine =
        (mouseY - startY) * (mouseY - endY) < 0 ||
        (mouseX - startX) * (mouseX - endX) < 0;
      const distance = caculateDistanceToALine(
        { x: mouseX, y: mouseY },
        { x: startX, y: startY },
        { x: endX, y: endY },
      );
      return inRangeOfLine && distance < 25;
    });
  }

  handleMouseLeave = () => {
    const ghostNode = this.svgWrapper!.querySelector(
      '.init-graph-canvas__ghost-node',
    );
    const transformString = `translate(-100, -100)`;
    ghostNode && ghostNode.setAttribute('transform', transformString);
  };

  handleClickOnSvg = (e: React.MouseEvent) => {
    try {
      const svgElement = e.currentTarget as SVGElement | null;
      const ghostNode = svgElement!.querySelector(
        '.init-graph-canvas__ghost-node',
      );
      //@ts-ignore
      const transform = ghostNode.getAttribute('transform');
      const regex = /(?<=translate\()(\d+).*?(\d+)(?=\))/;
      const match = transform?.match(regex);
      const currentMouseCoordinate = {
        //@ts-ignore
        x: +match[1],
        //@ts-ignore
        y: +match[2],
      };

      if (this.currentlyHoverOnEdges.length) {
        this.addNewEdges(this.currentlyHoverOnEdges);
      } else {
        this.addNewNode(currentMouseCoordinate);
      }
    } catch (error) {}
  };

  addNewEdges(edgesPathElement: SVGPathElement[]) {
    const { graphData } = this.state;
    const addOneEdge = (data: Graph.Model, edgeElement: SVGPathElement) => {
      const edgeKey = (edgeElement.parentNode as SVGGElement).getAttribute(
        'edgekey',
      );
      if (!edgeKey) return data;
      const [nodeA, nodeB] = edgeKey.split('-').map(item => parseInt(item));
      return transformGraphModel(data, 'addEdge', [nodeA, nodeB]);
    };

    const graphDataAfterAddEdges = edgesPathElement.reduce(
      (finalState, edgeElement) => addOneEdge(finalState, edgeElement),
      graphData,
    );
    this.setState({ graphData: graphDataAfterAddEdges });
  }

  addNewNode(coordinate: PointCoordinate) {
    const { graphData } = this.state;
    const biggestKey = Math.max(...graphData.map(({ key }) => key));
    const newNode = {
      x: coordinate.x - GRAPH_NODE_RADIUS,
      y: coordinate.y - GRAPH_NODE_RADIUS,
      key: ~~biggestKey + 1,
      adjacentNodes: [],
      value: ~~biggestKey + 1,
      visible: true,
    };
    this.setState({ graphData: graphData.concat(newNode) });
  }

  renderGhostEdges() {
    const { graphData } = this.state;
    if (graphData.length < 2) return null;

    let result = [];
    for (let i = 0; i < graphData.length; i++) {
      for (let j = i + 1; j < graphData.length; j++) {
        const ghoseEdge = this.renderOneGhostEdge(graphData[i], graphData[j]);
        result.push(ghoseEdge);
      }
    }

    return result;
  }

  renderOneGhostEdge(nodeA: Graph.NodeModel, nodeB: Graph.NodeModel) {
    const nodeACenter = {
      x: nodeA.x + GRAPH_NODE_RADIUS,
      y: nodeA.y + GRAPH_NODE_RADIUS,
    };
    const nodeBCenter = {
      x: nodeB.x + GRAPH_NODE_RADIUS,
      y: nodeB.y + GRAPH_NODE_RADIUS,
    };
    const pathAndRotation = caculatePointerPathFromTwoNodeCenter(
      nodeACenter,
      nodeBCenter,
      GRAPH_NODE_RADIUS,
      true,
    );
    const key = `${nodeA.key}-${nodeB.key}`;

    return (
      //@ts-ignore
      <g className='init-graph-canvas__ghost-edge' key={key} edgekey={key}>
        <path
          transform={pathAndRotation.transform}
          d={pathAndRotation.path}
          start-x={nodeACenter.x}
          start-y={nodeACenter.y}
          end-x={nodeBCenter.x}
          end-y={nodeBCenter.y}
          className='init-graph-canvas__ghost-edge-hover-area stroke-1'
        />
        <path
          {...pathAndRotation}
          d={pathAndRotation.path}
          className='default-stroke stroke-2'
        />
      </g>
    );
  }

  handleOk = () => {
    const { onSubmit } = this.props;
    const { graphData } = this.state;
    // Shift all node to left and top some amount so the whole DS start at 0 and 0
    const amountToShiftLeft = Math.min(...graphData.map(({ x }) => x));
    const amountToShiftTop = Math.min(...graphData.map(({ y }) => y));
    const shiftedGraphData = graphData.map(node => ({
      ...node,
      x: node.x - amountToShiftLeft,
      y: node.y - amountToShiftTop,
    }));
    onSubmit(shiftedGraphData);
  };

  render() {
    const { isModalVisible, graphData } = this.state;
    const { className } = this.props;
    const previewWindow = (
      <div className='init-bst-modal__preview fx-7'>
        <svg
          className='init-graph-canvas__wrapper h-full w-full'
          onMouseEnter={this.handleMouseEnter}
          onClick={this.handleClickOnSvg}
        >
          {this.renderGhostNode()}
          {this.renderGhostEdges()}
          <GraphDS data={graphData} controlled x={0} y={0} instructions={[]} />
        </svg>
      </div>
    );

    return (
      <Button
        type='primary'
        className={className}
        onClick={() => this.setState({ isModalVisible: true })}
      >
        Create new graph
        <CustomModal
          visible={isModalVisible}
          title='Construct new graph'
          onCancel={() => this.setState({ isModalVisible: false })}
          onOk={this.handleOk}
        >
          <div className='init-bst-modal__wrapper fx'>{previewWindow}</div>
        </CustomModal>
      </Button>
    );
  }
}

export default withExtendClassName('f-big-2 px-6 py-2')(InitGraphInput);
