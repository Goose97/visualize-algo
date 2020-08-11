import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Input } from 'antd';

import { Button, CustomModal, BinarySearchTreeDS } from 'components';
import withExtendClassName, {
  WithExtendClassName,
} from 'hocs/withExtendClassName';
import { initBSTbySequentiallyInsert } from 'instructions/BST/helper';
import { IProps, IState } from './index.d';

const { TextArea } = Input;

type PropsWithHoc = IProps & WithExtendClassName;

const PRESET_DATA = [4, 1, 8, -3, 2, 6, 9, null, -2];

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
  ): { input?: Array<string | number | null>; error?: string | null } {
    const regex = /^\[([(\-\d|\d),\s]+)\]$/;
    const match = inputText.match(regex);
    if (!match) return { error: 'Sai cú pháp' };
    const allItemToInsert = match[1]
      .split(',')
      .map(string => (string.includes('null') ? null : parseInt(string)))
      .filter(item => item === null || typeof item === 'number');
    const input = initBSTbySequentiallyInsert(
      allItemToInsert,
    ).getLayerRepresentation();

    return {
      input,
      error: null,
    };
  }

  focusToInput = () => {
    const inputElement = this.inputRef.current;
    const htmlInput = ReactDOM.findDOMNode(inputElement) as HTMLInputElement;
    htmlInput?.focus();
  };

  handleUsingPresetData = () => {
    let textToMatchThoseData = PRESET_DATA.map(item =>
      item === null ? 'null' : item.toString(),
    ).join(', ');
    textToMatchThoseData = `[${textToMatchThoseData}]`;
    this.setState({ input: PRESET_DATA, textInput: textToMatchThoseData });
  };

  render() {
    const { isModalVisible, input, textInput, error } = this.state;
    const { className, onSubmit } = this.props;
    const previewWindow = (
      <div className='init-bst-modal__preview fx-7'>
        <svg className='h-full w-full'>
          {!!input.length && (
            <BinarySearchTreeDS
              x={10}
              y={50}
              data={input}
              controlled
              instructions={[]}
            />
          )}
        </svg>
      </div>
    );

    const inputTextArea = (
      <div className='init-bst-modal__input fx-3 fx-col'>
        <div className='fx-col'>
          <span className='mb-2'>
            Element to construct BST (insert sequentially):
          </span>
          <TextArea
            onChange={this.handleChange}
            placeholder='[4, 1, 8, -3, 2, 6, 9, null, -2]'
            value={textInput}
          />
        </div>
        <Button type='secondary' onClick={this.handleUsingPresetData}>
          Generate preset data
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
          okButtonProps={{ disabled: !input || !input.length || !!error }}
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
