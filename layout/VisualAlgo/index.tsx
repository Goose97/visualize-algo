import React, { Component } from 'react';
import { pick } from 'lodash';

import {
  CodeBlock,
  ExplanationBlock,
  ProgressControl,
  ApiController,
} from '../../components';
import { promiseSetState, compactObject } from 'utils';
import { IProps, IState } from './index.d';

const DEFAULT_WAIT = 1500;

export class VisualAlgo extends Component<IProps, IState> {
  private nextStepTimeoutToken?: NodeJS.Timeout;
  constructor(props: IProps) {
    super(props);

    this.state = {
      currentStep: -1,
      autoPlay: false,
    };
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

  handleStartResize = e => {
    this.saveMouseStartPoint(e);
    this.saveHeightWhenStart(e);
    this.startTrackingMouseMove();
  };

  saveMouseStartPoint(e) {
    this.mouseStart = {
      x: e.clientX,
      y: e.clientY,
    };
  }

  saveHeightWhenStart(e) {
    const wrapperDiv = e.currentTarget.parentNode;
    this.startHeight = wrapperDiv.getBoundingClientRect().height;
    this.newHeight = this.startHeight;
  }

  startTrackingMouseMove() {
    document.addEventListener('mousemove', this.trackingMouseCallback);
    document.addEventListener('mouseup', this.stopTrackingMouseMove);
  }

  trackingMouseCallback = e => {
    const deltaY = e.clientY - this.mouseStart.y;
    this.newHeight = this.startHeight - deltaY;
    this.forceUpdate();
  };

  stopTrackingMouseMove = () => {
    document.removeEventListener('mousemove', this.trackingMouseCallback);
  };

  render() {
    const { children, code, explanation } = this.props;
    const { codeLine, explanationStep, autoPlay } = this.state;

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
        {children}
      </div>
    );

    const codeAndExplanation = (
      <div
        className='fx-row fx-2'
        style={{ position: 'relative', maxHeight: this.newHeight }}
      >
        <div
          className='drag-handler'
          onMouseDown={this.handleStartResize}
        ></div>
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
