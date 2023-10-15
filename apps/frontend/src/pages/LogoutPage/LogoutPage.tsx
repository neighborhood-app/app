import { redirect } from 'react-router-dom';
import { deleteStoredUser } from '../../utils/auth';

export default function logoutLoader() {
  deleteStoredUser();
  return redirect('/login');
}
