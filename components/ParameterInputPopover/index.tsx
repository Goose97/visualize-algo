import React, { Component } from 'react';
import { Popover, Row, Col } from 'antd';
import { isFunction } from 'lodash';

import { Input, Button } from 'components';
import { upcaseFirstLetter } from 'utils';
import { IProps, IState } from './index.d';

export class ParameterInputPopover extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      currentParametersInput: {},
    };
  }

  renderPopoverContent() {
    const { parameters } = this.props;
    if (parameters) {
      const listInputParams = Object.entries(parameters).map(
        ([paramName, type]) => (
          <Row key={paramName} className='fx-center'>
            <Col span={8}>{upcaseFirstLetter(paramName)}:</Col>
            <Col span={16}>
              <Input onChange={this.handleInputChange.bind(null, paramName)} />
            </Col>
          </Row>
        ),
      );

      const submitButton = (
        <Button
          type='secondary'
          className='mt-6'
          onClick={this.handleSubmitParameter}
        >
          Start
        </Button>
      );

      return (
        <div className='fx-col' style={{ justifyContent: 'flex-end' }}>
          {listInputParams}
          {submitButton}
        </div>
      );
    } else {
      return null;
    }
  }

  handleInputChange = (paramName: string, value: number | string) => {
    const { currentParametersInput } = this.state;
    const newState = { ...currentParametersInput, [paramName]: value };
    this.setState({ currentParametersInput: newState });
  };

  handleSubmitParameter = () => {
    const { onSubmit } = this.props;
    const { currentParametersInput } = this.state;
    isFunction(onSubmit) && onSubmit(currentParametersInput);
  };

  render() {
    const { children } = this.props;
    return (
      <Popover
        {...this.props}
        title='Parameters'
        content={this.renderPopoverContent()}
        className='parameter-input-popover'
      >
        {children}
      </Popover>
    );
  }
}

export default ParameterInputPopover;
