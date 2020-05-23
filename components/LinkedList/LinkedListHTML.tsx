import React, { Component } from 'react';
import { Menu, Popover } from 'antd';
import { pick } from 'lodash';

import {
  CustomDropDown,
  HTMLRenderer,
  ParameterInputPopover,
} from 'components';
import { LinkedListModel } from './index.d';
import { LinkedListOperation } from '../../instructions/LinkedList/index.d';
import {
  LINKED_LIST_BLOCK_WIDTH,
  LINKED_LIST_BLOCK_HEIGHT,
} from '../../constants';
import { classNameHelper, upcaseFirstLetter } from 'utils';
import { ObjectType, PointCoordinate } from 'types';

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

const individualNodeOptions: Array<{
  label: string;
  value: LinkedListOperation;
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

interface LinkedListNodeDropDownProps
  extends Pick<LinkedListHTMLParams, 'onSearch' | 'onInsert' | 'onDelete'> {
  nodeKey: number;
}

interface LinkedListNodeDropDownState {
  isMenuVisible: boolean;
}

class LinkedListNodeDropDown extends Component<
  LinkedListNodeDropDownProps,
  LinkedListNodeDropDownState
> {
  constructor(props: LinkedListNodeDropDownProps) {
    super(props);

    this.state = {
      isMenuVisible: false,
    };
  }

  handleSelectApi(api: LinkedListOperation, params: Object) {
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
        {individualNodeOptions.map(({ label, value: apiName }) => {
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
                    content={<a>Close</a>}
                    trigger='click'
                    placement='right'
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

interface LinkedListHTMLParams {
  wrapperElement: SVGGElement | null;
  model: LinkedListModel;
  onSearch: (params: ObjectType<any>) => void;
  onInsert: (params: ObjectType<any>) => void;
  onDelete: (params: ObjectType<any>) => void;
}

export class LinkedListHTML {
  static renderToView(params: LinkedListHTMLParams) {
    const { wrapperElement } = params;
    // wrapperElement && LinkedListHTML.renderApiDropDown(wrapperElement);
    LinkedListHTML.renderActionDropdownForEachNode(params);
  }

  static renderApiDropDown = (() => {
    let originalCoordinate: PointCoordinate | undefined;
    return (wrapperElement: SVGGElement) => {
      let dropdownCoordinate;
      const dropdownToSelectApi = (
        <CustomDropDown options={options} onSelect={e => console.log('e', e)} />
      );
      const htmlOverlayPosition = HTMLRenderer.getHTMLOverlayPosition();

      if (!htmlOverlayPosition) return;
      if (originalCoordinate) {
        const { width } = wrapperElement.getBoundingClientRect();
        dropdownCoordinate = {
          x: originalCoordinate.x + width + 50,
          y: originalCoordinate.y - htmlOverlayPosition.y - 20,
        };
      } else {
        const { x, y, width } = wrapperElement.getBoundingClientRect();
        originalCoordinate = { x, y };
        dropdownCoordinate = {
          x: x + width + 50,
          y: y - htmlOverlayPosition.y - 20,
        };
      }

      HTMLRenderer.inject(
        dropdownToSelectApi,
        dropdownCoordinate,
        'linked-list-dropdown',
      );
    };
  })();

  static renderActionDropdownForEachNode(params: LinkedListHTMLParams) {
    const { model } = params;
    model.forEach(({ x, y, key }) => {
      const elementToRender = (
        <LinkedListNodeDropDown
          {...pick(params, ['onSearch', 'onInsert', 'onDelete'])}
          nodeKey={key}
        />
      );
      const coordinate = { x, y };

      HTMLRenderer.inject(
        elementToRender,
        coordinate,
        `linked-list-node-dropdown__${key}`,
      );
    });
  }
}

export default LinkedListHTML;
