import React, { Component } from "react";

export class MemoryBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transformList: []
    };
  }

  move(amount, direction) {
    const { transformList } = this.state;
    let transformText;
    switch (direction) {
      case "top":
        transformText = `translate(0 ${-amount})`;
        break;
      case "down":
        transformText = `translate(0 ${amount})`;
        break;
      case "left":
        transformText = `translate(${-amount} 0)`;
        break;
      case "right":
        transformText = `translate(${amount} 0)`;
        break;
    }
    this.setState({ transformList: [...transformList, transformText] });
  }

  produceTransformString() {
    const { transformList } = this.state;
    return transformList.join(" ");
  }

  resetTransform() {
    this.setState({ transformList: [] });
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
