import React, { Component } from 'react';
import { Popover } from 'antd';
import { QuestionOutlined } from '@ant-design/icons';

import { IProps } from './index.d';
import { AnimationTaskQueue } from 'utils';
import { PointCoordinate } from 'types';
export class PanZoomController extends Component<IProps> {
  private wrapperRef: React.RefObject<HTMLDivElement>;
  private animationQueue: AnimationTaskQueue<PointCoordinate>;

  constructor(props: any) {
    super(props);
    this.wrapperRef = React.createRef();
    this.animationQueue = new AnimationTaskQueue({
      callback: this.handleAnimationQueueTask,
      isAdditiveTask: true,
      combineTaskCallback: (tasks: PointCoordinate[]) =>
        tasks.reduce(
          ({ x, y }, acc) => ({
            x: acc.x + x,
            y: acc.y + y,
          }),
          { x: 0, y: 0 },
        ),
      taskQueueMax: 5,
    });
  }

  componentDidMount() {
    this.addPanListener();
  }

  addPanListener() {
    try {
      const canvasElement = this.wrapperRef.current?.parentNode;

      canvasElement?.addEventListener('mousedown', () =>
        canvasElement?.addEventListener('mousemove', this.trackingMouseMove),
      );

      canvasElement?.addEventListener('mouseup', () =>
        canvasElement?.removeEventListener('mousemove', this.trackingMouseMove),
      );
    } catch (e) {
      console.log('e', e);
    }
  }

  trackingMouseMove: EventListener = e => {
    const { movementX, movementY } = e as MouseEvent;
    e.stopPropagation();
    e.preventDefault();
    this.animationQueue.enqueue({
      x: movementX,
      y: movementY,
    });
  };

  handleAnimationQueueTask = ({ x, y }: any) => {
    const { onPanning } = this.props;
    onPanning(x, y);
  };

  renderHelperPopover() {
    const content = <div>Drag the screen to move data structure</div>;
    return (
      <Popover content={content} placement='right'>
        <div className='mb-4 fx-center f-big-1 shadow-1'>
          <QuestionOutlined />
        </div>
      </Popover>
    );
  }

  render() {
    const { onZoomIn, onZoomOut } = this.props;

    return (
      <div className='zoom-controller__wrapper' ref={this.wrapperRef}>
        {this.renderHelperPopover()}
        <div
          className='mb-4 fx-center f-big-1 shadow-1 clickable'
          onClick={onZoomIn}
        >
          +
        </div>
        <div
          className='mb-4 fx-center f-big-1 shadow-1 clickable'
          onClick={onZoomOut}
        >
          -
        </div>
      </div>
    );
  }
}

export default PanZoomController;
