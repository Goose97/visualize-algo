import React, { Component } from 'react';

export interface WithExtendClassName {
  className?: string;
}
type MapPropsToClassName = (props: any) => string;

export function withExtendClassName(
  classNameGetter: string | MapPropsToClassName,
) {
  return <P extends {}>(Page: React.ComponentType<P>) => {
    class WrapperComponent extends Component<P & WithExtendClassName> {
      getExtendedClassName() {
        const { className } = this.props;
        let baseClassName =
          typeof classNameGetter === 'string'
            ? classNameGetter
            : classNameGetter(this.props);
        return className ? `${baseClassName} ${className}` : baseClassName;
      }

      render() {
        //@ts-ignore
        const { innerRef, ...rest } = this.props;
        return (
          <Page
            {...(rest as P)}
            ref={innerRef}
            className={this.getExtendedClassName()}
          />
        );
      }
    }

    // return WrapperComponent;

    return React.forwardRef((props: P, ref) => (
      //@ts-ignore
      <WrapperComponent innerRef={ref} {...props} />
    ));
  };
}
