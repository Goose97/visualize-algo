import React, { Component } from 'react';

import { LinkedListDS, CanvasContainer, InitArrayInput } from 'components';
import { VisualAlgo } from 'layout';
import { extractInstructionFromDescription } from 'utils';
import { linkedListInstruction } from 'instructions/LinkedList';
import { LinkedList } from 'types/ds/LinkedList';
import { code, explanation } from 'codes/LinkedList';
import { Action, ObjectType, BaseDSPageState } from 'types';

interface IState extends BaseDSPageState {
  data?: number[];
  currentApi?: LinkedList.Api;
}

interface IProps {}

export class LinkedListPage extends Component<IProps, IState> {
  private ref: React.RefObject<any>;

  constructor(props: IProps) {
    super(props);

    this.state = {
      stepDescription: [],
      autoPlay: false,
    };
    this.ref = React.createRef();
  }

  handleStepChange = (stepIndex: number) => {
    this.setState({ currentStep: stepIndex });
  };

  handleExecuteApi = (api: LinkedList.Api, params: ObjectType<any>) => {
    const stepDescription = this.generateStepDescription(api, params);
    this.setState({ stepDescription, autoPlay: true, currentApi: api });
  };

  generateStepDescription(currentApi: LinkedList.Api, parameters: any) {
    const { data } = this.state;
    if (!currentApi) return [];
    return linkedListInstruction(data!, currentApi, parameters);
  }

  handlePlayingChange = (newPlayingState: boolean) => {
    this.setState({ autoPlay: newPlayingState });
  };

  render() {
    const {
      data,
      currentStep,
      currentApi,
      stepDescription,
      autoPlay,
    } = this.state;
    const linkedListInstruction = extractInstructionFromDescription(
      stepDescription,
      'linkedList',
    ) as Action<LinkedList.Method>[][];

    return (
      <VisualAlgo
        code={currentApi && code[currentApi]}
        explanation={currentApi && explanation[currentApi]}
        stepDescription={stepDescription}
        onStepChange={this.handleStepChange}
        autoPlay={autoPlay}
        onPlayingChange={this.handlePlayingChange}
        ref={this.ref}
      >
        {data ? (
          <CanvasContainer>
            <LinkedListDS
              x={100}
              y={200}
              currentStep={currentStep!}
              totalStep={stepDescription.length - 1}
              instructions={linkedListInstruction}
              initialData={data}
              //@ts-ignore
              handleExecuteApi={this.handleExecuteApi}
              interactive
              dropdownDisabled={autoPlay}
            />
          </CanvasContainer>
        ) : (
          <div className='h-full fx-center linked-list-page__init-button'>
            <InitArrayInput
              onSubmit={linkedListData =>
                this.setState({ data: linkedListData })
              }
              text='Create new linked list'
            />
          </div>
        )}
      </VisualAlgo>
    );
  }
}

export default LinkedListPage;
