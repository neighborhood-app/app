import { ActionFunctionArgs, LoaderFunctionArgs, useLoaderData } from 'react-router';
import { Request, ResponseData } from '@neighborhood/backend/src/types';
import { redirect } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import responseServices from '../../services/responses';
import requestServices from '../../services/requests';
import RequestDescBox from '../../components/RequestDescBox/RequestDescBox';
import { FullRequestData, SingleRequestFormIntent } from '../../types';
import ResponsesGrid from '../../components/ResponsesGrid/ResponsesGrid';

export async function loader({ params }: LoaderFunctionArgs): Promise<FullRequestData | null> {
  const { id } = params;
  if (typeof id !== 'string') throw new Error('Invalid request id.');
  const request = await requestServices.getSingleRequest(+id);

  return request;
}

export async function action({ params, request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const requestId = Number(params.id);
  const neighborhoodId = formData.get('neighborhoodId');
  const intent = formData.get('intent') as SingleRequestFormIntent;

  let response: Request | '' | null = null;

  if (intent === 'delete-request') {
    response = await requestServices.deleteRequest(requestId);
    return redirect(`/neighborhoods/${neighborhoodId}`);
  } else if (intent === 'close-request') {
    response = await requestServices.closeRequest(requestId);
  } else if (intent === 'accept-offer') {
    const responseId = formData.get('responseId');
    response = await responseServices.acceptResponse(String(responseId));
  } else if (intent === 'delete-response') {
    const responseId = formData.get('responseId');
    response = await responseServices.deleteResponse(String(responseId));
  } else if (intent === 'create-response') {
    const responseData = Object.fromEntries(formData) as unknown as ResponseData;
    responseData.request_id = Number(responseData.request_id);
    response = await responseServices.createResponse(responseData);
  }

  return response;
}

export default function SingleRequestPage() {
  const request = useLoaderData() as FullRequestData | null;
  if (!request) return null;

  return (
    <Container fluid>
      <RequestDescBox request={request} />
      <ResponsesGrid request={request}></ResponsesGrid>
    </Container>
  );
}
