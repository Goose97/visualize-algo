import React, { Component } from 'react';
import { Dropdown, Menu } from 'antd';
import { isFunction } from 'lodash';

import { IProps } from './index.d';

const ellipsisSvg = (
  <svg x='0px' y='0px' viewBox='0 0 426.667 426.667' width={20}>
    <g>
      <circle cx='42.667' cy='213.333' r='42.667' />
    </g>
    <g>
      <circle cx='213.333' cy='213.333' r='42.667' />
    </g>
    <g>
      <circle cx='384' cy='213.333' r='42.667' />
    </g>
  </svg>
);

export class CustomDropDown extends Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  renderMenu() {
    const { options } = this.props;
    console.log('this.props', this.props);
    console.log('options', options);
    return (
      <Menu>
        {options.map(({ label, value }) => (
          <Menu.Item onClick={this.handleSelectMenuOption(value)}>
            {label}
          </Menu.Item>
        ))}
      </Menu>
    );
  }

  handleSelectMenuOption = (value: number | string) => () => {
    const { onSelect } = this.props;
    isFunction(onSelect) && onSelect(value);
  };

  render() {
    return (
      <Dropdown
        overlay={this.renderMenu()}
        overlayClassName='dropdown__overlay'
      >
        <div className='dropdown__trigger'>{ellipsisSvg}</div>
      </Dropdown>
    );
  }
}

export default CustomDropDown;
