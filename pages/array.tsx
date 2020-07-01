import React, { Component } from 'react';

import { CanvasContainer, ArrayDS, InitArrayInput } from 'components';
import { VisualAlgo } from 'layout';
import { extractInstructionFromDescription } from 'utils';
import { arrayInstruction } from 'instructions/Array';
import { code, explanation } from 'codes/Array';
import { Action, ObjectType, BaseDSPageState } from 'types';
import { Array } from 'types/ds/Array.d';

interface IState extends BaseDSPageState {
  data?: number[];
  currentApi?: Array.Api;
  executedApiCount: number;
}

interface IProps {}

export class ArrayPage extends Component<IProps, IState> {
  private visualAlgoRef: React.RefObject<any>;
  constructor(props: IProps) {
    super(props);

    this.state = {
      stepDescription: [],
      autoPlay: false,
      executedApiCount: 0,
    };

    this.visualAlgoRef = React.createRef();
  }

  handleStepChange = (stepIndex: number) => {
    this.setState({ currentStep: stepIndex });
  };

  handlePlayingChange = (newPlayingState: boolean) => {
    this.setState({ autoPlay: newPlayingState });
  };

  handleExecuteApi = async (api: Array.Api, params: ObjectType<any>) => {
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

  generateStepDescription(currentApi: Array.Api, params: ObjectType<any>) {
    const { data } = this.state;
    if (!currentApi) return [];
    return arrayInstruction(data!, currentApi, params);
  }

  render() {
    const {
      data,
      currentStep,
      currentApi,
      stepDescription,
      autoPlay,
      executedApiCount,
    } = this.state;
    const arrayInstruction = extractInstructionFromDescription(
      stepDescription,
      'array',
    ) as Action<Array.Method>[][];

    return (
      <VisualAlgo
        code={currentApi && code[currentApi]}
        explanation={currentApi && explanation[currentApi]}
        stepDescription={stepDescription}
        onStepChange={this.handleStepChange}
        autoPlay={autoPlay}
        onPlayingChange={this.handlePlayingChange}
        ref={this.visualAlgoRef}
        disableProgressControl={!currentApi}
      >
        {data ? (
          <CanvasContainer>
            <ArrayDS
              x={100}
              y={200}
              blockType='block'
              initialData={data}
              currentStep={currentStep}
              instructions={arrayInstruction}
              totalStep={stepDescription.length - 1}
              //@ts-ignore
              handleExecuteApi={this.handleExecuteApi}
              interactive
              executedApiCount={executedApiCount}
              currentApi={currentApi}
              dropdownDisabled={autoPlay}
            />
          </CanvasContainer>
        ) : (
          <div className='h-full fx-center linked-list-page__init-button'>
            <InitArrayInput
              onSubmit={arrayData => this.setState({ data: arrayData })}
              text='Create new array'
            />
          </div>
        )}
      </VisualAlgo>
    );
  }
}

export default ArrayPage;
