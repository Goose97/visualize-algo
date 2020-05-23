import React, { Component, ReactText } from 'react';
import ReactDOM from 'react-dom';

import { Button, Input } from 'components';
import withExtendClassName, {
  WithExtendClassName,
} from 'hocs/withExtendClassName';
import { classNameHelper } from 'utils';
import { IProps, IState } from './index.d';

type PropsWithHoc = IProps & WithExtendClassName;

export class InitLinkedListInput extends Component<PropsWithHoc, IState> {
  private inputRef: React.RefObject<HTMLInputElement>;
  constructor(props: IProps) {
    super(props);

    this.state = {
      input: [],
      error: null,
      isTyping: false,
    };
    this.inputRef = React.createRef();
  }

  handleChange = (value: ReactText) => {
    const {
      value: arrayValue,
      error,
    } = this.getArrayRepresentationFromInputText(value.toString());
    this.setState({ input: arrayValue, error });
  };

  getArrayRepresentationFromInputText(
    inputText: string,
  ): { value: number[]; error: string | null } {
    const regex = /^\[([\d,\s]+)\]$/;
    const match = inputText.match(regex);
    if (!match) return { value: [], error: 'Sai cú pháp' };
    return {
      value: match[1]
        .split(',')
        .map(string => parseInt(string))
        .filter(item => !!item),
      error: null,
    };
  }

  produceClassName() {
    const { isTyping } = this.state;
    return classNameHelper({
      base: 'init-linked-list-button__wrapper',
      typing: isTyping,
    });
  }

  focusToInput = () => {
    const inputElement = this.inputRef.current;
    const htmlInput = ReactDOM.findDOMNode(inputElement) as HTMLInputElement;
    htmlInput?.focus();
  };

  handleClick = () => {
    const { onSubmit } = this.props;
    const { isTyping, input } = this.state;
    if (!isTyping) {
      this.setState({ isTyping: true }, this.focusToInput);
    } else {
      const linkedListData =
        input === undefined || !input.length
          ? this.generateRandomData()
          : input;
      onSubmit(linkedListData);
    }
  };

  generateRandomData() {
    return Array(5)
      .fill(0)
      .map(() => Math.round(Math.random() * 10));
  }

  render() {
    const { isTyping } = this.state;
    const { className } = this.props;
    return (
      <div className={this.produceClassName()}>
        <Button type='primary' className={className} onClick={this.handleClick}>
          {isTyping ? 'Initialize' : 'Create new linked list'}
          <Input
            ref={this.inputRef}
            onChange={this.handleChange}
            onClick={e => e.stopPropagation()}
            placeholder='[5,2,3,7,4]'
          />
        </Button>
      </div>
    );
  }
}

export default withExtendClassName('f-big-2 px-6 py-2')(InitLinkedListInput);
