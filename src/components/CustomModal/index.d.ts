import { ModalProps } from 'antd/lib/modal';

export interface IProps extends ModalProps {
  sideModal?: React.ReactNode; //render a side modal to the left of the modal body
  description?: React.ReactNode; //description of the modal. Can serve as a quick guide for modal
  footerDescription?: React.ReactNode; //description of the modal appear at the footer. Can serve as a quick summary for modal
}
