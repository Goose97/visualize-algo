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
    const { visible, visited, focus, className, isNew, blur } = this.props;
    const { isHiding, isShowing } = this.state;
    return classNameHelper({
      base: className as string,
      disappearing: !!isHiding,
      appearing: !!(isShowing || isNew),
      invisible: !visible,
      visited: !!visited,
      focus: !!focus,
      blur: !!blur,
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

  renderLabelText() {
    const { label } = this.props;

    return (
      label &&
      label.length && (
        <g>
          {this.renderBackgroundOverlayForText()}
          <text
            {...this.getLabelTextCoordinate()}
            dominantBaseline='middle'
            textAnchor='middle'
            className='memory-block__text italic'
            ref={this.labelText}
          >
            {label.join(' / ')}
          </text>
        </g>
      )
    );
  }

  renderBackgroundOverlayForText() {
    const textElement = this.labelText.current;
    if (!textElement) return null;

    const {
      width: textWidth,
      height: textHeight,
    } = textElement.getBoundingClientRect();
    return (
      <rect
        {...this.getLabelTextCoordinate()}
        transform={`translate(-${textWidth / 2}, -${textHeight / 2})`}
        width={textWidth}
        height={textHeight}
        className='fill-background'
      ></rect>
    );
  }

  getLabelTextCoordinate() {
    const { labelDirection, width, height, x, y } = this.props;
    const direction = labelDirection || 'top';
    switch (direction) {
      case 'top':
        return {
          x: x + width / 2,
          y: y - 20,
        };

      case 'bottom':
        return {
          x: x + width / 2,
          y: y + height + 20,
        };

      case 'left':
        return {
          x: x - 30,
          y: y + height / 2,
        };

      case 'right':
        return {
          x: x + 20,
          y: y + height / 2,
        };
    }
  }

  render() {
    const {
      value,
      width,
      height,
      children,
      textOffset,
      circleAround,
      transform,
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

    // const highlightCircle = highlight && (
    //   <HighlightCircle
    //     x={x + width / 2}
    //     y={y + height / 2}
    //     radius={width / 2 + 15}
    //   />
    // );

    return (
      <g className={this.produceClassName()} transform={transform}>
        {this.renderMemoryBlockContainer()}
        {valueText}
        {this.renderLabelText()}
        {children}
        {/* {highlightCircle} */}
      </g>
    );
  }
}

export default withExtendClassName('memory-block__wrapper has-transition')(
  MemoryBlock,
);
