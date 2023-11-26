import { LoaderFunctionArgs, useLoaderData } from 'react-router';
// import { getStoredUser } from '../../utils/auth';
import usersServices from '../../services/users';

export async function loader({ params }: LoaderFunctionArgs) {
  const userId = params.id as string;
  const userData = usersServices.getSingleUser(userId);
  return userData;
}

export default function ProfilePage() {
  // const loggedUser = getStoredUser();
  const user = useLoaderData();
  console.log(user);

  return <p>Test</p>;
}
