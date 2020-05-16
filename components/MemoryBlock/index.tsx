import React, { Component } from 'react';

import { classNameHelper } from 'utils';
import { IProps, IState } from './index.d';

export class MemoryBlock extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
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
    const {
      value,
      label,
      width,
      height,
      children,
      textOffset,
      x,
      y,
    } = this.props;

    const xOffsetText = textOffset ? textOffset.x : 0;
    const valueText = (
      <text
        x={x + (width - xOffsetText) / 2}
        y={y + height / 2}
        dominantBaseline='middle'
        textAnchor='middle'
        className='memory-block__text'
      >
        {value}
      </text>
    );

    const labelText = label && (
      <text
        x={x + width / 2}
        y={y - height / 2}
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
          x={x}
          y={y}
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
