import React, { Component } from 'react';
import Prism from 'prismjs';

import LineHighlight from './LineHightlight';
import './prism.css';
import './style.scss';

export class CodeBlock extends Component {
  constructor(props) {
    super(props);
    this.codeBlockRef = React.createRef();
    LineHighlight.init();
  }

  componentDidUpdate(prevProps) {
    const { highlightLine, code } = this.props;
    if (prevProps.highlightLine !== highlightLine) {
      LineHighlight.reset();
    }

    if (prevProps.code !== code) {
      Prism.highlightAll();
    }
  }

  componentDidMount() {
    Prism.highlightAll();
  }

  render() {
    const { code, highlightLine } = this.props;
    return (
      <pre ref={this.codeBlockRef} data-line={highlightLine}>
        <code className='language-javascript visual-algo-code'>{code}</code>
      </pre>
    );
  }
}

export default CodeBlock;
