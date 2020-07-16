import React from 'react';

import { HTMLRenderer, DropdownWithParamsInput } from 'components';
import LinkedListNodeApiDropdown from './LinkedListNodeApiDropdown';
import { getCanvasScaleFactor } from 'utils';
import { HTMLRendererParams } from 'types';
import { LinkedList } from 'types/ds/LinkedList';

const options: Array<{ label: string; value: string }> = [
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

const requiredParams = {
  search: {
    value: 'number',
  },
  delete: {
    index: 'number',
  },
  insert: {
    value: 'number',
    index: 'number',
  },
};

export class LinkedListHTML {
  static renderToView(params: HTMLRendererParams<LinkedList.Model>) {
    const { wrapperElement, coordinate, model, apiHandler, disabled } = params;
    if (wrapperElement) {
      const { width, height } = wrapperElement.getBoundingClientRect();
      const scaledFactor = getCanvasScaleFactor();
      const dropdownForEachTreeNode = model.map(({ x, y, key }) => (
        <LinkedListNodeApiDropdown
          nodeKey={key}
          handler={apiHandler}
          coordinate={{ x, y }}
          key={key}
          scale={scaledFactor}
        />
      ));

      const elementToRender = (
        <div style={{ width, height }} className='linked-list-html__wrapper'>
          <DropdownWithParamsInput
            options={options}
            requiredApiParams={requiredParams}
            handler={apiHandler}
            disabled={disabled}
          />
          {dropdownForEachTreeNode}
        </div>
      );

      const scaledCoordinate = {
        x: coordinate.x * scaledFactor,
        y: coordinate.y * scaledFactor,
      };
      HTMLRenderer.inject(
        elementToRender,
        scaledCoordinate,
        `linked-list-html__wrapper`,
      );
    }
  }
}

export default LinkedListHTML;
