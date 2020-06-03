import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Input } from 'antd';

import { Button, CustomModal, BinarySearchTreeDS } from 'components';
import withExtendClassName, {
  WithExtendClassName,
} from 'hocs/withExtendClassName';
import { IProps, IState } from './index.d';

const { TextArea } = Input;

type PropsWithHoc = IProps & WithExtendClassName;

export class InitBSTInput extends Component<PropsWithHoc, IState> {
  private inputRef: React.RefObject<HTMLInputElement>;
  constructor(props: IProps) {
    super(props);

    this.state = {
      input: [],
      error: null,
      isModalVisible: false,
    };
    this.inputRef = React.createRef();
  }

  handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const stateChanges = this.getBSTRepresentationFromInputText(e.target.value);
    //@ts-ignore
    this.setState({ ...stateChanges, textInput: e.target.value });
  };

  getBSTRepresentationFromInputText(
    inputText: string,
  ): { input?: Array<number | null>; error?: string | null } {
    const regex = /^\[([(\d|null),\s]+)\]$/;
    const match = inputText.match(regex);
    if (!match) return { error: 'Sai cú pháp' };
    return {
      input: match[1]
        .split(',')
        .map(string => (string.includes('null') ? null : parseInt(string)))
        .filter(item => item === null || typeof item === 'number'),
      error: null,
    };
  }

  focusToInput = () => {
    const inputElement = this.inputRef.current;
    const htmlInput = ReactDOM.findDOMNode(inputElement) as HTMLInputElement;
    htmlInput?.focus();
  };

  handleRandomizeData = () => {
    const randomData = this.generateRandomData();
    let textToMatchThoseData = randomData
      .map(item => (item === null ? 'null' : item.toString()))
      .join(', ');
    textToMatchThoseData = `[${textToMatchThoseData}]`;
    this.setState({ input: randomData, textInput: textToMatchThoseData });
  };

  generateRandomData() {
    return [4, 1, 8, -3, 2, 6, 9, null, -2, null, null, null, null, null, null];
    return Array(8)
      .fill(0)
      .map(() => {
        const value = Math.round(Math.random() * 12);
        if (value > 10) return null;
        else return value;
      });
  }

  render() {
    const { isModalVisible, input, textInput } = this.state;
    const { className, onSubmit } = this.props;
    const previewWindow = (
      <div className='init-bst-modal__preview fx-7'>
        <svg className='h-full w-full'>
          {!!input.length && (
            <BinarySearchTreeDS x={10} y={50} initialData={input} controlled />
          )}
        </svg>
      </div>
    );

    const inputTextArea = (
      <div className='init-bst-modal__input fx-3'>
        <TextArea
          onChange={this.handleChange}
          placeholder='[1,2,3,null,4,5]'
          value={textInput}
        />
        <Button type='secondary' onClick={this.handleRandomizeData}>
          Generate random data
        </Button>
      </div>
    );

    return (
      <Button
        type='primary'
        className={className}
        onClick={() => this.setState({ isModalVisible: true })}
      >
        Create new BST
        <CustomModal
          visible={isModalVisible}
          title='Construct new BST'
          onCancel={() => this.setState({ isModalVisible: false })}
          onOk={() => onSubmit(input)}
        >
          <div className='init-bst-modal__wrapper fx'>
            {previewWindow}
            {inputTextArea}
          </div>
        </CustomModal>
      </Button>
    );
  }
}

export default withExtendClassName('f-big-2 px-6 py-2')(InitBSTInput);
