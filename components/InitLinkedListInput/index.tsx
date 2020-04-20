import React, { Component, ReactText } from 'react';

import { Input } from 'components';
import { IProps, IState } from './index.d';

export class InitLinkedListInput extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      input: [],
      error: null,
    };
  }

  handleChange = (value: ReactText) => {
    const { onChange } = this.props;
    const {
      value: arrayValue,
      error,
    } = this.getArrayRepresentationFromInputText(value.toString());
    this.setState({ input: arrayValue, error });
    onChange && onChange(arrayValue);
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

  render() {
    return (
      <div className='il-bl'>
        <Input
          style={{ minWidth: 300 }}
          className='ml-2'
          placeholder='[4,2,8,1,4,5,6]'
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default InitLinkedListInput;
