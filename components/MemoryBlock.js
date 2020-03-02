import React, { Component } from "react";

export class MemoryBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transformList: []
    };
  }

  moveDown(amount) {
    const { transformList } = this.state;
    const transformText = `translate(0 ${amount})`;
    this.setState({ transformList: [...transformList, transformText] });
  }

  produceTransformString() {
    const { transformList } = this.state;
    return transformList.join(" ");
  }

  render() {
    const { x, y, value } = this.props;
    return (
      <g transform={this.produceTransformString()} className="has-transition">
        <rect
          x={x}
          y={y}
          width={MEM_BLOCK_WIDTH}
          height={MEM_BLOCK_HEIGHT}
          className="memory-block"
        ></rect>
        <text
          x={x + MEM_BLOCK_WIDTH / 2}
          y={y + MEM_BLOCK_HEIGHT / 2}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {value}
        </text>
      </g>
    );
  }
}

export default MemoryBlock;
