import { ActionFunctionArgs, LoaderFunctionArgs, useLoaderData } from 'react-router';
import { Request } from '@neighborhood/backend/src/types';
import requestServices from '../../services/requests';
import RequestDescBox from '../../components/RequestDescBox/RequestDescBox';
import { FullRequestData, SingleRequestFormIntent } from '../../types';

export async function loader({ params }: LoaderFunctionArgs): Promise<FullRequestData | null> {
  const { id } = params;
  if (typeof id !== 'string') throw new Error('Invalid request id.');
  const request = await requestServices.getSingleRequest(+id);

  return request;
}

export async function action({ params, request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const requestId = Number(params.id);

  const intent = formData.get('intent') as SingleRequestFormIntent;

  let response: Request | null = null;

  if (intent === 'delete-request') {
    response = await requestServices.deleteRequest(requestId);
    console.log(response);
  } else if (intent === 'close-request') {
    response = await requestServices.closeRequest(requestId);
    console.log(response);
  }

  return response;
}

export default function SingleRequestPage() {
  const request = useLoaderData() as FullRequestData | null;
  if (!request) return <div>Error</div>;

  return (
    <div>
      <RequestDescBox request={request} />
    </div>
  );
}
