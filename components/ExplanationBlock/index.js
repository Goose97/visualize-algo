import React, { Component } from 'react';

import { classNameHelper } from 'utils';
import './style.scss';

export class ExplanationBlock extends Component {
  produceClassNameForStep(stepIndex) {
    const { currentStep } = this.props;
    return classNameHelper({
      base: 'explanation-block__step',
      focus: currentStep === stepIndex,
    });
  }

  render() {
    const { explanation } = this.props;
    return (
      <div className='explanation-block__wrapper'>
        <ul className='explanation-block__list-step'>
          {(explanation || []).map((item, index) => (
            <li className={this.produceClassNameForStep(index + 1)} key={index}>
              {index + 1}. {item}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default ExplanationBlock;
