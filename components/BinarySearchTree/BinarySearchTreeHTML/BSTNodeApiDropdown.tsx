import React, { Component } from 'react';
import { Menu } from 'antd';

import { CustomDropDown } from 'components';
import { GRAPH_NODE_RADIUS } from '../../../constants';
import { classNameHelper, upcaseFirstLetter } from 'utils';
import { BSTNodeApiDropdownProps, BSTNodeApiDropdownState } from './index.d';
import { BSTOperation } from 'instructions/BST/index.d';

const options: Array<{
  label: string;
  value: BSTOperation;
}> = [
  {
    label: 'Search',
    value: 'search',
  },
  {
    label: 'Delete',
    value: 'delete',
  },
];

export class BSTNodeApiDropdown extends Component<
  BSTNodeApiDropdownProps,
  BSTNodeApiDropdownState
> {
  constructor(props: BSTNodeApiDropdownProps) {
    super(props);

    this.state = {
      isMenuVisible: false,
    };
  }

  handleSelectApi(api: BSTOperation, params: any) {
    const method = `on${upcaseFirstLetter(api)}`;
    //@ts-ignore
    const handler = this.props[method];
    handler && handler(params);
    this.setState({ isMenuVisible: false });
  }

  renderMenu() {
    const { nodeKey } = this.props;

    return (
      <Menu>
        {options.map(({ label, value: apiName }) => (
          <Menu.Item
            onClick={() => this.handleSelectApi(apiName, { key: nodeKey })}
            key={apiName}
          >
            {label}
          </Menu.Item>
        ))}
      </Menu>
    );
  }

  produceClassName() {
    const { isMenuVisible } = this.state;
    return classNameHelper({
      base: 'bst-html__node-dropdown',
      ['menu-visible']: !!isMenuVisible,
    });
  }

  render() {
    const { isMenuVisible } = this.state;
    const style = {
      width: 2 * GRAPH_NODE_RADIUS + 30,
      height: 2 * GRAPH_NODE_RADIUS + 20,
    };
    return (
      <div style={style} className={this.produceClassName()}>
        <CustomDropDown
          overlay={this.renderMenu()}
          options={options}
          onVisibleChange={visible => this.setState({ isMenuVisible: visible })}
          visible={isMenuVisible}
        />
      </div>
    );
  }
}

export default BSTNodeApiDropdown;
