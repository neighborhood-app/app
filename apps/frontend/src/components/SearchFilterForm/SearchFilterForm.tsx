import { Form } from "react-bootstrap"

import styles from './SearchFilterForm.module.css'

//@ts-ignore
export default function SearchFilterForm({ filterStatus, setFilterStatus }) {
  return (
    <div className={`${styles.column} ${styles.filterColumn}`}>
      <Form className={styles.form}>
        <Form.Group>
          <Form.Control type="text" placeholder="Search requests"></Form.Control>
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

