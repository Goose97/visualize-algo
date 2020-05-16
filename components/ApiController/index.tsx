import React, { Component } from 'react';
import Select from 'react-select';

import { IProps } from './index.d';
// import './style.scss';

const arrowRightIcon = (
  <i aria-label='icon: right'>
    <svg
      viewBox='64 64 896 896'
      focusable='false'
      data-icon='right'
      width='1em'
      height='1em'
      fill='currentColor'
      aria-hidden='true'
    >
      <path d='M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z'></path>
    </svg>
  </i>
);

export class ApiController extends Component<IProps> {
  render() {
    const { apiList, parameterInput, onApiChange, actionButton } = this.props;
    const parameter = parameterInput ? (
      <>
        {arrowRightIcon}
        {parameterInput}
      </>
    ) : null;

    const button = actionButton ? (
      <>
        {arrowRightIcon}
        {actionButton}
      </>
    ) : null;

    return (
      <div className='api-control__wrapper fx-center fx-gap-5'>
        <Select
          options={apiList}
          className='api-select'
          classNamePrefix='api-select'
          placeholder='Chọn API'
          onChange={option => {
            if (option && 'value' in option) onApiChange(option.value);
          }}
        />
        {parameter}
        {button}
      </div>
    );
  }
}

export default ApiController;
