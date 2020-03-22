import React, { Component } from 'react';
import Select from 'react-select';

import { CodeBlock, ExplanationBlock } from '../../components';
import './style.scss';

export class VisualAlgo extends Component {
  render() {
    const {
      children,
      code,
      highlightLine,
      apiList,
      explanation,
      explanationStep,
    } = this.props;

    const visualizationScreen = (
      <div className='fx-3 visual-container shadow'>
        {/* <Select
          options={apiList}
          className='api-select'
          classNamePrefix='api-select'
          placeholder='Chọn API'
        /> */}
        {children}
      </div>
    );

    const codeAndExplanation = (
      <div className='fx-row fx-2'>
        <div className='fx-3 code-container'>
          <CodeBlock code={code} highlightLine={highlightLine} />
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
