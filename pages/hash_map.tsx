import React, { Component } from 'react';

import { CanvasContainer, HashMapDS, InitHashMapInput } from 'components';
import { VisualAlgo } from 'layout';
import { extractInstructionFromDescription } from 'utils';
import { hashMapInstruction } from 'instructions/HashMap';
import { code, explanation } from 'codes/HashMap';
import { Action, ObjectType, BaseDSPageState } from 'types';
import { HashMap } from 'types/ds/HashMap.d';

interface IState extends BaseDSPageState {
  data?: number[];
  currentApi?: HashMap.Api;
}

interface IProps {}

export class HashMapPage extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      stepDescription: [],
      autoPlay: false,
    };
  }

  handleStepChange = (stepIndex: number) => {
    this.setState({ currentStep: stepIndex });
  };

  handlePlayingChange = (newPlayingState: boolean) => {
    this.setState({ autoPlay: newPlayingState });
  };

  handleExecuteApi = (api: HashMap.Api, params: ObjectType<any>) => {
    const stepDescription = this.generateStepDescription(api, params);
    this.setState({ stepDescription, autoPlay: true, currentApi: api });
  };

  generateStepDescription(currentApi: HashMap.Api, params: ObjectType<any>) {
    const { data } = this.state;
    if (!currentApi) return [];
    return hashMapInstruction(data!, currentApi, params);
  }

  render() {
    const {
      data,
      currentStep,
      currentApi,
      stepDescription,
      autoPlay,
    } = this.state;
    const hashMapInstruction = extractInstructionFromDescription(
      stepDescription,
      'hashMap',
    ) as Action<HashMap.Method>[][];

    return (
      <VisualAlgo
        code={currentApi && code[currentApi]}
        explanation={currentApi && explanation[currentApi]}
        stepDescription={stepDescription}
        onStepChange={this.handleStepChange}
        autoPlay={autoPlay}
        onPlayingChange={this.handlePlayingChange}
      >
        {data ? (
          <CanvasContainer>
            <HashMapDS
              x={100}
              y={200}
              blockType='block'
              initialData={data}
              currentStep={currentStep}
              instructions={hashMapInstruction}
              totalStep={stepDescription.length - 1}
              //@ts-ignore
              handleExecuteApi={this.handleExecuteApi}
              interactive
            />
          </CanvasContainer>
        ) : (
          <div className='h-full fx-center linked-list-page__init-button'>
            <InitHashMapInput
              onSubmit={hashMapData => this.setState({ data: hashMapData })}
              text='Create new hashMap'
            />
          </div>
        )}
      </VisualAlgo>
    );
  }
}

export default HashMapPage;
