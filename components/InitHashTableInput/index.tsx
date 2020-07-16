import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Input, Radio } from 'antd';

import { Button, CustomModal, BinarySearchTreeDS } from 'components';
import withExtendClassName, {
  WithExtendClassName,
} from 'hocs/withExtendClassName';
import { IProps, IState } from './index.d';
import { text } from '@fortawesome/fontawesome-svg-core';

const { TextArea } = Input;

type PropsWithHoc = IProps & WithExtendClassName;

const defaultObject = { a: 1, b: 2, gh: 23 };
const defaultInputText = JSON.stringify(defaultObject);

export class InitHashTableInput extends Component<PropsWithHoc, IState> {
  private inputRef: React.RefObject<HTMLInputElement>;
  constructor(props: IProps) {
    super(props);

    this.state = {
      input: defaultObject,
      error: null,
      isModalVisible: false,
      collisionResolution: 'chaining',
    };
    this.inputRef = React.createRef();
  }

  handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ textInput: e.target.value });
  };

  focusToInput = () => {
    const inputElement = this.inputRef.current;
    const htmlInput = ReactDOM.findDOMNode(inputElement) as HTMLInputElement;
    htmlInput?.focus();
  };

  handleSubmit = () => {
    const { onSubmit } = this.props;
    const { textInput, collisionResolution } = this.state;
    const textInputToParse = textInput || defaultInputText;
    const hashTableObject = JSON.parse(textInputToParse);
    onSubmit(hashTableObject, collisionResolution);
  };

  isOkButtonDisable = () => {
    const { textInput } = this.state;
    if (textInput == undefined || textInput == '') return false;

    // Disable ok button if JSON input is malformed
    try {
      const parsedData = JSON.parse(textInput);
      return typeof parsedData !== 'object' || parsedData === null;
    } catch (e) {
      return true;
    }
  };

  render() {
    const { isModalVisible, textInput, collisionResolution } = this.state;
    const { className } = this.props;
    const inputTextArea = (
      <div className='init-hash-table-modal__input fx-3'>
        <span>Paste JSON here:</span>
        <TextArea
          onChange={this.handleChange}
          placeholder={defaultInputText}
          value={textInput}
        />
      </div>
    );

    const collisionResolutionPicker = (
      <div className='mt-2'>
        <span>Collision resolution method:&nbsp;</span>
        <Radio.Group
          value={collisionResolution}
          onChange={e => this.setState({ collisionResolution: e.target.value })}
        >
          <Radio value='chaining'>Chaining</Radio>
          <Radio value='linearProbe'>Linear probe</Radio>
        </Radio.Group>
      </div>
    );

    return (
      <Button
        type='primary'
        className={className}
        onClick={() => this.setState({ isModalVisible: true })}
      >
        Create new hash table
        <CustomModal
          visible={isModalVisible}
          title='Construct new hash table'
          onCancel={() => this.setState({ isModalVisible: false })}
          onOk={this.handleSubmit}
          okButtonProps={{ disabled: this.isOkButtonDisable() }}
          width={550}
        >
          <div className='fx-col'>
            {inputTextArea}
            {collisionResolutionPicker}
          </div>
        </CustomModal>
      </Button>
    );
  }
}

export default withExtendClassName('f-big-2 px-6 py-2')(InitHashTableInput);
