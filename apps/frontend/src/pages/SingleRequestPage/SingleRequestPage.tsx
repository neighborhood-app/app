import { LoaderFunctionArgs, useLoaderData } from 'react-router';
import requestServices from '../../services/requests';
// import { useUser } from '../../store/user-context';
import { RequestType } from '../../types';

export async function loader({ params }: LoaderFunctionArgs): Promise<RequestType | null> {
  const { id } = params;
  if (typeof id !== 'string') throw new Error('Invalid request id.');
  const request = await requestServices.getSingleRequest(+id);

  return request;
}

// export async function action({ params, request }: ActionFunctionArgs) {
// }

export default function SingleRequestPage() {
  const request = useLoaderData() as RequestType | null;
  if (!request) return <div>Error</div>;
  console.log(request);

  return <div>{request.title}</div>;
}
