import React from 'react';
import { pick } from 'lodash';

import { HTMLRenderer } from 'components';
import BSTNodeApiDropdown from './BSTNodeApiDropdown';
import { BSTModel } from '../index.d';
import { ObjectType } from 'types';

interface BinarySearchTreeHTMLParams {
  wrapperElement: SVGGElement | null;
  model: BSTModel;
  onSearch: (params: ObjectType<any>) => void;
  onDelete: (params: ObjectType<any>) => void;
}

export class BinarySearchTreeHTML {
  static renderToView(params: BinarySearchTreeHTMLParams) {
    BinarySearchTreeHTML.renderActionDropdownForEachNode(params);
  }

  static renderActionDropdownForEachNode(params: BinarySearchTreeHTMLParams) {
    const { model } = params;
    model.forEach(({ x, y, key }) => {
      const elementToRender = (
        <BSTNodeApiDropdown
          {...pick(params, ['onSearch', 'onDelete'])}
          nodeKey={key}
        />
      );
      const coordinate = { x, y };

      HTMLRenderer.inject(
        elementToRender,
        coordinate,
        `bst-node-dropdown__${key}`,
      );
    });
  }
}

export default BinarySearchTreeHTML;
