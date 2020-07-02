import React, { Component } from 'react';

import { LinkedListDS, CanvasContainer, InitArrayInput } from 'components';
import { VisualAlgo } from 'layout';
import { extractInstructionFromDescription } from 'utils';
import { linkedListInstruction } from 'instructions/LinkedList';
import { LinkedList } from 'types/ds/LinkedList';
import { code, explanation } from 'codes/LinkedList';
import { Action, ObjectType, BaseDSPageState } from 'types';
import { DEFAULT_SIDEBAR_WIDTH } from '../constants';

interface IState extends BaseDSPageState {
  data?: number[];
  currentApi?: LinkedList.Api;
  executedApiCount: number;
}

interface IProps {}

export class LinkedListPage extends Component<IProps, IState> {
  private visualAlgoRef: React.RefObject<any>;

  constructor(props: IProps) {
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

  handleExecuteApi = async (api: LinkedList.Api, params: ObjectType<any>) => {
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

  generateStepDescription(currentApi: LinkedList.Api, parameters: any) {
    const { data } = this.state;
    if (!currentApi) return [];
    return linkedListInstruction(data!, currentApi, parameters);
  }

  handlePlayingChange = (newPlayingState: boolean) => {
    this.setState({ autoPlay: newPlayingState });
  };

  handleSideBarWidthChange = (newWidth: number) => {
    const { data } = this.state;
    if (!data) this.setState({ sideBarWidth: newWidth });
  };

  render() {
    const {
      data,
      currentStep,
      currentApi,
      stepDescription,
      autoPlay,
      executedApiCount,
      sideBarWidth,
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
        ref={this.visualAlgoRef}
        onSideBarWidthChange={this.handleSideBarWidthChange}
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
              executedApiCount={executedApiCount}
            />
          </CanvasContainer>
        ) : (
          <div
            className='h-full fx-center linked-list-page__init-button'
            style={{ transform: `translateX(-${(sideBarWidth || 0) / 2}px)` }}
          >
            <InitArrayInput
              onSubmit={linkedListData =>
                this.setState({ data: linkedListData })
              }
              text='Create new linked list'
              defaultLength={5}
            />
          </div>
        )}
      </VisualAlgo>
    );
  }
}

export default LinkedListPage;
