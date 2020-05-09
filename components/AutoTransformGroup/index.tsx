import React, { Component } from 'react';

import { IProps, IState, TransformationChange } from './index.d';

// Component này xử lý logic transform cho các phần tử svg
// Bắt buộc phải chỉ định một điểm làm origin cho component này
// origin: { x, y }
// Khi vị trí của origin thay đổi, component cần tính toán để áp dụng
// transform thích hợp
// Lí do phải sử dụng component này là để thực hiện animation

export class AutoTransformGroup extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      transformSequence: [],
    };
  }

  componentDidUpdate(prevProps: IProps) {
    const {
      origin: { x: newX, y: newY },
    } = this.props;
    const {
      origin: { x: oldX, y: oldY },
    } = prevProps;
    let changes: TransformationChange[] = [];
    if (oldX !== newX)
      changes.push({ amount: newX - oldX, direction: 'horizontal' });
    if (oldY !== newY)
      changes.push({ amount: newY - oldY, direction: 'vertical' });

    if (changes.length) this.applyChanges(changes);
  }

  applyChanges(changes: TransformationChange[]) {
    const { transformSequence } = this.state;
    let additionTransfromSequence = changes.map(({ direction, amount }) => {
      switch (direction) {
        case 'vertical':
          return `translate(0 ${amount})`;
        case 'horizontal':
          return `translate(${amount} 0)`;
      }
    });

    this.setState({
      transformSequence: transformSequence.concat(additionTransfromSequence),
    });
  }

  produceTransformString() {
    const { transformSequence } = this.state;
    return transformSequence.join(' ');
  }

  render() {
    const { children } = this.props;
    return (
      <g transform={this.produceTransformString()} className='has-transition'>
        {children}
      </g>
    );
  }
}

export default AutoTransformGroup;
