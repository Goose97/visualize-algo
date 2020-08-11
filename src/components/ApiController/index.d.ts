export interface IProps {
  apiList: { value: string; label: string }[];
  parameterInput: React.ReactNode;
  onApiChange: (newApi: string) => void;
  actionButton: React.ReactNode;
}
