import { ActionFunctionArgs, LoaderFunctionArgs, useLoaderData } from 'react-router';
import { EditResponseData, Request, Response, ResponseData } from '@neighborhood/backend/src/types';
import { redirect } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import responseServices from '../../services/responses';
import requestServices from '../../services/requests';
import notificationServices from '../../services/notifications';
import RequestDescBox from '../../components/RequestDescBox/RequestDescBox';
import { EditRequestData, FullRequestData, SingleRequestFormIntent } from '../../types';
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

  let response: Request | Response | { error: string } | '' | null = null;

  switch (intent) {
    case 'edit-request': {
      const requestData = Object.fromEntries(formData) as unknown as EditRequestData;
      if ('intent' in requestData) delete requestData.intent;
      response = await requestServices.editRequest(requestData, requestId);
      break;
    }
    case 'delete-request':
      response = await requestServices.deleteRequest(requestId);
      return redirect(`/neighborhoods/${neighborhoodId}`);
    case 'close-request':
      response = await requestServices.closeRequest(requestId);
      break;
    case 'create-response': {
      const responseData = Object.fromEntries(formData) as unknown as ResponseData;
      responseData.request_id = Number(responseData.request_id);

      response = await responseServices.createResponse(responseData);
      notificationServices.receiveResponse(requestId).catch(console.error);
      break;
    }
    case 'edit-response': {
      const responseData = Object.fromEntries(formData) as unknown as EditResponseData;
      response = await responseServices.editResponse(String(responseData.id), responseData);
      break;
    }
    case 'delete-response': {
      const responseId = formData.get('responseId') as string;
      response = await responseServices.deleteResponse(responseId);
      break;
    }
    case 'accept-offer': {
      const responseId = formData.get('responseId') as string;
      response = await responseServices.acceptResponse(responseId);
      notificationServices.responseAccepted(requestId, +responseId).catch(console.error);
      break;
    }
    default: {
      const exhaustiveCheck: never = intent;
      throw new Error(`Invalid form intent: ${JSON.stringify(exhaustiveCheck)}`);
    }
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
