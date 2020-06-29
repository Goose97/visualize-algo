import React, { Component } from 'react';
import { Menu } from 'antd';

import { CustomDropDown, ParameterInputPopover } from 'components';
import { IProps, IState } from './index.d';
import { classNameHelper } from 'utils';
import { ObjectType } from 'types';

export class DropdownWithParamsInput extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      isMenuVisible: false,
    };
  }

  handleSelectApi(api: string, params?: Object) {
    const { handler } = this.props;
    const paramsAfterTypeConversion =
      params && this.convertTypeForParameters(params, api);
    handler && handler(api, paramsAfterTypeConversion);
    this.setState({ isMenuVisible: false });
  }

  convertTypeForParameters(params: ObjectType<any>, apiName: string) {
    const paramsType = this.getApiRequiredParams(apiName);
    let newParams: ObjectType<number | string> = {};
    Object.entries(params).forEach(([name, value]) => {
      const requiredType = paramsType![name];
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
    const { options } = this.props;
    return (
      <Menu>
        {options.map(({ label, value: apiName }) => {
          const requiredParams = this.getApiRequiredParams(apiName);
          const paramsInputPopover = (
            <ParameterInputPopover
              getPopupContainer={triggerNode =>
                triggerNode.parentNode as HTMLElement
              }
              parameters={requiredParams as ObjectType<'string' | 'number'>}
              onSubmit={params => {
                this.handleSelectApi(apiName, params);
                this.setState({ isMenuVisible: false });
              }}
            >
              <div>{label}</div>
            </ParameterInputPopover>
          );

          return requiredParams ? (
            <Menu.Item key={apiName}>{paramsInputPopover}</Menu.Item>
          ) : (
            <Menu.Item
              key={apiName}
              onClick={() => this.handleSelectApi(apiName)}
            >
              {label}
            </Menu.Item>
          );
        })}
      </Menu>
    );
  }

  getApiRequiredParams(apiName: string) {
    const { requiredApiParams } = this.props;
    return requiredApiParams && requiredApiParams[apiName];
  }

  produceClassName() {
    const { isMenuVisible } = this.state;
    return classNameHelper({
      base: 'dropdown-with-params-input__wrapper',
      ['menu-visible']: !!isMenuVisible,
    });
  }

  render() {
    const { options, disabled } = this.props;
    const { isMenuVisible } = this.state;
    return (
      <CustomDropDown
        overlay={this.renderMenu()}
        options={options}
        onVisibleChange={visible => this.setState({ isMenuVisible: visible })}
        visible={isMenuVisible}
        disabled={disabled}
      />
    );
  }
}

export default DropdownWithParamsInput;
