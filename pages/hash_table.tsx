import React, { Component } from 'react';

// import { CanvasContainer, HashTableDS, InitHashTableInput } from 'components';
import { CanvasContainer, HashTableDS } from 'components';
import { VisualAlgo } from 'layout';
import { extractInstructionFromDescription } from 'utils';
import { hashTableInstruction } from 'instructions/HashTable';
import { code, explanation } from '../codes/HashTable';
import { Action, ObjectType, BaseDSPageState } from 'types';
import { HashTable } from 'types/ds/HashTable.d';

interface IState extends BaseDSPageState {
  data?: ObjectType<string | number>;
  currentApi?: HashTable.Api;
}

interface IProps {}

export class HashTablePage extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      stepDescription: [],
      autoPlay: false,
      data: {
        a: 1,
        b: 2,
        l: 3,
      },
    };
  }

  handleStepChange = (stepIndex: number) => {
    this.setState({ currentStep: stepIndex });
  };

  handlePlayingChange = (newPlayingState: boolean) => {
    this.setState({ autoPlay: newPlayingState });
  };

  handleExecuteApi = (api: HashTable.Api, params: ObjectType<any>) => {
    const stepDescription = this.generateStepDescription(api, {
      ...params,
      collisionResolution: 'linearProbe',
    });
    console.log('stepDescription', stepDescription);
    this.setState({ stepDescription, autoPlay: true, currentApi: api });
  };

  generateStepDescription(currentApi: HashTable.Api, params: ObjectType<any>) {
    const { data } = this.state;
    if (!currentApi) return [];
    return hashTableInstruction(data!, currentApi, params);
  }

  render() {
    const {
      data,
      currentStep,
      currentApi,
      stepDescription,
      autoPlay,
    } = this.state;
    const hashTableInstruction = extractInstructionFromDescription(
      stepDescription,
      'hashTable',
    ) as Action<HashTable.Method>[][];

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
            <HashTableDS
              x={100}
              y={200}
              blockType='block'
              initialData={data}
              currentStep={currentStep}
              instructions={hashTableInstruction}
              totalStep={stepDescription.length - 1}
              //@ts-ignore
              handleExecuteApi={this.handleExecuteApi}
              interactive
            />
          </CanvasContainer>
        ) : (
          <div className='h-full fx-center linked-list-page__init-button'>
            {/* <InitHashTableInput
              onSubmit={hashTableData => this.setState({ data: hashTableData })}
              text='Create new hashTable'
            /> */}
          </div>
        )}
      </VisualAlgo>
    );
  }
}

export default HashTablePage;
