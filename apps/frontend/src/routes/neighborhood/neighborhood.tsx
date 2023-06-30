import { Form, Button } from "react-bootstrap"

import styles from "./neighborhood.module.css"

export default function Neighborhood() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>PARADISE PARK</h1>
      </div>
      <div className={`${styles.column} ${styles.filterColumn}`}>
        <Form>
          <Form.Group>
            <Form.Control type="text" placeholder="Search requests"></Form.Control>
          </Form.Group>
          <p className={styles.pHeader}><strong>Show</strong></p>
          <div className={styles.radioContainer}>
            <div className={styles.radio}>
              <input type="radio" id="openRequests" name="requests" />
              <label>Open Requests</label>
            </div>
            <div className={styles.radio}>
              <input type="radio" id="closedRequests" name="requests" />
              <label>Closed Requests</label>
            </div>
            <div className={styles.radio}>
              <input type="radio" id="allRequests" name="requests" />
              <label>All Requests</label>
            </div>
            <Button className={styles.addRequestButton}>Add Request</Button>
          </div>
        </Form>
      </div>
      <div className={styles.column}>
        <div className={styles.requestBox}>
          <div className={styles.requestHeader}>
            <p className={styles.author}>John Smith</p>
            <p>16.03.2023</p>
          </div>
          <p>I need help finding my cat</p>
          <Button className={styles.helpButton}>Offer help</Button>
        </div>
        <div className={styles.requestBox}>
          <div className={styles.requestHeader}>
            <p className={styles.author}>Sonny Crocket</p>
            <p>15.03.2023</p>
          </div>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad incidunt dignissimos praesentium obcaecati rerum ducimus laudantium exercitationem distinctio atque quaerat?</p>
          <Button className={styles.helpButton}>Offer help</Button>
        </div>
        <div className={styles.requestBox}>
          <div className={styles.requestHeader}>
            <p className={styles.author}>Gandalf the Grey</p>
            <p>04.03.2023</p>
          </div>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste, corporis!</p>
          <Button className={styles.helpButton}>Offer help</Button>
        </div>
      </div>
      <div className={`${styles.column} ${styles.memberColumn}`}>
        <h3>About neighborhood</h3>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit fugit reprehenderit blanditiis, iusto, harum consectetur necessitatibus delectus dolores optio nam enim exercitationem impedit inventore nihil beatae sint officia? Veritatis numquam, illum excepturi ab ex accusantium eum maxime consequatur modi placeat perferendis quod ipsum consectetur corporis aperiam doloremque in provident delectus.</p>
        <p><strong><u>Admin</u></strong></p>
        <p>Mike Miller</p>
        <p><strong><u>Members</u></strong></p>
        <ul className={styles.list}>
          <li>
            Sonia
          </li>
          <li>
            Maria
          </li>
          <li>
            John
          </li>
          <li>
            Radu
          </li>
        </ul>
        <Button className={styles.leaveButton}>Leave Neighborhood</Button>
      </div>
    </div>
  )
}