import React from 'react';
import { pick } from 'lodash';

import { HTMLRenderer } from 'components';
import { LinkedListModel } from '../index.d';

import LinkedListNodeApiDropdown from './LinkedListNodeApiDropdown';
import LinkedListApiDropdown from './LinkedListApiDropdown';
import { ObjectType, PointCoordinate } from 'types';

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
    wrapperElement && LinkedListHTML.renderApiDropDown(wrapperElement, params);
    LinkedListHTML.renderActionDropdownForEachNode(params);
  }

  static renderApiDropDown = (() => {
    let originalCoordinate: PointCoordinate | undefined;

    // Here is the real function
    return (wrapperElement: SVGGElement, params: LinkedListHTMLParams) => {
      let dropdownCoordinate;
      const dropdownToSelectApi = (
        <LinkedListApiDropdown
          {...pick(params, ['onSearch', 'onInsert', 'onDelete'])}
        />
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
        <LinkedListNodeApiDropdown
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
