import React from 'react';

import { HTMLRenderer, DropdownWithParamsInput } from 'components';
import BSTNodeApiDropdown from './BSTNodeApiDropdown';
import { BSTModel } from '../index.d';
import { ObjectType, PointCoordinate } from 'types';

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
    value: 'number',
  },
  insert: {
    value: 'number',
  },
};

interface BinarySearchTreeHTMLParams {
  model: BSTModel;
  wrapperElement: SVGGElement | null;
  coordinate: PointCoordinate;
  apiHandler?: (apiName: string, params?: ObjectType<any>) => void;
}

export class BinarySearchTreeHTML {
  static renderToView(params: BinarySearchTreeHTMLParams) {
    const { wrapperElement, coordinate, apiHandler, model } = params;
    if (wrapperElement) {
      const { width, height } = wrapperElement.getBoundingClientRect();
      const dropdownForEachTreeNode = model.map(({ value, x, y }) => (
        <div style={{ position: 'absolute', top: y, left: x }}>
          <BSTNodeApiDropdown value={value} handler={apiHandler} />
        </div>
      ));

      const elementToRender = (
        <div style={{ width, height }} className='bst-html__wrapper'>
          <DropdownWithParamsInput
            options={options}
            requiredApiParams={requiredParams}
            handler={apiHandler}
          />
          {dropdownForEachTreeNode}
        </div>
      );
      HTMLRenderer.inject(elementToRender, coordinate, `bst-html__wrapper`);
    }
  }
}

export default BinarySearchTreeHTML;
