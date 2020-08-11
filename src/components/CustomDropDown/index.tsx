import React, { Component } from 'react';
import { Dropdown, Menu } from 'antd';
import { isFunction } from 'lodash';

import { IProps } from './index.d';
import { classNameHelper } from 'utils';

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
    return (
      <Menu>
        {options.map(({ label, value }) => (
          <Menu.Item onClick={this.handleSelectMenuOption(value)} key={value}>
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
    const { overlay, disabled } = this.props;
    const className = classNameHelper({
      base: 'dropdown__trigger il-bl',
      disabled: !!disabled,
    });

    return (
      <Dropdown
        {...this.props}
        overlay={overlay || this.renderMenu()}
        overlayClassName='dropdown__overlay'
        trigger={['click']}
      >
        <div className={className}>{ellipsisSvg}</div>
      </Dropdown>
    );
  }
}

export default CustomDropDown;
