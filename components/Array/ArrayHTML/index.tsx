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
    const { wrapperElement, coordinate, apiHandler, model } = params;
    if (wrapperElement) {
      const { width, height } = wrapperElement.getBoundingClientRect();
      // const dropdownForEachTreeNode = model.map(({ value, x, y, key }) => (
      //   <BSTNodeApiDropdown
      //     value={value}
      //     handler={apiHandler}
      //     coordinate={{ x, y }}
      //     key={key}
      //   />
      // ));

      const elementToRender = (
        <div style={{ width, height }} className='array-html__wrapper'>
          <DropdownWithParamsInput options={options} handler={apiHandler} />
          {/* {dropdownForEachTreeNode} */}
        </div>
      );
      HTMLRenderer.inject(elementToRender, coordinate, `array-html__wrapper`);
    }
  }
}

export default ArrayHTML;
