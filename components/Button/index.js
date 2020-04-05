import React, { Component } from 'react';
import { classNameHelper } from 'utils';

import './style.scss';

export class Button extends Component {
  produceClassName() {
    const { type } = this.props;
    return classNameHelper({
      base: 'visual-algo-button__wrapper',
      [type]: !!type,
    });
  }

  render() {
    const { children } = this.props;
    return (
      <button {...this.props} className={this.produceClassName()}>
        {children}
      </button>
    );
  }
}

export default Button;
