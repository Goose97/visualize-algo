import React, { Component } from 'react';

import { CodeBlock } from '../../components';
import './style.scss';

export class VisualAlgo extends Component {
  render() {
    const { children, code, highlightLine } = this.props;

    return (
      <div className='fx-row vh-100'>
        <div className='fx-1 code-container'>
          <CodeBlock code={code} highlightLine={highlightLine} />
        </div>
        <div className='fx-1 visual-container shadow'>{children}</div>
      </div>
    );
  }
}

export default VisualAlgo;
