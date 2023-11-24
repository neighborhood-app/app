import { Modal } from 'react-bootstrap';
import TriggerActionButton from '../TriggerActionButton/TriggerActionButton';
import CustomBtn from '../CustomBtn/CustomBtn';
import styles from './Prompt.module.css';
import { FormIntent } from '../../types';

type Props = {
  text: string;
  intent: FormIntent;
  route: string;
  status: boolean;
  hide: () => void;
};

export default function Prompt({ text, intent, route, status, hide }: Props) {
  return (
    <Modal show={status} onHide={hide}>
      <Modal.Body>{text}</Modal.Body>
      <Modal.Footer>
        <div className={styles.alertBtnContainer}>
          <TriggerActionButton route={route} variant="primary" intent={intent} text="Yes" />
          <CustomBtn variant="outline-dark" className={styles.alertBtn} onClick={hide}>
            No
          </CustomBtn>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
