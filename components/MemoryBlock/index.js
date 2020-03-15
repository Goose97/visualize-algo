import React, { Component } from 'react';

import './style.scss';

export class MemoryBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transformList: [],
    };
    this.original = {
      x: props.x,
      y: props.y,
    };
  }

  componentDidUpdate(prevProps) {
    ['x', 'y', 'visible'].forEach(attribute =>
      this.checkDiffAndReact(
        prevProps[attribute],
        this.props[attribute],
        attribute,
      ),
    );
  }

  checkDiffAndReact(prev, now, attribute) {
    switch (attribute) {
      case 'visible':
        return this.checkVisibleAndReact(prev, now);
      case 'x':
        return this.checkXAxisAndReact(prev, now);
      case 'y':
        return this.checkYAxisAndReact(prev, now);
    }
  }

  checkVisibleAndReact(prev, now) {
    if (prev !== now) {
      now ? this.show() : this.hide();
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

  checkXAxisAndReact(prev, now) {
    if (prev !== now) this.move(now - prev, 'horizontal');
  }

  checkYAxisAndReact(prev, now) {
    if (prev !== now) this.move(now - prev, 'vertical');
  }

  move(amount, direction) {
    const { transformList } = this.state;
    let transformText;
    switch (direction) {
      case 'vertical':
        transformText = `translate(0 ${amount})`;
        break;

      case 'horizontal':
        transformText = `translate(${amount} 0)`;
        break;
    }
    this.setState({ transformList: [...transformList, transformText] });
  }

  produceTransformString() {
    const { transformList } = this.state;
    return transformList.join(' ');
  }

  resetTransform() {
    this.setState({ transformList: [] });
  }

  produceClassName() {
    const { visible, visited } = this.props;
    const { isHiding, isShowing } = this.state;
    let baseClassName = 'memory-block__wrapper has-transition';
    if (isHiding) baseClassName += ' disappearing';
    if (isShowing) baseClassName += ' appearing';
    if (!visible) baseClassName += ' invisible';
    if (visited) baseClassName += ' visited';
    return baseClassName;
  }

  render() {
    const { value } = this.props;

    return (
      <g
        transform={this.produceTransformString()}
        className={this.produceClassName()}
      >
        <rect
          x={this.original.x}
          y={this.original.y}
          width={MEM_BLOCK_WIDTH}
          height={MEM_BLOCK_HEIGHT}
          className='memory-block__block'
        ></rect>
        <text
          x={this.original.x + MEM_BLOCK_WIDTH / 2}
          y={this.original.y + MEM_BLOCK_HEIGHT / 2}
          dominantBaseline='middle'
          textAnchor='middle'
          className='memory-block__text'
        >
          {value}
        </text>
      </g>
    );
  }
}

export default MemoryBlock;
