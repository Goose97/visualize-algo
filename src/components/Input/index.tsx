import React, { Component } from 'react';
import { omit } from 'lodash';
import { CheckOutlined } from '@ant-design/icons';

import { withExtendClassName } from 'hocs';
import { classNameHelper } from 'utils';
import { IProps } from './index.d';

export class Input extends Component<IProps> {
  handleInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props;
    const newValue = e.target.value;
    onChange && onChange(newValue);
  };

  produceClassName() {
    const { className, status } = this.props;
    let classNameObject = { base: className! };
    //@ts-ignore
    if (status) classNameObject[status] = status;
    return classNameHelper(classNameObject);
  }

  renderIconAccordingToStatus() {
    const { status } = this.props;
    switch (status) {
      case 'success':
        return (
          <span className='visual-algo-input__status-icon success'>
            <CheckOutlined />
          </span>
        );
      case 'error':
        return (
          <span className='visual-algo-input__status-icon error'>&#x2716;</span>
        );
      default:
        return null;
    }
  }

  render() {
    return (
      <div className='visual-algo-input__wrapper'>
        <input
          {...omit(this.props, ['state', 'className'])}
          onChange={this.handleInputValueChange}
          className={this.produceClassName()}
        />
        {this.renderIconAccordingToStatus()}
      </div>
    );
  }
}

export default withExtendClassName('visual-algo-input__input')(Input);
