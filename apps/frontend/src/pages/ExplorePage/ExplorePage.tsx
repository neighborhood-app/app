import { ActionFunctionArgs, LoaderFunctionArgs, useLoaderData } from 'react-router';
import { Neighborhood } from '@neighborhood/backend/src/types';
import neighborhoodsService from '../../services/neighborhoods';
import NeighborhoodSearch from '../../components/NeighborhoodSearch/NeighborhoodSearch';

const NEIGHBORHOODS_PER_PAGE = 12;

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor");
  console.log(cursor);
  
  const neighborhoodsAndNext = await neighborhoodsService.getNeighborhoodsPerPage(
    NEIGHBORHOODS_PER_PAGE,
    cursor,
  );

  // console.log("the loader runs", neighborhoodsAndNext);

  return neighborhoodsAndNext;
}

export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const cursor = url.searchParams.get('cursor');
  const neighborhoodsAndNext = await neighborhoodsService.getNeighborhoodsPerPage(
    NEIGHBORHOODS_PER_PAGE,
    cursor,
  );

  // console.log("the action runs", neighborhoodsAndNext);

  return neighborhoodsAndNext;
}

export default function ExplorePage() {
  const { neighborhoods, hasNextPage } = useLoaderData() as {
    neighborhoods: Neighborhood[];
    hasNextPage: boolean;
  };

  return (
    <NeighborhoodSearch
      neighborhoods={neighborhoods}
      hasNextPage={hasNextPage}></NeighborhoodSearch>
  );
}
