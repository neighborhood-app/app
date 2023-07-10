import { Form } from "react-bootstrap"

import styles from './SearchFilterForm.module.css'

export default function SearchFilterForm() {
  return (
    <div className={`${styles.column} ${styles.filterColumn}`}>
      <Form className={styles.form}>
        <Form.Group>
          <Form.Control type="text" placeholder="Search requests"></Form.Control>
        </Form.Group>
        <div className={styles.inputGroup}>
          <p className={styles.pHeader}><strong>Filter by:</strong></p>
          <Form.Select size='sm' className={styles.selectBox}>
            <option value='open_requests'>Open Requests</option>
            <option value='closed_requests'>Closed Requests</option>
            <option value='all_requests'>All Requests</option>
          </Form.Select>
        </div>
      </Form>
    </div>
  )
}

