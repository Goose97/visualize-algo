import React, { Component } from 'react';
import { classNameHelper } from 'utils';

import './style.scss';

export class Button extends Component {
  produceClassName() {
    const { type, disabled } = this.props;
    return classNameHelper({
      base: 'visual-algo-button__wrapper',
      [type]: !!type,
      disabled: !!disabled,
    });
  }

  handleClick = () => {
    const { onClick, disabled } = this.props;
    onClick && !disabled && onClick();
  };

  render() {
    const { children } = this.props;
    return (
      <button
        {...this.props}
        className={this.produceClassName()}
        onClick={this.handleClick}
      >
        {children}
      </button>
    );
  }
}

export default Button;
