import React from 'react';

import { HTMLRenderer, DropdownWithParamsInput } from 'components';
import { HTMLRendererParams } from 'types';
import { HashTable } from 'types/ds/HashTable';

const options: Array<{ label: string; value: string }> = [
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
  insert: {
    key: 'string',
    value: 'number',
  },
  delete: {
    key: 'string',
  },
};

export class HashTableHTML {
  static renderToView(params: HTMLRendererParams<HashTable.Model>) {
    const { wrapperElement, coordinate, apiHandler, disabled } = params;
    if (wrapperElement) {
      const memoryBlocks = wrapperElement.querySelector(
        '.hash-table__memory-blocks',
      );
      if (!memoryBlocks) return;

      const {
        height,
        left: wrapperLeft,
      } = wrapperElement.getBoundingClientRect();
      const { left } = memoryBlocks.getBoundingClientRect();
      const width = left + 100 - wrapperLeft;

      const elementToRender = (
        <div style={{ width, height }} className='hash-table-html__wrapper'>
          <DropdownWithParamsInput
            options={options}
            requiredApiParams={requiredParams}
            handler={apiHandler}
            disabled={disabled}
          />
        </div>
      );
      HTMLRenderer.inject(
        elementToRender,
        coordinate,
        `hash-table-html__wrapper`,
      );
    }
  }
}

export default HashTableHTML;
