import React, { Component } from 'react';

import { VisualAlgo } from 'layout';
import { BaseDSPageState, ObjectType, StepInstruction } from 'types';
import { DEFAULT_SIDEBAR_WIDTH } from '../constants';

export interface WithDSPage<ApiType> extends BaseDSPageState {
  onDataChange: (newData: any) => void;
  currentApi: ApiType;
  data: any;
  executedApiCount: number;
  onExecuteApi: (api: string, params?: ObjectType<any>) => void;
}
interface IState<T> extends BaseDSPageState {
  data?: any;
  currentApi?: T;
  executedApiCount: number;
}
interface DSPageParams<ApiType> {
  //@ts-ignore
  code: Record<ApiType, string>;
  explanation: ObjectType<string[]>;
  instructionGenerator: (
    data: any[],
    operation: ApiType,
    parameters: any,
  ) => StepInstruction[];
}

function withDSPage<ApiType = string>(initObject: DSPageParams<ApiType>) {
  return <P extends {}>(Page: React.ComponentType<P>) => {
    class WrapperComponent extends Component<P & WithDSPage<ApiType>, IState<ApiType>> {
      private visualAlgoRef: React.RefObject<any>;
      constructor(props: P & WithDSPage<ApiType>) {
        super(props);

        this.state = {
          stepDescription: [],
          autoPlay: false,
          executedApiCount: 0,
          sideBarWidth: DEFAULT_SIDEBAR_WIDTH,
        };

        this.visualAlgoRef = React.createRef();
      }

      handleStepChange = (stepIndex: number) => {
        this.setState({ currentStep: stepIndex });
      };

      handlePlayingChange = (newPlayingState: boolean) => {
        this.setState({ autoPlay: newPlayingState });
      };

      handleExecuteApi = async (api: ApiType, params: ObjectType<any>) => {
        const { executedApiCount } = this.state;
        const stepDescription = this.generateStepDescription(api, params);
        const isSwitchingToNewApi = executedApiCount !== 0;
        if (isSwitchingToNewApi) await this.resetVisualAlgoState();

        this.setState({
          stepDescription,
          autoPlay: true,
          currentApi: api,
          executedApiCount: executedApiCount + 1,
          currentStep: -1,
        });
      };

      resetVisualAlgoState() {
        const component = this.visualAlgoRef.current;
        if (component) {
          component.resetForNewApi();
        }
      }

      generateStepDescription(currentApi: ApiType, params: ObjectType<any>) {
        const { instructionGenerator } = initObject;
        const { data } = this.state;
        if (!currentApi) return [];
        return instructionGenerator(data!, currentApi, params);
      }

      handleSideBarWidthChange = (newWidth: number) => {
        const { data } = this.state;
        if (!data) this.setState({ sideBarWidth: newWidth });
      };

      handleDataChange = (newData: any) => {
        this.setState({ data: newData });
      };

      render() {
        const { currentApi, stepDescription, autoPlay } = this.state;
        const { code, explanation } = initObject;
        //@ts-ignore
        const { innerRef, ...rest } = this.props;

        return (
          <VisualAlgo
            //@ts-ignore
            code={currentApi && code[currentApi]}
            //@ts-ignore
            explanation={currentApi && explanation[currentApi]}
            stepDescription={stepDescription}
            onStepChange={this.handleStepChange}
            autoPlay={autoPlay}
            onPlayingChange={this.handlePlayingChange}
            ref={this.visualAlgoRef}
            disableProgressControl={!currentApi}
            onSideBarWidthChange={this.handleSideBarWidthChange}
          >
            <Page
              {...(rest as P)}
              {...this.state}
              ref={innerRef}
              onDataChange={this.handleDataChange}
              onExecuteApi={this.handleExecuteApi}
            />
          </VisualAlgo>
        );
      }
    }

    return React.forwardRef((props: P, ref) => (
      //@ts-ignore
      <WrapperComponent innerRef={ref} {...props} />
    ));
  };
}

export default withDSPage;
