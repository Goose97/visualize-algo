import React, { Component } from 'react';

interface IProps {}
interface IState {
  viewBox: { width: number; height: number } | null;
}

class CanvasContainer extends Component<IProps, IState> {
  private ref: React.RefObject<SVGSVGElement>;
  constructor(props: IProps) {
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
      const container = svgElement.parentNode as HTMLElement;
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
