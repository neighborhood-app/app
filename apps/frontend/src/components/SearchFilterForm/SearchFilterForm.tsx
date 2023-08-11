import { Form } from "react-bootstrap";

import styles from './SearchFilterForm.module.css';

interface Props {
  filterStatus: string,
  setFilterStatus: Function,
  requestSearchValue: string,
  setRequestSearchValue: Function,
}

export default function SearchFilterForm({ filterStatus, setFilterStatus, requestSearchValue, setRequestSearchValue }: Props) {
  return (
    <div className={`${styles.column} ${styles.filterColumn}`}>
      <Form className={styles.form}>
        <Form.Group>
          <Form.Control type="text" placeholder="Search requests" value={requestSearchValue} onChange={event => setRequestSearchValue((event.target).value)}></Form.Control>
        </Form.Group>
        <div className={styles.inputGroup}>
          <p className={styles.pHeader}><strong>Filter by:</strong></p>
          <Form.Select size='sm' className={styles.selectBox} value={filterStatus} 
          onChange={event => setFilterStatus((event.target).value)}>
            <option value='open'>Open Requests</option>
            <option value='closed'>Closed Requests</option>
            <option value='all'>All Requests</option>
          </Form.Select>
        </div>
      </Form>
    </div>
  )
}

