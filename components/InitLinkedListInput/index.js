import React, { Component } from 'react';

import { Input } from 'components';

export class InitLinkedListInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      input: '',
    };
  }

  handleChange = value => {
    const { onChange } = this.props;
    const {
      value: arrayValue,
      error,
    } = this.getArrayRepresentationFromInputText(value);
    this.setState({ input: arrayValue, error });
    onChange && onChange(arrayValue);
  };

  getArrayRepresentationFromInputText(inputText) {
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
