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
  collisionResolution: 'chaining' | 'linearProbe';
  executedApiCount: number;
}

interface IProps {}

export class HashTablePage extends Component<IProps, IState> {
  private visualAlgoRef: React.RefObject<any>;

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
      collisionResolution: 'chaining',
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

  handleExecuteApi = async (api: HashTable.Api, params: ObjectType<any>) => {
    const { collisionResolution, executedApiCount } = this.state;
    const stepDescription = this.generateStepDescription(api, {
      ...params,
      collisionResolution,
    });
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
      collisionResolution,
      executedApiCount,
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
        ref={this.visualAlgoRef}
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
              collisionResolution={collisionResolution}
              interactive
              dropdownDisabled={autoPlay}
              executedApiCount={executedApiCount}
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
