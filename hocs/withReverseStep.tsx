import React, { Component } from 'react';

export interface WithReverseStep {
  saveReverseLogs: (actionName: string, params: any[], step: number) => void;
  reverseToStep: (targetStep: number) => void;
}

interface ActionLog {
  name: string;
  params: any[];
  step: number;
}

const withReverseStep = <P extends {}>(Page: React.ComponentType<P>) => {
  class WrapperComponent extends Component<P & WithReverseStep> {
    private reverseLogs: ActionLog[];
    private ref: React.RefObject<React.ReactElement>;

    constructor(props: P & WithReverseStep) {
      super(props);

      this.state = {};
      this.reverseLogs = [];
      this.ref = React.createRef();
    }

    saveReverseLogs = (
      reverseActionName: string,
      params: any[],
      step: number,
    ) => {
      const action = {
        name: reverseActionName,
        params,
        step,
      };
      this.reverseLogs.push(action);
      this.forceUpdate();
    };

    reverseToStep = async (targetStep: number) => {
      while (this.reverseLogs.length) {
        const stepToReverse = this.getLastStepToReverse();
        if (!stepToReverse) return;

        const { step, name, params } = stepToReverse;
        if (targetStep >= step) return;

        //@ts-ignore
        const handler = this.getRef()[name];
        const promise = handler && handler(...params);
        await promise;
        this.reverseLogs.pop();
      }
    };

    getLastStepToReverse() {
      const length = this.reverseLogs.length;
      return length ? this.reverseLogs[length - 1] : null;
    }

    getRef() {
      const component = this.ref.current;
      return component || {};
    }

    render() {
      return (
        <Page
          {...(this.props as P)}
          ref={this.ref}
          saveReverseLogs={this.saveReverseLogs}
          reverseToStep={this.reverseToStep}
        />
      );
    }
  }

  return WrapperComponent;

  // return React.forwardRef((props: P, ref) => (
  //   //@ts-ignore
  //   <WrapperComponent innerRef={ref} {...props} />
  // ));
};

export default withReverseStep;
