import React from 'react';

const withReverseStep = Component => {
  class WrappedComponent extends React.Component {
    constructor(props) {
      super(props);

      this.state = {};
      this.reverseLogs = [];
      this.ref = React.createRef();
    }

    saveReverseLogs = (reverseActionName, params, step) => {
      const action = {
        name: reverseActionName,
        params,
        step,
      };
      this.reverseLogs.push(action);
      this.forceUpdate();
    };

    reverseToStep = async targetStep => {
      while (this.reverseLogs.length) {
        const stepToReverse = this.getLastStepToReverse();
        if (!stepToReverse) return;

        const { step, name, params } = stepToReverse;
        if (targetStep >= step) return;

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
        <Component
          {...this.props}
          saveReverseLogs={this.saveReverseLogs}
          reverseToStep={this.reverseToStep}
          ref={this.ref}
        />
      );
    }
  }

  return WrappedComponent;
};

export default withReverseStep;
