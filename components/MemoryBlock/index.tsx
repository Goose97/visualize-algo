import React, { Component } from 'react';

import { classNameHelper } from 'utils';
import { IProps, IState } from './index.d';
import { PointCoordinate } from 'types';

export class MemoryBlock extends Component<IProps, IState> {
  private original: PointCoordinate;
  constructor(props: IProps) {
    super(props);
    this.state = {};
    this.original = {
      x: props.x,
      y: props.y,
    };
  }

  componentDidUpdate(prevProps: IProps) {
    const { visible } = this.props;
    if (visible !== prevProps.visible) {
      visible ? this.show() : this.hide();
    }
  }

  hide() {
    this.setState({ isHiding: true });
    setTimeout(() => {
      this.setState({ isHiding: false });
    }, 500);
  }

  show() {
    this.setState({ isShowing: true });
    setTimeout(() => {
      this.setState({ isShowing: false });
    }, 500);
  }

  produceClassName() {
    const { visible, visited, focus } = this.props;
    const { isHiding, isShowing } = this.state;
    return classNameHelper({
      base: 'memory-block__wrapper has-transition',
      disappearing: !!isHiding,
      appearing: !!isShowing,
      invisible: !visible,
      visited: !!visited,
      focus: !!focus,
    });
  }

  render() {
    const { value, label, width, height, children, textOffset } = this.props;

    const xOffsetText = textOffset ? textOffset.x : 0;
    const valueText = (
      <text
        x={this.original.x + (width - xOffsetText) / 2}
        y={this.original.y + height / 2}
        dominantBaseline='middle'
        textAnchor='middle'
        className='memory-block__text'
      >
        {value}
      </text>
    );

    const labelText = label && (
      <text
        x={this.original.x + width / 2}
        y={this.original.y - height / 2}
        dominantBaseline='middle'
        textAnchor='middle'
        className='memory-block__text italic'
      >
        {label}
      </text>
    );

    return (
      <g className={this.produceClassName()}>
        <rect
          x={this.original.x}
          y={this.original.y}
          width={width}
          height={height}
          className='memory-block__block'
        ></rect>
        {valueText}
        {labelText}
        {children}
      </g>
    );
  }
}

export default MemoryBlock;
