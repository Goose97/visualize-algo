import React, { Component } from 'react';

function withExtendClassName(classNameGetter) {
  return (Page) => {
    class WrapperComponent extends Component {
      getExtendedClassName() {
        const { className } = this.props;
        let baseClassName =
          typeof classNameGetter === 'string'
            ? classNameGetter
            : classNameGetter(this.props);
        return className ? `${baseClassName} ${className}` : baseClassName;
      }

      render() {
        const { innerRef, ...rest } = this.props;
        return (
          <Page
            {...rest}
            ref={innerRef}
            className={this.getExtendedClassName()}
          />
        );
      }
    }

    return React.forwardRef((props, ref) => (
      <WrapperComponent innerRef={ref} {...props} />
    ));
  };
}

export default withExtendClassName;
