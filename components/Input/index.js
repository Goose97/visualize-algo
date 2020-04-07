import React, { Component } from 'react';

import { withExtendClassName } from 'hocs';
import './style.scss';

export class Input extends Component {
  handleInputValueChange = e => {
    const { onChange } = this.props;
    const newValue = e.target.value;
    onChange && onChange(newValue);
  };

  render() {
    const { className } = this.props;
    return (
      <input
        {...this.props}
        className={className}
        onChange={this.handleInputValueChange}
      />
    );
  }
}

export default withExtendClassName('visual-algo-input__wrapper')(Input);
