import React, { Component } from "react";

const withSwap = (Component) => {
  class WrapedComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        focus: props.focus,
        isSwap: props.isSwap,
        x: props.x,
        y: props.y,
      };
    }

    constructSwapPath(text_x, text_y) {
      console.log(text_x, text_y);
      return `M ${text_x} ${text_y + ARRAY_BLOCK_HEIGHT}
			v -90 h -90 v ${1.25 * ARRAY_BLOCK_HEIGHT}`;
    }

    render() {
      // console.log(this.props.isSwap);
      const { isSwap, x, y } = this.state;
      return isSwap ? (
        <g>
          <Component {...this.props} />
          <animateMotion dur="3s" fill="freeze">
            <mpath xlinkHref="#swap_path"></mpath>
          </animateMotion>
          <path
            // d="M 2 2 V -90 H 90 V 2 "
            d={this.constructSwapPath(x, y)}
            // stroke="#529fd9"
            // stroke-width="2"
            id="swap_path"
            fill="none"
          ></path>
          
        </g>
      ) : (
        <Component {...this.props} />
      );
    }
  }
  return WrapedComponent;
};

export default withSwap;
