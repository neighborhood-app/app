import styles from './DescriptionBox.module.css';
import { Button } from "react-bootstrap"

export default function DescriptionBox() {
  return (
    <div className={styles.column}>
      <h1>PARADISE PARK</h1>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit fugit reprehenderit blanditiis, iusto, harum consectetur necessitatibus delectus dolores optio nam enim exercitationem impedit inventore nihil beatae sint officia? Veritatis numquam, illum excepturi ab ex accusantium eum maxime consequatur modi placeat perferendis quod ipsum consectetur corporis aperiam doloremque in provident delectus.</p>
      <Button className={styles.button}>Join Neighborhood</Button>
    </div>
  )
};

