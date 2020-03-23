import React, { Component } from 'react';
import Select from 'react-select';

import { CodeBlock, ExplanationBlock, ProgressControl } from '../../components';
import './style.scss';

const DEFAULT_WAIT = 1500;

export class VisualAlgo extends Component {
  constructor(props) {
    super(props);

    const initialState = props.stepDescription[0].state;
    this.state = { ...initialState, currentStep: 0, autoPlay: false };
  }

  componentDidUpdate(_prevProps, prevState) {
    const { currentStep } = this.state;
    if (currentStep !== prevState.currentStep) {
      this.handleStepChange(currentStep);
    }
  }

  handleStepChange(newStep) {
    const { autoPlay } = this.state;
    const { stepDescription, onStepChange } = this.props;
    if (newStep >= stepDescription.length) return;
    const { state: stateInNewStep, duration } = stepDescription[newStep];
    if (stateInNewStep) {
      this.setState(
        { ...stateInNewStep },
        () => autoPlay && this.scheduleNextStepConsumation(duration),
      );

      onStepChange && onStepChange(stateInNewStep);
    }
  }

  scheduleNextStepConsumation(wait) {
    this.nextStepTimeoutToken = setTimeout(
      this.increaseCurrentStep,
      wait || DEFAULT_WAIT,
    );
  }

  handleTogglePlay(isPlaying) {
    if (isPlaying) {
      this.setState({ autoPlay: true }, () => this.increaseCurrentStep());
    } else {
      this.cancelNextStepConsumation();
      this.setState({ autoPlay: false });
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

  render() {
    const { children, code, explanation } = this.props;
    const { codeLine, explanationStep, autoPlay } = this.state;

    const visualizationScreen = (
      <div className='fx-3 visual-container shadow'>
        {/* <Select
          options={apiList}
          className='api-select'
          classNamePrefix='api-select'
          placeholder='Chọn API'
        /> */}
        <ProgressControl
          onForward={this.increaseCurrentStep}
          onBackward={this.decreaseCurrentStep}
          onPlay={() => this.handleTogglePlay(true)}
          onStop={() => this.handleTogglePlay(false)}
          isPlaying={autoPlay}
        />
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
