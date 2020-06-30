import React, { Component } from 'react';
import { Menu } from 'antd';

import { CustomDropDown } from 'components';
import { GRAPH_NODE_RADIUS } from '../../../constants';
import { classNameHelper } from 'utils';
import { BSTNodeApiDropdownProps, BSTNodeApiDropdownState } from './index.d';
import { BST } from 'types/ds/BST';

const options: Array<{
  label: string;
  value: BST.Api;
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

  handleSelectApi(api: BST.Api, params: any) {
    const { handler } = this.props;
    if (handler) {
      handler(api, params);
    }

    this.setState({ isMenuVisible: false });
  }

  renderMenu() {
    const { value } = this.props;
    return (
      <Menu>
        {options.map(({ label, value: apiName }) => (
          <Menu.Item
            onClick={() => this.handleSelectApi(apiName, { value })}
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

  getWidthHeightAndCoordinate() {
    const { coordinate, scale } = this.props;
    try {
      const treeNode = document.querySelector(
        '#binary-search-tree .memory-block__wrapper',
      );
      //@ts-ignore
      const { width, height } = treeNode?.getBoundingClientRect();
      return {
        //@ts-ignore
        width: width + 30,
        //@ts-ignore
        height: height + 30,
        //@ts-ignore
        top: coordinate.y * scale,
        //@ts-ignore
        left: coordinate.x * scale,
      };
    } catch (e) {
      console.log(e);
      return {
        width: 2 * GRAPH_NODE_RADIUS + 30,
        height: 2 * GRAPH_NODE_RADIUS + 20,
        top: coordinate.y,
        left: coordinate.x,
      };
    }
  }

  render() {
    const { isMenuVisible } = this.state;
    const style: React.CSSProperties = {
      position: 'absolute',
      ...this.getWidthHeightAndCoordinate(),
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
