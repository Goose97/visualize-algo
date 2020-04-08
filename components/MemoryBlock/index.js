import React, { Component } from "react";

import { classNameHelper } from "../../utils";
import "./style.scss";

let POINTER_HOLDER_WIDTH = 20;

export class MemoryBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transformList: [],
      focusNode: props.focusNode,
    };
    this.original = {
      x: props.x,
      y: props.y,
    };
  }

  componentDidUpdate(prevProps) {
    ["x", "y", "visible"].forEach((attribute) =>
      this.checkDiffAndReact(
        prevProps[attribute],
        this.props[attribute],
        attribute
      )
    );
  }

  checkDiffAndReact(prev, now, attribute) {
    switch (attribute) {
      case "visible":
        return this.checkVisibleAndReact(prev, now);
      case "x":
        return this.checkXAxisAndReact(prev, now);
      case "y":
        return this.checkYAxisAndReact(prev, now);
    }
  }

  checkVisibleAndReact(prev, now) {
    if (prev !== now) {
      now ? this.show() : this.hide();
    }
  }

  hide() {
    this.setState({ isHiding: true });
    setTimeout(() => {
      this.setState({ isHiding: false });
    }, 500);
  }

  show() {
    this.setState({ isShowing: true });
    setTimeout(() => {
      this.setState({ isShowing: false });
    }, 500);
  }

  checkXAxisAndReact(prev, now) {
    if (prev !== now) this.move(now - prev, "horizontal");
  }

  checkYAxisAndReact(prev, now) {
    if (prev !== now) this.move(now - prev, "vertical");
  }

  move(amount, direction) {
    const { transformList } = this.state;
    let transformText;
    switch (direction) {
      case "vertical":
        transformText = `translate(0 ${amount})`;
        break;

      case "horizontal":
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

  produceClassName() {
    const { visible, visited, focus } = this.props;
    const { isHiding, isShowing } = this.state;
    return classNameHelper({
      base: "memory-block__wrapper has-transition",
      disappearing: isHiding,
      appearing: isShowing,
      invisible: !visible,
      visited,
      focus,
    });
  }

  constructSeparateLinePath() {
    return `M ${
      this.original.x + LINKED_LIST_BLOCK_WIDTH - POINTER_HOLDER_WIDTH
    } ${this.original.y} v${LINKED_LIST_BLOCK_HEIGHT}`;
  }

  constructSwapPath(text_x, text_y) {
    return `M ${text_x} ${text_y}
    v -90 h -90 v -${ARRAY_BLOCK_HEIGHT}`;
  }

  render() {
    const { value, structureType } = this.props;
    let block_width = 0;
    let block_height = 0;
    switch (structureType) {
      case "array":
        block_width = ARRAY_BLOCK_WIDTH;
        block_height = ARRAY_BLOCK_HEIGHT;
        POINTER_HOLDER_WIDTH = 0;
        break;
      case "list":
        block_width = LINKED_LIST_BLOCK_WIDTH;
        block_height = LINKED_LIST_BLOCK_HEIGHT;
        break;
      case "tree":
        block_width = ARRAY_BLOCK_WIDTH;
        block_height = ARRAY_BLOCK_HEIGHT;
        POINTER_HOLDER_WIDTH = 0;
        break;
    }

    const text_x = this.original.x + (block_width - POINTER_HOLDER_WIDTH) / 2;
    const text_y = this.original.y + block_height / 2;
    console.log("text_x: ", text_x);
    console.log("text_y: ", text_y);
    return (
      <g
        transform={this.produceTransformString()}
        className={this.produceClassName()}
      >
        <rect
          x={this.original.x}
          y={this.original.y}
          width={block_width}
          height={block_height}
          className="memory-block__block"
        ></rect>
        <path
          // d={this.constructSeparateLinePath()}
          className="memory-block__separate-line"
        />
        <text
          x={text_x}
          y={text_y}
          dominantBaseline="middle"
          textAnchor="middle"
          className="memory-block__text"
        >
          <animateMotion dur="3s" fill="freeze">
            <mpath xlinkHref="#swap_path"></mpath>
          </animateMotion>
          {value}
        </text>
        <path
          // d="M 2 2 V -90 H 90 V 2 "
          d={this.constructSwapPath(text_x, text_y)}
          // stroke="#529fd9"
          // stroke-width="2"
          id="swap_path"
          fill="none"
        ></path>
      </g>
    );
  }
}

export default MemoryBlock;
