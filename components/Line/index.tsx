import React, { Component } from 'react';
import { IProps, IState } from './index.d';

export class Line extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }
  
  render() {
    const { x1, y1, x2, y2 } = this.props;
    return (
      <line className='line--wrapper' x1={x1} y1={y1} x2={x2} y2={y2}></line>
    );
  }
}

export default Line;
