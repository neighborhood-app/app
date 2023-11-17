import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { ResponseWithUser } from '@neighborhood/backend/src/types';
import { RequestWithUserAndResponses } from '../../types';
import styles from './ResponsesGrid.module.css';
import ResponseBox from '../ResponseBox/ResponseBox';

interface Props {
  request: RequestWithUserAndResponses;
}

export default function ResponsesGrid({ request }: Props) {
  const responseColumns =
    request.responses.map((response: ResponseWithUser) => (
      <ResponseBox response={response} requestOwnerId={request.user_id} key={response.id} />
    )) || [];

  const noResponsesText =
    request.status === 'OPEN'
      ? 'No one has responded yet. Be the first to help out!'
      : 'There are no responses to display.';

  return responseColumns.length !== 0 ? (
    <ResponsiveMasonry className="mt-4 mb-4 m-sm-3 p-2" columnsCountBreakPoints={{ 350: 1, 584: 2, 860: 3, 1084: 4, 1400: 5 }}>
      <Masonry gutter="1.5rem">{responseColumns}</Masonry>
    </ResponsiveMasonry>
  ) : (
    <p className={`${styles.noResponseText} mt-5`}>{noResponsesText}</p>
  );
}
