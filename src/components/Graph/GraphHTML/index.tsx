import React from 'react';

import { HTMLRenderer, DropdownWithParamsInput } from 'components';
// import BSTNodeApiDropdown from './BSTNodeApiDropdown';
import { getCanvasScaleFactor } from 'utils';
import { HTMLRendererParams } from 'types';
import { Graph } from 'types/ds/Graph';

const options: Array<{ label: string; value: string }> = [
  {
    label: 'Depth-first search',
    value: 'dfs',
  },
  {
    label: 'Breadth-first search',
    value: 'bfs',
  },
];

const requiredParams = {
  dfs: {
    startAt: 'number',
  },
  bfs: {
    startAt: 'number',
  },
};

export class GraphHTML {
  static renderToView(params: HTMLRendererParams<Graph.Model>) {
    const { wrapperElement, coordinate, apiHandler, disabled } = params;
    if (wrapperElement) {
      const { width, height } = wrapperElement.getBoundingClientRect();
      const scaledFactor = getCanvasScaleFactor();
      // const dropdownForEachTreeNode = model.map(({ value, x, y, key }) => (
      //   <BSTNodeApiDropdown
      //     value={value}
      //     handler={apiHandler}
      //     coordinate={{ x, y }}
      //     key={key}
      //   />
      // ));

      const elementToRender = (
        <div style={{ width, height }} className='graph-html__wrapper'>
          <DropdownWithParamsInput
            options={options}
            requiredApiParams={requiredParams}
            handler={apiHandler}
            disabled={disabled}
          />
          {/* {dropdownForEachTreeNode} */}
        </div>
      );

      const scaledCoordinate = {
        x: coordinate.x * scaledFactor,
        y: coordinate.y * scaledFactor,
      };
      HTMLRenderer.inject(
        elementToRender,
        scaledCoordinate,
        `graph-html__wrapper`,
      );
    }
  }
}

export default GraphHTML;
