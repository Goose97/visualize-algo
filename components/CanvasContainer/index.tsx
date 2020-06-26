import React, { Component } from 'react';
import BezierEasing from 'bezier-easing';

import { PanZoomController } from 'components';
import { performAnimation } from 'utils';

interface IProps {}
interface IState {
  viewBox: { width: number; height: number } | null;
  scaleFactor: number;
}

const SCALE_FACTOR_STEP = 0.2;

class CanvasContainer extends Component<IProps, IState> {
  private ref: React.RefObject<SVGSVGElement>;
  constructor(props: IProps) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      viewBox: null,
      scaleFactor: 1,
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
    const { viewBox, scaleFactor } = this.state;
    if (viewBox) {
      const { width, height } = viewBox;
      return `0 0 ${Math.round(width / scaleFactor)} ${Math.round(
        height / scaleFactor,
      )}`;
    } else {
      return '0 0 1500 1500';
    }
  }

  handleZoom = (inOrOut: 'in' | 'out') => () => {
    const { scaleFactor } = this.state;
    const targetScaleFactor =
      inOrOut === 'in'
        ? scaleFactor + SCALE_FACTOR_STEP
        : scaleFactor - SCALE_FACTOR_STEP;

    performAnimation({
      startValue: scaleFactor,
      endValue: targetScaleFactor,
      duration: 300,
      callback: (newScaleFactor: number) =>
        this.setState({ scaleFactor: newScaleFactor }),
      cubicBezierFunction: BezierEasing(1, 0.02, 0.66, 0.74),
    });
  };

  render() {
    const { children } = this.props;
    return (
      <div className='canvas-container'>
        <svg
          viewBox={this.produceViewBox()}
          preserveAspectRatio='xMinYMin slice'
          ref={this.ref}
        >
          {children}
        </svg>
        <div id='html-overlay'></div>
        <PanZoomController
          onZoomIn={this.handleZoom('in')}
          onZoomOut={this.handleZoom('out')}
        />
      </div>
    );
  }
}

export default CanvasContainer;
