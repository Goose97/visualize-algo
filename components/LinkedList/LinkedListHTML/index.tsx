import React from 'react';

import { HTMLRenderer, DropdownWithParamsInput } from 'components';
import LinkedListNodeApiDropdown from './LinkedListNodeApiDropdown';
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
      const dropdownForEachTreeNode = model.map(({ x, y, key }) => (
        <LinkedListNodeApiDropdown
          nodeKey={key}
          handler={apiHandler}
          coordinate={{ x, y }}
          key={key}
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

      HTMLRenderer.inject(
        elementToRender,
        coordinate,
        `linked-list-html__wrapper`,
      );
    }
  }
}

export default LinkedListHTML;
