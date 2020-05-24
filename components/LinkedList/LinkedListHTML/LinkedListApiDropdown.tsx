import React, { Component } from 'react';
import { Menu } from 'antd';

import { CustomDropDown, ParameterInputPopover } from 'components';
import {
  LinkedListApiDropdownProps,
  LinkedListApiDropdownState,
} from './index.d';
import { LinkedListOperation } from '../../../instructions/LinkedList/index.d';
import { classNameHelper, upcaseFirstLetter } from 'utils';
import { ObjectType } from 'types';

const options: Array<{ label: string; value: LinkedListOperation }> = [
  {
    label: 'Search',
    value: 'search',
  },
  {
    label: 'Insert',
    value: 'insert',
  },
  {
    label: 'Delete',
    value: 'delete',
  },
];

export class LinkedListApiDropdown extends Component<
  LinkedListApiDropdownProps,
  LinkedListApiDropdownState
> {
  constructor(props: LinkedListApiDropdownProps) {
    super(props);

    this.state = {
      isMenuVisible: false,
    };
  }

  handleSelectApi(api: LinkedListOperation, params: Object) {
    const paramsAfterTypeConversion = this.convertTypeForParameters(
      params,
      api,
    );
    const method = `on${upcaseFirstLetter(api)}`;
    //@ts-ignore
    const handler = this.props[method];
    handler && handler(paramsAfterTypeConversion);
    this.setState({ isMenuVisible: false });
  }

  convertTypeForParameters(
    params: ObjectType<any>,
    apiName: LinkedListOperation,
  ) {
    const paramsType = this.getApiRequiredParams(apiName);
    let newParams: ObjectType<number | string> = {};
    Object.entries(params).forEach(([name, value]) => {
      const requiredType = paramsType[name];
      let valueAfterTypeConversion;
      switch (requiredType) {
        case 'number':
          valueAfterTypeConversion = parseInt(value);
          break;
        case 'string':
          valueAfterTypeConversion = value.toString();
          break;
        default:
          valueAfterTypeConversion = value;
      }

      newParams[name] = valueAfterTypeConversion;
    });

    return newParams;
  }

  renderMenu() {
    return (
      <Menu>
        {options.map(({ label, value: apiName }) => (
          <Menu.Item key={apiName}>
            <ParameterInputPopover
              getPopupContainer={triggerNode =>
                triggerNode.parentNode as HTMLElement
              }
              parameters={this.getApiRequiredParams(apiName)}
              onSubmit={params => {
                this.handleSelectApi(apiName, params);
                this.setState({ isMenuVisible: false });
              }}
            >
              <div>{label}</div>
            </ParameterInputPopover>
          </Menu.Item>
        ))}
      </Menu>
    );
  }

  getApiRequiredParams(
    apiName: LinkedListOperation,
  ): ObjectType<'number' | 'string'> {
    switch (apiName) {
      case 'search':
        return {
          value: 'number',
        };

      case 'delete':
        return {
          index: 'number',
        };

      case 'insert':
        return {
          index: 'number',
          value: 'number',
        };

      default:
        return {};
    }
  }

  produceClassName() {
    const { isMenuVisible } = this.state;
    return classNameHelper({
      base: 'linked-list-html__node-dropdown',
      ['menu-visible']: !!isMenuVisible,
    });
  }

  render() {
    const { isMenuVisible } = this.state;
    return (
      <CustomDropDown
        overlay={this.renderMenu()}
        options={options}
        onVisibleChange={visible => this.setState({ isMenuVisible: visible })}
        visible={isMenuVisible}
      />
    );
  }
}

export default LinkedListApiDropdown;
