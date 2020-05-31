import React, { Component } from 'react';
import { Menu } from 'antd';

import { CustomDropDown, ParameterInputPopover } from 'components';
import {
  LinkedListNodeApiDropdownProps,
  LinkedListNodeApiDropdownState,
} from './index.d';
import {
  LINKED_LIST_BLOCK_WIDTH,
  LINKED_LIST_BLOCK_HEIGHT,
} from '../../../constants';
import { LinkedList } from 'types/ds/LinkedList';
import { classNameHelper, upcaseFirstLetter } from 'utils';

const options: Array<{
  label: string;
  value: LinkedList.Api;
}> = [
  {
    label: 'Search',
    value: 'search',
  },
  {
    label: 'Insert before',
    value: 'insert',
  },
  {
    label: 'Delete',
    value: 'delete',
  },
];

export class LinkedListNodeApiDropdown extends Component<
  LinkedListNodeApiDropdownProps,
  LinkedListNodeApiDropdownState
> {
  constructor(props: LinkedListNodeApiDropdownProps) {
    super(props);

    this.state = {
      isMenuVisible: false,
    };
  }

  handleSelectApi(api: LinkedList.Api, params: Object) {
    const method = `on${upcaseFirstLetter(api)}`;
    //@ts-ignore
    const handler = this.props[method];
    handler && handler(params);
    this.setState({ isMenuVisible: false });
  }

  produceClassName() {
    const { isMenuVisible } = this.state;
    return classNameHelper({
      base: 'linked-list-html__node-dropdown',
      ['menu-visible']: !!isMenuVisible,
    });
  }

  renderMenu() {
    const { nodeKey } = this.props;

    return (
      <Menu>
        {options.map(({ label, value: apiName }) => {
          switch (apiName) {
            case 'search':
            case 'delete':
              return (
                <Menu.Item
                  onClick={() =>
                    this.handleSelectApi(apiName, { key: nodeKey })
                  }
                  key={apiName}
                >
                  {label}
                </Menu.Item>
              );

            case 'insert':
              return (
                <Menu.Item key={apiName}>
                  <ParameterInputPopover
                    getPopupContainer={triggerNode =>
                      triggerNode.parentNode as HTMLElement
                    }
                    parameters={{
                      value: 'number',
                    }}
                    onSubmit={params => {
                      this.handleSelectApi(apiName, {
                        key: nodeKey,
                        ...params,
                      });
                      this.setState({ isMenuVisible: false });
                    }}
                  >
                    <div>{label}</div>
                  </ParameterInputPopover>
                </Menu.Item>
              );
          }
        })}
      </Menu>
    );
  }

  render() {
    const { isMenuVisible } = this.state;
    const style = {
      width: LINKED_LIST_BLOCK_WIDTH + 40,
      height: LINKED_LIST_BLOCK_HEIGHT + 30,
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

export default LinkedListNodeApiDropdown;