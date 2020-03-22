import React, { Component } from 'react';

import './style.scss';

export class ExplanationBlock extends Component {
  produceClassNameForStep(stepIndex) {
    const { currentStep } = this.props;
    let baseClass = 'explanation-block__step';
    if (currentStep === stepIndex) baseClass += ' focus';
    return baseClass;
  }

  render() {
    const { explanation } = this.props;
    return (
      <div className='explanation-block__wrapper'>
        <ul className='explanation-block__list-step'>
          {explanation.map((item, index) => (
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
