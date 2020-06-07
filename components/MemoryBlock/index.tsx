import React, { Component } from 'react';
import { pick } from 'lodash';

import { HighlightCircle } from 'components';
import { classNameHelper } from 'utils';
import withExtendClassName, {
  WithExtendClassName,
} from 'hocs/withExtendClassName';
import { IProps, IState } from './index.d';

type PropsWithHoc = IProps & WithExtendClassName;

export class MemoryBlock extends Component<PropsWithHoc, IState> {
  private labelText: React.RefObject<SVGTextElement>;
  constructor(props: IProps) {
    super(props);
    this.state = {};

    this.labelText = React.createRef();
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
    const { visible, visited, focus, className } = this.props;
    const { isHiding, isShowing } = this.state;
    return classNameHelper({
      base: className as string,
      disappearing: !!isHiding,
      appearing: !!isShowing,
      invisible: !visible,
      visited: !!visited,
      focus: !!focus,
    });
  }

  renderMemoryBlockContainer() {
    const { type, x, y, width, height } = this.props;
    switch (type) {
      case 'rectangle':
        return (
          <rect
            {...pick(this.props, ['x', 'y', 'width', 'height'])}
            className='memory-block__block'
          ></rect>
        );

      case 'round':
        const cx = x + width / 2;
        const cy = y + height / 2;
        return (
          <circle
            cx={cx}
            cy={cy}
            r={width / 2}
            className='memory-block__block'
          />

          // <rect
          //   {...pick(this.props, ['x', 'y', 'width', 'height'])}
          //   className='memory-block__block'
          // ></rect>
        );
    }
  }

  renderBackgroundOverlayForText() {
    const { x, y, width, height } = this.props;
    const textElement = this.labelText.current;
    if (!textElement) return null;

    const {
      width: textWidth,
      height: textHeight,
    } = textElement.getBoundingClientRect();
    return (
      <rect
        x={x + width / 2}
        y={y - height / 2}
        transform={`translate(-${textWidth / 2}, -${textHeight / 2})`}
        width={textWidth}
        height={textHeight}
        className="fill-background"
      ></rect>
    );
  }

  render() {
    const {
      value,
      label,
      width,
      height,
      children,
      textOffset,
      highlight,
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
        className='memory-block__text value-text'
      >
        {value}
      </text>
    );

    const labelText = label && label.length && (
      <g>
        {this.renderBackgroundOverlayForText()}
        <text
          x={x + width / 2}
          y={y - height / 2}
          dominantBaseline='middle'
          textAnchor='middle'
          className='memory-block__text italic'
          ref={this.labelText}
        >
          {label.join(' / ')}
        </text>
      </g>
    );

    const highlightCircle = highlight && (
      <HighlightCircle
        x={x + width / 2}
        y={y + height / 2}
        radius={width / 2 + 15}
      />
    );

    return (
      <g className={this.produceClassName()}>
        {this.renderMemoryBlockContainer()}
        {valueText}
        {labelText}
        {children}
        {highlightCircle}
      </g>
    );
  }
}

export default withExtendClassName('memory-block__wrapper has-transition')(
  MemoryBlock,
);
