import React from 'react';

import { HTMLRenderer, DropdownWithParamsInput } from 'components';
// import BSTNodeApiDropdown from './BSTNodeApiDropdown';
import { HTMLRendererParams } from 'types';
import { Array } from 'types/ds/Array';

const options: Array<{ label: string; value: string }> = [
  {
    label: 'Bubble sort',
    value: 'bubbleSort',
  },
  {
    label: 'Selection sort',
    value: 'selectionSort',
  },
  {
    label: 'Insertion sort',
    value: 'insertionSort',
  },
];

export class ArrayHTML {
  static renderToView(params: HTMLRendererParams<Array.Model>) {
    const { wrapperElement, coordinate, apiHandler, disabled } = params;
    if (wrapperElement) {
      const { width, height } = wrapperElement.getBoundingClientRect();

      const elementToRender = (
        <div style={{ width, height }} className='array-html__wrapper'>
          <DropdownWithParamsInput
            options={options}
            handler={apiHandler}
            disabled={disabled}
          />
        </div>
      );
      HTMLRenderer.inject(elementToRender, coordinate, `array-html__wrapper`);
    }
  }
}

export default ArrayHTML;
