import React, { Component } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import { CodeBlock, ExplanationBlock, ProgressControl } from '../../components';
import {
  promiseSetState,
  compactObject,
  classNameHelper,
  performAnimation,
  AnimationTaskQueue,
} from 'utils';
import { IProps, IState } from './index.d';
import { PointCoordinate } from 'types';
import {
  DEFAULT_WAIT,
  DEFAULT_SIDEBAR_WIDTH,
  SIDEBAR_COLLAPSE_WIDTH,
} from '../../constants';

export class VisualAlgo extends Component<IProps, IState> {
  private nextStepTimeoutToken?: NodeJS.Timeout;
  private mouseStart?: PointCoordinate;
  private startWidth?: number;
  private widthBeforeCollapse?: number;
  private codeAndExplanationRef: React.RefObject<HTMLDivElement>;
  private animationQueue: AnimationTaskQueue<number>;
  private sideBarWidth: number;

  constructor(props: IProps) {
    super(props);

    this.state = {
      currentStep: -1,
      autoPlay: false,
      isCollapsing: false,
    };

    this.codeAndExplanationRef = React.createRef();
    this.animationQueue = new AnimationTaskQueue({
      callback: this.updateSidebarWidth,
    });
    this.sideBarWidth = DEFAULT_SIDEBAR_WIDTH;
  }

  static getDerivedStateFromProps(props: IProps, state: IState) {
    if ('autoPlay' in props && props.autoPlay !== state.autoPlay) {
      return {
        autoPlay: props.autoPlay,
      };
    }

    return null;
  }

  componentDidUpdate = async (_prevProps: IProps, prevState: IState) => {
    const { currentStep, autoPlay } = this.state;
    // currentStep === -1 means we are resetting for a new instruction sequence
    if (currentStep !== prevState.currentStep && currentStep !== -1) {
      this.handleStepChange(currentStep);
    }

    if (autoPlay !== prevState.autoPlay) {
      this.handleAutoPlayChange(autoPlay);
    }
  };

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

  resetForNewApi() {
    this.cancelNextStepConsumation();
    return promiseSetState.call(this, { currentStep: -1 });
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
    if (!stepDescription.length) return 0;
    const total = stepDescription.length - 1;
    return (currentStep * 100) / total;
  }

  handleStartResize = (e: React.MouseEvent) => {
    this.saveMouseStartPoint(e);
    this.saveWidthWhenStart(e);
    this.startTrackingMouseMove();
    this.setState({ isCollapsing: false });
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
    // Prevent dragging to select text
    e.preventDefault();
    if (!this.mouseStart || !this.startWidth) return;
    const deltaX = e.clientX - this.mouseStart.x;
    this.animationQueue.enqueue(this.startWidth - deltaX);
  };

  updateSidebarWidth = (newWidth: number) => {
    const { onSideBarWidthChange } = this.props;
    const sideBarDiv = this.codeAndExplanationRef.current;
    if (sideBarDiv) {
      sideBarDiv.style.width = `${newWidth}px`;
      this.sideBarWidth = newWidth;
      onSideBarWidthChange && onSideBarWidthChange(newWidth);
    }
  };

  stopTrackingMouseMove = () => {
    document.removeEventListener('mousemove', this.trackingMouseCallback);
  };

  handleCollapse = () => {
    const { isCollapsing } = this.state;
    if (!isCollapsing) this.widthBeforeCollapse = this.sideBarWidth;
    performAnimation({
      startValue: this.sideBarWidth,
      endValue: isCollapsing
        ? this.widthBeforeCollapse!
        : SIDEBAR_COLLAPSE_WIDTH,
      duration: 300,
      callback: this.updateSidebarWidth,
    });

    this.setState({
      isCollapsing: !isCollapsing,
    });
  };

  handlePlay = this.handleTogglePlay.bind(this, true);
  handleStop = this.handleTogglePlay.bind(this, false);

  render() {
    const { children, code, explanation, disableProgressControl } = this.props;
    const { codeLine, explanationStep, autoPlay, isCollapsing } = this.state;

    const visualizationScreen = (
      <div className='fx-3 fx-col visual-container shadow'>
        <div className='fx fx-between px-8 py-2'>
          <ProgressControl
            onForward={this.increaseCurrentStep}
            onFastForward={this.goToFinalStep}
            onBackward={this.decreaseCurrentStep}
            onFastBackward={this.goToFirstStep}
            onPlay={this.handlePlay}
            onStop={this.handleStop}
            autoPlay={autoPlay}
            progress={this.caculateProgress()}
            disabled={disableProgressControl}
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
        style={{ width: this.sideBarWidth }}
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
