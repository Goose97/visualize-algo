import React, { Component } from 'react';

import { AutoTransformGroup, Line } from 'components';
import { SortSeperationLineProps } from './index.d';
import { ARRAY_BLOCK_HEIGHT, LINE_HEIGHT } from '../../constants';

export class SortSeperationLine extends Component<SortSeperationLineProps> {
  getRenderSequence = () => {
    const { currentApi } = this.props;
    switch (currentApi!) {
      case 'bubbleSort':
        return ['unsorted', 'line', 'sorted'];
      case 'insertionSort':
        return ['sorted', 'line', 'unsorted'];
      case 'selectionSort':
        return ['sorted', 'line', 'unsorted'];
    }
  };

  getXCoordinationBySequenceIndex = (index: number, text: string) => {
    const { initialX } = this.props;
    switch (index) {
      case 0: {
        const offset = text.length * 10;
        return initialX! - offset;
      }

      case 1:
        return initialX;
      case 2:
        return initialX! + 10;
    }
  };

  render() {
    const { currentX, initialX } = this.props;
    if (initialX == null) return null;

    const y1 = ARRAY_BLOCK_HEIGHT + LINE_HEIGHT;
    const y2 = -LINE_HEIGHT;

    return (
      <AutoTransformGroup origin={{ x: currentX!, y: 0 }}>
        {this.getRenderSequence()!.map((item, index) => {
          const x = this.getXCoordinationBySequenceIndex(index, item)!;
          if (item === 'sorted')
            return (
              <text x={x} y={y2} key={item}>
                Sorted
              </text>
            );

          if (item === 'unsorted')
            return (
              <text x={x} y={y2} key={item}>
                Unsorted
              </text>
            );

          if (item === 'line')
            return <Line x1={x} x2={x} y1={y1} y2={y2} key={item} />;
        })}
      </AutoTransformGroup>
    );
  }
}

export default SortSeperationLine;
