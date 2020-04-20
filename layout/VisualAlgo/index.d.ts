import { IProps as ApiControllerProps } from 'components/ApiController/index.d';
import { IProps as ProgressController } from 'components/ProgressController/index.d';

interface OwnProps {
  autoPlay?: boolean;
  stepDescription: StepDescription[];
  onStepChange: (newState: Object, newStep: number) => void;
  onPlayingChange: (isPlaying: boolean) => void;
  code: string;
  explanation: string[];
}

export type IProps = OwnProps & ProgressController & ApiController;

interface CoreState {
  codeLine?: number;
  explanationStep?: number;
}

interface StepDescription {
  state: Object;
  duration: number;
}

export interface IState extends CoreState {
  currentStep: number;
  autoPlay: boolean;
}
