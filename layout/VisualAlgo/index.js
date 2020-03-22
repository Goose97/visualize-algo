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

    return (
      <div className='fx-row vh-100'>
        <div className='fx-col fx-1'>
          {/* <Select
            options={apiList}
            className='api-select'
            classNamePrefix='api-select'
            placeholder='Chọn API'
          /> */}
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
        <div className='fx-1 visual-container shadow'>{children}</div>
      </div>
    );
  }
}

export default VisualAlgo;
