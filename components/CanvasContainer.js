import React, { Component } from 'react';

class CanvasContainer extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      viewBox: null,
    };
  }

  componentWillUnmount() {
    this.cleanUpEventListener();
  }

  componentDidMount() {
    this.setUpEventListener();
    this.caculateViewBox();
  }

  setUpEventListener() {
    window.addEventListener('resize', this.caculateViewBox);
  }

  cleanUpEventListener() {
    window.removeEventListener('resize', this.caculateViewBox);
  }

  // TODO: debounce ham nay
  caculateViewBox = () => {
    const svgElement = this.ref.current;
    if (svgElement) {
      const container = svgElement.parentNode;
      const { width, height } = container.getBoundingClientRect();
      this.setState({
        viewBox: {
          width,
          height,
        },
      });
    }
  };

  produceViewBox() {
    const { viewBox } = this.state;
    if (viewBox) {
      const { width, height } = viewBox;
      return `0 0 ${Math.round(width)} ${Math.round(height)}`;
    } else {
      return '0 0 1500 1500';
    }
  }

  render() {
    const { children } = this.props;
    return (
      <svg
        className='canvas-container'
        viewBox={this.produceViewBox()}
        preserveAspectRatio='xMinYMin slice'
        ref={this.ref}
      >
        {children}
      </svg>
    );
  }
}

export default CanvasContainer;
