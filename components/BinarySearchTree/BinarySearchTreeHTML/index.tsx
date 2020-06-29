import React from 'react';

import { HTMLRenderer, DropdownWithParamsInput } from 'components';
import BSTNodeApiDropdown from './BSTNodeApiDropdown';
import { HTMLRendererParams } from 'types';
import { BST } from 'types/ds/BST';

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
  {
    label: 'Preorder traversal',
    value: 'preorder',
  },
  {
    label: 'Inorder traversal',
    value: 'inorder',
  },
  {
    label: 'Postorder traversal',
    value: 'postorder',
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

export class BinarySearchTreeHTML {
  static renderToView(params: HTMLRendererParams<BST.Model>) {
    const { wrapperElement, coordinate, apiHandler, model, disabled } = params;
    if (wrapperElement) {
      const { width, height } = wrapperElement.getBoundingClientRect();
      const dropdownForEachTreeNode = model.map(({ value, x, y, key }) => (
        <BSTNodeApiDropdown
          value={value}
          handler={apiHandler}
          coordinate={{ x, y }}
          key={key}
        />
      ));

      const elementToRender = (
        <div style={{ width, height }} className='bst-html__wrapper'>
          <DropdownWithParamsInput
            options={options}
            requiredApiParams={requiredParams}
            handler={apiHandler}
            disabled={disabled}
          />
          {dropdownForEachTreeNode}
        </div>
      );
      HTMLRenderer.inject(elementToRender, coordinate, `bst-html__wrapper`);
    }
  }
}

export default BinarySearchTreeHTML;
