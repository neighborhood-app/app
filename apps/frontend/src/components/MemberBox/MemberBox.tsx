import styles from './MemberBox.module.css';
import { Button } from "react-bootstrap"
import type { User } from '../../types';

interface Props {
    admin: User,
    users: Array<User>
}

export default function MemberBox({ admin, users }: Props) {
    const userNames = users.map(user => {
        return (
            <li className={styles.liElement}>{user.user_name}</li>
        )
    })

    return (
        <div className={`${styles.column} ${styles.memberColumn}`}>
            <p><strong><u>Admin</u></strong></p>
            <p>{admin.user_name}</p>
            <p><strong><u>Members</u></strong></p>
            <ul className={styles.list}>
                {userNames}
            </ul>
            <Button className={styles.button}>Leave Neighborhood</Button>
        </div>
    )
}
