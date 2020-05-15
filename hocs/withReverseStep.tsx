import React, { Component } from 'react';

export interface WithReverseStep<T> {
  saveReverseLog: (actionName: string, params: any[], step: number) => void;
  saveStepSnapshots: (snapshot: T, step: number) => void;
  reverseToStep: (targetStep: number) => void;
}

interface ActionLog {
  name: string;
  params: any[];
  step: number;
}

interface SnapshotLog<T> {
  snapshot: T;
  step: number;
}

const withReverseStep = <T extends {}, P extends {}>(
  Page: React.ComponentType<P>,
) => {
  class WrapperComponent extends Component<P & WithReverseStep<T>> {
    private reverseLogs: ActionLog[];
    private stepSnapshots: SnapshotLog<T>[];
    private ref: React.RefObject<React.ReactElement>;

    constructor(props: P & WithReverseStep<T>) {
      super(props);

      this.state = {};
      this.reverseLogs = [];
      this.stepSnapshots = [];
      this.ref = React.createRef();
    }

    saveReverseLog = (
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

    saveStepSnapshots = (snapshot: T, step: number) => {
      this.stepSnapshots.push({
        snapshot,
        step,
      });
    };

    reverseToStep = async (targetStep: number) => {
      const snapshotOfTargetStep = this.stepSnapshots.find(
        ({ step }) => step === targetStep,
      );
      if (snapshotOfTargetStep) {
        //@ts-ignore
        const handler = this.getRef().handleReverse;
        handler(snapshotOfTargetStep.snapshot);
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
          saveReverseLog={this.saveReverseLog}
          reverseToStep={this.reverseToStep}
          saveStepSnapshots={this.saveStepSnapshots}
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
