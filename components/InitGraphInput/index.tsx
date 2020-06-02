import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Input } from 'antd';

import { Button, CustomModal, GraphDS } from 'components';
import withExtendClassName, {
  WithExtendClassName,
} from 'hocs/withExtendClassName';
import { caculatePointerPathFromTwoNodeCenter } from 'utils';
import { IProps, IState } from './index.d';
import { GRAPH_NODE_RADIUS } from '../../constants';
import { PointCoordinate } from 'types';
import { Graph } from 'types/ds/Graph';

const { TextArea } = Input;

type PropsWithHoc = IProps & WithExtendClassName;

export class InitGraphInput extends Component<PropsWithHoc, IState> {
  private inputRef: React.RefObject<HTMLInputElement>;
  constructor(props: IProps) {
    super(props);

    this.state = {
      input: [],
      error: null,
      isModalVisible: false,
      graphData: [],
    };
    this.inputRef = React.createRef();
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

  handleRandomizeData = () => {
    const randomData = this.generateRandomData();
    let textToMatchThoseData = randomData
      .map(item => (item === null ? 'null' : item.toString()))
      .join(', ');
    textToMatchThoseData = `[${textToMatchThoseData}]`;
    this.setState({ input: randomData, textInput: textToMatchThoseData });
  };

  generateRandomData() {
    return [4, 1, 8, -3, 2, 6, 9, null, -2, null, null, null, null, null, null];
    return Array(8)
      .fill(0)
      .map(() => {
        const value = Math.round(Math.random() * 12);
        if (value > 10) return null;
        else return value;
      });
  }

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
      svgElement.addEventListener('mousemove', e =>
        this.handleMouseMove(e, svgElement),
      );

      svgElement.addEventListener('mouseleave', e =>
        this.handleMouseLeave(svgElement),
      );
    }
  };

  handleMouseMove = (e: MouseEvent, wrapper: SVGElement) => {
    const { left, top } = wrapper.getBoundingClientRect();
    const offsetLeft = e.clientX - left;
    const offsetTop = e.clientY - top;
    const ghostNode = wrapper.querySelector('.init-graph-canvas__ghost-node');
    const transformString = `translate(${offsetLeft}, ${offsetTop})`;
    ghostNode && ghostNode.setAttribute('transform', transformString);
  };

  handleMouseLeave = (wrapper: SVGElement) => {
    const ghostNode = wrapper.querySelector('.init-graph-canvas__ghost-node');
    const transformString = `translate(-100, -100)`;
    ghostNode && ghostNode.setAttribute('transform', transformString);
  };

  handleClickOnSvg = (e: React.MouseEvent) => {
    try {
      const svgElement = e.currentTarget as SVGElement | null;
      const ghostNode = svgElement!.querySelector(
        '.init-graph-canvas__ghost-node',
      );
      const transform = ghostNode.getAttribute('transform');
      const regex = /(?<=translate\()(\d+).*?(\d+)(?=\))/;
      const match = transform?.match(regex);
      const currentMouseCoordinate = {
        x: +match[1],
        y: +match[2],
      };
      this.addNewNode(currentMouseCoordinate);
    } catch (error) {}
  };

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
      <g className='init-graph-canvas__ghost-edge' key={key}>
        <path {...pathAndRotation} d={pathAndRotation.path} />
        <path
          {...pathAndRotation}
          d={pathAndRotation.path}
          className='default-stroke'
        />
      </g>
    );
  }

  render() {
    const { isModalVisible, input, textInput, graphData } = this.state;
    const { className, onSubmit } = this.props;
    const previewWindow = (
      <div className='init-bst-modal__preview fx-7'>
        <svg
          className='init-graph-canvas__wrapper h-full w-full'
          onMouseEnter={this.handleMouseEnter}
          onClick={this.handleClickOnSvg}
        >
          {this.renderGhostNode()}
          {this.renderGhostEdges()}
          <GraphDS data={graphData} controlled x={0} y={0} />
        </svg>
      </div>
    );

    const inputTextArea = (
      <div className='init-bst-modal__input fx-3'>
        <TextArea
          onChange={this.handleChange}
          placeholder='[1,2,3,null,4,5]'
          value={textInput}
        />
        <Button type='secondary' onClick={this.handleRandomizeData}>
          Generate random data
        </Button>
      </div>
    );

    return (
      <Button
        type='primary'
        className={className}
        onClick={() => this.setState({ isModalVisible: true })}
      >
        Create new BST
        <CustomModal
          visible={isModalVisible}
          title='Construct new BST'
          onCancel={() => this.setState({ isModalVisible: false })}
          onOk={() => onSubmit(input)}
        >
          <div className='init-bst-modal__wrapper fx'>
            {previewWindow}
            {inputTextArea}
          </div>
        </CustomModal>
      </Button>
    );
  }
}

export default withExtendClassName('f-big-2 px-6 py-2')(InitGraphInput);
