import React, { Component } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { pick } from 'lodash';

import {
  CodeBlock,
  ExplanationBlock,
  ProgressControl,
  ApiController,
} from '../../components';
import {
  promiseSetState,
  compactObject,
  classNameHelper,
  performAnimation,
} from 'utils';
import { IProps, IState } from './index.d';
import { PointCoordinate } from 'types';

const DEFAULT_WAIT = 1500;
const DEFAULT_SIDEBAR_WIDTH = 300;
const SIDEBAR_COLLAPSE_WIDTH = 30;

export class VisualAlgo extends Component<IProps, IState> {
  private nextStepTimeoutToken?: NodeJS.Timeout;
  private mouseStart?: PointCoordinate;
  private startWidth?: number;
  private widthBeforeCollapse?: number;
  private codeAndExplanationRef: React.RefObject<HTMLDivElement>;

  constructor(props: IProps) {
    super(props);

    this.state = {
      currentStep: -1,
      autoPlay: false,
      isCollapsing: false,
      sideBarWidth: DEFAULT_SIDEBAR_WIDTH,
    };

    this.codeAndExplanationRef = React.createRef();
  }

  static getDerivedStateFromProps(props: IProps, state: IState) {
    if ('autoPlay' in props && props.autoPlay !== state.autoPlay) {
      return {
        autoPlay: props.autoPlay,
      };
    }

    return null;
  }

  resetState() {
    return promiseSetState.call(this, {
      currentStep: -1,
      autoPlay: false,
    });
  }

  componentDidUpdate(_prevProps: IProps, prevState: IState) {
    const { currentStep, autoPlay } = this.state;
    if (currentStep !== prevState.currentStep && currentStep !== -1) {
      this.handleStepChange(currentStep);
    }

    if (autoPlay !== prevState.autoPlay) {
      this.handleAutoPlayChange(autoPlay);
    }
  }

  handleAutoPlayChange(newAutoPlayState: boolean) {
    if (newAutoPlayState) this.increaseCurrentStep();
    else this.cancelNextStepConsumation();
  }

  handleStepChange(newStep: number) {
    const { autoPlay } = this.state;
    const { stepDescription, onStepChange } = this.props;
    if (newStep >= stepDescription.length) return;
    const { codeLine, explanationStep, duration } = stepDescription[newStep];
    const newState = compactObject({ codeLine, explanationStep });
    //@ts-ignore
    this.setState(newState, () => {
      if (autoPlay) {
        this.caculateProgress() !== 100
          ? this.scheduleNextStepConsumation(duration)
          : this.handleTogglePlay(false);
      }
    });

    onStepChange && onStepChange(newStep);
  }

  scheduleNextStepConsumation(wait: number) {
    this.nextStepTimeoutToken = setTimeout(
      this.increaseCurrentStep,
      wait || DEFAULT_WAIT,
    );
  }

  handleTogglePlay(isPlaying: boolean) {
    const { onPlayingChange } = this.props;
    // Nếu được component cha kiểm soát thì không lưu vào state mà gọi lên
    // handler do cha truyền xuống
    if ('autoPlay' in this.props) {
      onPlayingChange && onPlayingChange(isPlaying);
    } else {
      this.setState({ autoPlay: isPlaying });
    }
  }

  increaseCurrentStep = () => {
    const { currentStep } = this.state;
    this.setState({ currentStep: currentStep + 1 });
  };

  cancelNextStepConsumation() {
    this.nextStepTimeoutToken && window.clearTimeout(this.nextStepTimeoutToken);
  }

  decreaseCurrentStep = () => {
    const { currentStep } = this.state;
    this.setState({ currentStep: currentStep - 1 });
  };

  goToFinalStep = () => {
    const { stepDescription } = this.props;
    const finalStep = stepDescription.length - 1;
    this.setState({ currentStep: finalStep });
    this.handleTogglePlay(false);
  };

  goToFirstStep = () => {
    this.setState({ currentStep: 0 });
    this.handleTogglePlay(false);
  };

