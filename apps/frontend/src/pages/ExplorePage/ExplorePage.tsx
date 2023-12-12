import { ActionFunctionArgs, LoaderFunctionArgs, useLoaderData } from 'react-router';
import { Neighborhood } from '@neighborhood/backend/src/types';
import neighborhoodsService from '../../services/neighborhoods';
import NeighborhoodSearch from '../../components/NeighborhoodSearch/NeighborhoodSearch';

const NEIGHBORHOODS_PER_PAGE = '12';

// provide the cursor and first batch of nhoods
//  -set cursor to the id of the last neighborhood in the results
//  -limit is 12

export async function loader({ request }: LoaderFunctionArgs) {
  const searchParams: { cursor?: string } = Object.fromEntries(new URL(request.url).searchParams);
  // eslint-disable-next-line prefer-destructuring
  const cursor = searchParams.cursor;
  
  // let cursor = null;
  const neighborhoodsAndNext =
    await neighborhoodsService.getNeighborhoodsPerPage(NEIGHBORHOODS_PER_PAGE, cursor);

  // console.log({ neighborhoodsAndNext });

  const { neighborhoods } = neighborhoodsAndNext;
  const newCursor: number | undefined = neighborhoods[neighborhoods.length - 1]?.id;
  // if (neighborhoods.length > 0) cursor = String(neighborhoods[neighborhoods.length - 1].id);
  // console.log('the loader runs', {
  //   cursor, newCursor
  // });

  return {
    neighborhoods,
    cursor: newCursor ? String(newCursor) : newCursor,
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
  
  const newCursor = String(neighborhoods[neighborhoods.length - 1]?.id);
  console.log('action', neighborhoods, newCursor);

  // console.log('the action runs', neighborhoodsAndNext.hasNextPage);

  return { neighborhoods, hasNextPage: neighborhoodsAndNext.hasNextPage, newCursor };
}

export default function ExplorePage() {
  const { neighborhoods, hasNextPage, cursor } = useLoaderData() as {
    neighborhoods: Neighborhood[];
    hasNextPage: boolean;
    cursor: string;
  };

  console.log('the component is rendered', {cursor, neighborhoods});

  return (
    <NeighborhoodSearch
      neighborhoods={neighborhoods}
      hasNextPage={hasNextPage}
      lastCursor={cursor}></NeighborhoodSearch>
  );
}
