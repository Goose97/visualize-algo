import React, { Component } from 'react';

import { IProps } from './index.d';

export class TopicCard extends Component<IProps> {
  render() {
    const { title, description, onClick, imgSrc } = this.props;
    return (
      <div
        className='topic-card__wrapper b-radius-10 fx-center has-transition'
        onClick={onClick}
      >
        <div className='topic-card-image__wrapper'>
          <img src={imgSrc} width={240} height={240} />
        </div>
        <div className='topic-card-content__wrapper px-4 py-6'>
          <h2 className='f-big-1 f-bold mb-1'>{title}</h2>
          <span>{description}</span>
        </div>
      </div>
    );
  }
}

export default TopicCard;
