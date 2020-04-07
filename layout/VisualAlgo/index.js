import React, { Component } from 'react';
import { pick } from 'lodash';

import {
  CodeBlock,
  ExplanationBlock,
  ProgressControl,
  ApiController,
} from '../../components';
import './style.scss';

const DEFAULT_WAIT = 1500;

export class VisualAlgo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [1, 2, 3],
      currentNode: 0,
      currentStep: 0,
      autoPlay: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if ('autoPlay' in props && props.autoPlay !== state.autoPlay) {
      return {
        autoPlay: props.autoPlay,
      };
    }

    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentStep, autoPlay } = this.state;
    // const { autoPlay } = this.props;
    if (currentStep !== prevState.currentStep) {
      this.handleStepChange(currentStep);
    }

    if (autoPlay !== prevState.autoPlay) {
      this.handleAutoPlayChange(autoPlay);
    }
  }

  handleAutoPlayChange(newAutoPlayState) {
    if (newAutoPlayState) this.increaseCurrentStep();
    else this.cancelNextStepConsumation();
  }

  handleStepChange(newStep) {
    const { autoPlay } = this.state;
    const { stepDescription, onStepChange } = this.props;
    if (newStep >= stepDescription.length) return;
    const { state: stateInNewStep, duration } = stepDescription[newStep];
    if (stateInNewStep) {
      this.setState(
        { ...stateInNewStep },
        () =>
          autoPlay &&
          this.caculateProgress() !== 100 &&
          this.scheduleNextStepConsumation(duration),
      );

      onStepChange && onStepChange(stateInNewStep, newStep);
    }
  }

  scheduleNextStepConsumation(wait) {
    this.nextStepTimeoutToken = setTimeout(
      this.increaseCurrentStep,
      wait || DEFAULT_WAIT,
    );
  }

  handleTogglePlay(isPlaying) {
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
  };

  goToFirstStep = () => {
    this.setState({ currentStep: 0 });
  };

  caculateProgress() {
    const { currentStep } = this.state;
    const { stepDescription } = this.props;
    const total = stepDescription.length - 1;
    return (currentStep * 100) / total;
  }

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
      <div className='fx-row fx-2'>
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
