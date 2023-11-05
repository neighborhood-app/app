import { LoaderFunctionArgs, useLoaderData } from 'react-router';
import requestServices, { type FullRequestData } from '../../services/requests';
// import { useUser } from '../../store/user-context';
import RequestDescBox from '../../components/RequestDescBox/RequestDescBox';

export async function loader({ params }: LoaderFunctionArgs): Promise<FullRequestData | null> {
  const { id } = params;
  if (typeof id !== 'string') throw new Error('Invalid request id.');
  const request = await requestServices.getSingleRequest(+id);

  return request;
}

// export async function action({ params, request }: ActionFunctionArgs) {
// }

export default function SingleRequestPage() {
  const request = useLoaderData() as FullRequestData | null;
  if (!request) return <div>Error</div>;
  // const { user, neighborhood, responses } = request;

  return (
    <div>
      <RequestDescBox request={request} />
    </div>
  );
}
