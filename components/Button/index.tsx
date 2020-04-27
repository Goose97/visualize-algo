import React, { Component } from 'react';
import { classNameHelper } from 'utils';

import { IProps } from './index.d';
// import './style.scss';

export class Button extends Component<IProps> {
  produceClassName() {
    const { type, disabled } = this.props;
    return classNameHelper({
      base: 'visual-algo-button__wrapper',
      [type]: !!type,
      disabled: !!disabled,
    });
  }

  handleClick = (e: React.MouseEvent) => {
    const { onClick, disabled } = this.props;
    onClick && !disabled && onClick(e);
  };

  render() {
    const { children, style } = this.props;
    return (
      <button
        style={style}
        className={this.produceClassName()}
        onClick={this.handleClick}
      >
        {children}
      </button>
    );
  }
}

export default Button;
