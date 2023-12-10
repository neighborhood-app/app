import { ActionFunctionArgs, useLoaderData } from 'react-router';
import { Neighborhood } from '@neighborhood/backend/src/types';
import neighborhoodsService from '../../services/neighborhoods';
import NeighborhoodSearch from '../../components/NeighborhoodSearch/NeighborhoodSearch';

const NEIGHBORHOODS_PER_PAGE = '12';

// provide the cursor and first batch of nhoods
//  -set cursor to the id of the last neighborhood in the results
//  -limit is 12

export async function loader() {
  let cursor = null;
  const neighborhoodsAndNext =
    await neighborhoodsService.getNeighborhoodsPerPage(NEIGHBORHOODS_PER_PAGE);

  // console.log({ neighborhoodsAndNext });

  const { neighborhoods } = neighborhoodsAndNext;
  if (neighborhoods.length > 0) cursor = String(neighborhoods[neighborhoods.length - 1].id);
  console.log('the loader runs', {
    neighborhoodsAndNext,
    cursor,
  });

  return {
    neighborhoods,
    cursor,
    hasNextPage: neighborhoodsAndNext.hasNextPage,
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const data = await request.formData();
  const cursor = Object.fromEntries(data) as unknown as { cursor: string };

  const neighborhoodsAndNext = await neighborhoodsService.getNeighborhoodsPerPage(
    NEIGHBORHOODS_PER_PAGE,
    cursor.cursor,
  );

  const { neighborhoods } = neighborhoodsAndNext;
  const newCursor = String(neighborhoods[neighborhoods.length - 1].id);

  console.log('the action runs', neighborhoodsAndNext, newCursor);

  return { neighborhoods, hasNextPage: neighborhoodsAndNext.hasNextPage, newCursor };
}

export default function ExplorePage() {
  const { neighborhoods, hasNextPage, cursor } = useLoaderData() as {
    neighborhoods: Neighborhood[];
    hasNextPage: boolean;
    cursor: string;
  };

  console.log('the component is rendered', cursor);

  return (
    <NeighborhoodSearch
      neighborhoods={neighborhoods}
      hasNextPage={hasNextPage}
      lastCursor={cursor}></NeighborhoodSearch>
  );
}
