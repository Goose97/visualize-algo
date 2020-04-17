import React, { Component } from "react";

const withSwap = (Component) => {
  class WrapedComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        focus: props.focus,
        isSwap: props.isSwap,
        swapDistance: props.swapDistance,
        x: props.x,
        y: props.y,
      };
    }

    componentDidUpdate() {
      if (this.props.focus !== this.state.focus) {
        this.setState({
          focus: this.props.focus,
        });
      }

      if (this.props.isSwap !== this.state.isSwap) {
        this.setState({
          isSwap: this.props.isSwap,
          swapDistance: this.props.swapDistance,
        });
      }
    }

    produceSwapTagId(id) {
      return `swap_path__${id}`;
    }

    getSwapTagId(id){
      return `#swap_path__${id}`;
    }

    constructSwapPath(isSwap, swapDistance) {
      if (isSwap == "1") {
        return `m 0 ${ARRAY_BLOCK_HEIGHT / 8}
      v -${ARRAY_BLOCK_HEIGHT} h ${swapDistance*ARRAY_BLOCK_WIDTH / 2} v ${
          0.875 * ARRAY_BLOCK_HEIGHT
        }`;
      } else if (isSwap == "-1") {
        console.log("hi");
        return `m 0 -${ARRAY_BLOCK_HEIGHT / 8}
      v ${ARRAY_BLOCK_HEIGHT} h -${swapDistance*ARRAY_BLOCK_WIDTH / 2} v -${
          0.875 * ARRAY_BLOCK_HEIGHT
        }`;
      }
    }

    render() {
      const { isSwap, swapDistance } = this.state;
      const swapPathId = this.produceSwapTagId(this.props.name);
      return isSwap ? (
        <g>
          <Component {...this.props} />
          <animateMotion dur="3.5s" fill="freeze">
            <mpath xlinkHref={this.getSwapTagId(this.props.name)}></mpath>
          </animateMotion>
          <path
            d={this.constructSwapPath(isSwap, swapDistance)}
            id={swapPathId}
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
