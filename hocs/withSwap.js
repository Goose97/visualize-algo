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

    componentDidUpdate() {
      if (this.props.focus !== this.state.focus) {
        this.setState({
          focus: this.props.focus,
        });
      }

      if (this.props.isSwap !== this.state.isSwap) {
        this.setState({
          isSwap: this.props.isSwap,
        });
      }
    }

    produceSwapClassId(id) {
      return `swap_path__${id}`;
    }

    constructSwapPath(isSwap) {
      if (isSwap == "1") {
        return `m 0 ${ARRAY_BLOCK_HEIGHT / 8}
      v -${ARRAY_BLOCK_HEIGHT} h ${ARRAY_BLOCK_WIDTH / 2} v ${
          0.87 * ARRAY_BLOCK_HEIGHT
        }`;
      } else if (isSwap == "-1") {
        console.log("hi");
        return `m 0 -${ARRAY_BLOCK_HEIGHT / 8}
      v ${ARRAY_BLOCK_HEIGHT} h ${ARRAY_BLOCK_WIDTH / 2} v -${
          0.87 * ARRAY_BLOCK_HEIGHT
        }`;
      }
    }

    render() {
      const { isSwap, x, y } = this.state;
      console.log(this.props);
      const swapPathId = this.produceSwapClassId(this.props.name);
      console.log(swapPathId);
      return isSwap ? (
        <g>
          <Component {...this.props} />
          <animateMotion dur="3.5s" fill="freeze">
            <mpath xlinkHref={"#" + swapPathId}></mpath>
          </animateMotion>
          <path
            d={this.constructSwapPath(isSwap)}
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
