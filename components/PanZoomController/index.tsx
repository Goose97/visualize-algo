import React, { Component } from 'react';
import { Popover } from 'antd';
import { QuestionOutlined } from '@ant-design/icons';

import { IProps } from './index.d';
import { PointCoordinate } from 'types';
export class PanZoomController extends Component<IProps> {
  private wrapperRef: React.RefObject<HTMLDivElement>;
  private panningTaskQueue: PointCoordinate[];
  private isPanningTaskQueueRunning: boolean;

  constructor(props: any) {
    super(props);
    this.wrapperRef = React.createRef();
    this.panningTaskQueue = [];
    this.isPanningTaskQueueRunning = false;
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
    this.enqueuePanningTaskQueue({
      x: movementX,
      y: movementY,
    });
  };

  enqueuePanningTaskQueue(task: PointCoordinate) {
    this.panningTaskQueue.push(task);
    if (!this.isPanningTaskQueueRunning) this.dequeuePanningTaskQueue();
  }

  dequeuePanningTaskQueue() {
    const { onPanning } = this.props;
    const nextTask = this.panningTaskQueue.shift();
    if (!nextTask) {
      this.isPanningTaskQueueRunning = false;
      return;
    }

    window.requestAnimationFrame(() => {
      onPanning(nextTask.x, nextTask.y);
      this.dequeuePanningTaskQueue();
    });
  }

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