  caculateProgress() {
    const { currentStep } = this.state;
    const { stepDescription } = this.props;
    const total = stepDescription.length - 1;
    return (currentStep * 100) / total;
  }

  handleStartResize = (e: React.MouseEvent) => {
    this.saveMouseStartPoint(e);
    this.saveWidthWhenStart(e);
    this.startTrackingMouseMove();
  };

  saveMouseStartPoint(e: React.MouseEvent) {
    this.mouseStart = {
      x: e.clientX,
      y: e.clientY,
    };
  }

  saveWidthWhenStart(e: React.MouseEvent) {
    const wrapperDiv = e.currentTarget.parentNode as HTMLDivElement | undefined;
    if (wrapperDiv) {
      this.startWidth = wrapperDiv.getBoundingClientRect().width;
    }
  }

  startTrackingMouseMove() {
    document.addEventListener('mousemove', this.trackingMouseCallback);
    document.addEventListener('mouseup', this.stopTrackingMouseMove);
  }

  trackingMouseCallback = (e: MouseEvent) => {
    if (!this.mouseStart || !this.startWidth) return;
    const deltaX = e.clientX - this.mouseStart.x;
    this.setState({ sideBarWidth: this.startWidth - deltaX });
  };

  stopTrackingMouseMove = () => {
    document.removeEventListener('mousemove', this.trackingMouseCallback);
  };

  handleCollapse = () => {
    const { isCollapsing, sideBarWidth } = this.state;
    if (!isCollapsing) this.widthBeforeCollapse = sideBarWidth;
    performAnimation({
      startValue: sideBarWidth!,
      endValue: isCollapsing
        ? this.widthBeforeCollapse!
        : SIDEBAR_COLLAPSE_WIDTH,
      duration: 300,
      callback: (newWidth: number) => {
        this.setState({ sideBarWidth: newWidth });
      },
    });

    this.setState({
      isCollapsing: !isCollapsing,
    });
  };

  render() {
    const { children, code, explanation } = this.props;
    const {
      codeLine,
      explanationStep,
      autoPlay,
      isCollapsing,
      sideBarWidth,
    } = this.state;

    const visualizationScreen = (
      <div className='fx-3 fx-col visual-container shadow'>
        <div className='fx fx-between px-8 py-2'>
          <ApiController
            {...pick(this.props, [
              'apiList',
              'parameterInput',
              'onApiChange',
              'actionButton',
            ])}
          />
          <ProgressControl
            onForward={this.increaseCurrentStep}
            onFastForward={this.goToFinalStep}
            onBackward={this.decreaseCurrentStep}
            onFastBackward={this.goToFirstStep}
            onPlay={() => this.handleTogglePlay(true)}
            onStop={() => this.handleTogglePlay(false)}
            autoPlay={autoPlay}
            progress={this.caculateProgress()}
          />
        </div>
        <div className='fx-1'>{children}</div>
      </div>
    );

    const className = classNameHelper({
      base: 'fx-col fx-2 code-and-explanation',
    });
    const codeAndExplanation = (
      <div
        className={className}
        style={{ width: sideBarWidth }}
        ref={this.codeAndExplanationRef}
      >
        <div
          className='code-and-explanation__drag-handler'
          onMouseDown={this.handleStartResize}
        ></div>
        <div
          className='code-and-explanation__collapse-button'
          onClick={this.handleCollapse}
        >
          {isCollapsing ? <LeftOutlined /> : <RightOutlined />}
        </div>
        <div className='fx-3 code-container'>
          <CodeBlock code={code} highlightLine={codeLine} />
        </div>
        <div className='fx-2'>
          <ExplanationBlock
            explanation={explanation}
            currentStep={explanationStep}
          />
        </div>
      </div>
    );

    return (
      <div className='fx-col vh-100'>
        {visualizationScreen}
        {codeAndExplanation}
      </div>
    );
  }
}

export default VisualAlgo;
