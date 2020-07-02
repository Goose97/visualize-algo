import React, { Component } from 'react';

import { IProps } from './index.d';

export class TopicCard extends Component<IProps> {
  render() {
    const { title, description, onClick } = this.props;
    return (
      <div
        className='topic-card__wrapper b-radius-10 fx-center p-4 has-transition'
        onClick={onClick}
      >
        <div className='topic-card-image__wrapper'>
          <div style={{ height: 200, width: 200 }}></div>
        </div>
        <div className='topic-card-content__wrapper'>
          <h2 className='f-big-1 f-bold mb-1'>{title}</h2>
          <span>{description}</span>
        </div>
      </div>
    );
  }
}

export default TopicCard;
