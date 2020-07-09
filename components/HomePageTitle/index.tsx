import React, { Component } from 'react';
import produce from 'immer';

import { IProps, IState } from './index.d';

export class HomePageTitle extends Component<IProps, IState> {
  private switchingWordsWrapperRef: React.RefObject<HTMLDivElement>;
  private switchingWordsWrapperHeight?: number;
  constructor(props: IProps) {
    super(props);

    this.state = {
      translateY: 0,
      currentWordIndex: 0,
      wordList: [
        {
          content: 'interactive',
          translateY: 0,
        },
        {
          content: 'visual',
          translateY: 0,
        },
        {
          content: 'easy',
          translateY: 0,
        },
        {
          content: 'fun',
          translateY: 0,
        },
      ],
    };

    this.switchingWordsWrapperRef = React.createRef();
  }

  componentDidMount() {
    const wrapper = this.switchingWordsWrapperRef.current;
    if (wrapper) {
      this.switchingWordsWrapperHeight = wrapper.getBoundingClientRect().height;
    }

    this.switchWord();
  }

  switchWord = () => {
    setTimeout(() => {
      const { currentWordIndex, wordList } = this.state;
      const wordHeight = this.switchingWordsWrapperHeight! / wordList.length;
      this.setState(
        {
          translateY: -(currentWordIndex + 1) * wordHeight,
          currentWordIndex: currentWordIndex + 1,
          wordList: this.switchWordToBottom(currentWordIndex),
        },
        this.switchWord,
      );
    }, 3000);
  };

  switchWordToBottom(wordIndex: number) {
    const { wordList } = this.state;
    return produce(wordList, draft => {
      const realIndex = wordIndex % wordList.length;
      const word = draft[realIndex];
      word.translateY += this.switchingWordsWrapperHeight!;
    });
  }

  render() {
    const { translateY, wordList } = this.state;
    return (
      <div className='home-page-title__wrapper fx-center py-12 fx-col'>
        <h2 className='home-page-title__title'>Animated Algo</h2>
        <span className='home-page-title__sub-title f-big-1'>
          Learn data structure the{' '}
          <div
            className='home-page-title__switching-words fx-gap-4 has-transition'
            ref={this.switchingWordsWrapperRef}
            style={{ transform: `translateY(${translateY}px)` }}
          >
            {wordList.map(({ content, translateY }) => (
              <span
                className='f-big-1 italic'
                style={{ transform: `translateY(${translateY}px)` }}
              >
                {content}
              </span>
            ))}
          </div>{' '}
          way
        </span>
      </div>
    );
  }
}

export default HomePageTitle;
