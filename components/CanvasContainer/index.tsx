import React, { Component } from 'react';
import BezierEasing from 'bezier-easing';

import { PanZoomController, CanvasObserver } from 'components';
import { performAnimation } from 'utils';
import { PointCoordinate } from 'types';

interface IProps {}
interface IState {
  viewBox: { width: number; height: number } | null;
  scaleFactor: number;
  translateFromOrigin: PointCoordinate;
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
      translateFromOrigin: { x: 0, y: 0 },
    };
  }

  componentWillUnmount() {
    this.cleanUpEventListener();
  }

  componentDidMount() {
    this.setUpEventListener();
    this.caculateViewBox();
    CanvasObserver.initiate();
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
    const {
      viewBox,
      scaleFactor,
      translateFromOrigin: { x, y },
    } = this.state;
    if (viewBox) {
      const { width, height } = viewBox;
      return `${x} ${y} ${Math.round(width / scaleFactor)} ${Math.round(
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

  handlePanning = (deltaX: number, deltaY: number) => {
    const {
      translateFromOrigin: { x, y },
    } = this.state;
    this.setState({
      translateFromOrigin: {
        x: x - deltaX,
        y: y - deltaY,
      },
    });
  };

  getHTMLTransform() {
    const {
      translateFromOrigin: { x, y },
      scaleFactor,
    } = this.state;
    return `translate(${-x * scaleFactor}px, ${-y * scaleFactor}px)`;
  }

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
        <div
          id='html-overlay'
          style={{ transform: this.getHTMLTransform() }}
        ></div>
        <PanZoomController
          onZoomIn={this.handleZoom('in')}
          onZoomOut={this.handleZoom('out')}
          onPanning={this.handlePanning}
        />
      </div>
    );
  }
}

export default CanvasContainer;
