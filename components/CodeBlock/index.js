import React, { Component } from 'react';
import Prism from 'prismjs';

import LineHighlight from './LineHightlight';
import '../../styles/prism.css';

export class CodeBlock extends Component {
  constructor(props) {
    super(props);
    this.codeBlockRef = React.createRef();
    LineHighlight.init();
  }

  componentDidUpdate(prevProps) {
    const { highlightLine } = this.props;
    if (prevProps.highlightLine !== highlightLine) {
      LineHighlight.reset();
    }
  }

  componentDidMount() {
    Prism.highlightAll();
  }

  render() {
    const { code, highlightLine } = this.props;
    return (
      <pre ref={this.codeBlockRef} data-line={highlightLine}>
        <code className='language-javascript'>{code}</code>
      </pre>
    );
  }
}

export default CodeBlock;
