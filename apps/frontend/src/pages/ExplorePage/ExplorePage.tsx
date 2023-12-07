import { ActionFunctionArgs, LoaderFunctionArgs, useLoaderData } from 'react-router';
import { Neighborhood } from '@neighborhood/backend/src/types';
import neighborhoodsService from '../../services/neighborhoods';
import NeighborhoodSearch from '../../components/NeighborhoodSearch/NeighborhoodSearch';

const NEIGHBORHOODS_PER_PAGE = 12;

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  let cursor = url.searchParams.get("cursor");
  
  const neighborhoodsAndNext = await neighborhoodsService.getNeighborhoodsPerPage(
    NEIGHBORHOODS_PER_PAGE,
    cursor,
  );

  const { neighborhoods } = neighborhoodsAndNext;
  if (neighborhoods.length > 0) cursor = String(neighborhoods[neighborhoods.length - 1].id);
  console.log("the loader runs", { neighborhoods: neighborhoodsAndNext.neighborhoods.length, cursor });
  return { ...neighborhoodsAndNext, cursor };
}

export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const cursor = url.searchParams.get('cursor');
  const neighborhoodsAndNext = await neighborhoodsService.getNeighborhoodsPerPage(
    NEIGHBORHOODS_PER_PAGE,
    cursor,
  );

  console.log("the action runs");

  return neighborhoodsAndNext;
}

export default function ExplorePage() {
  const { neighborhoods, hasNextPage, cursor } = useLoaderData() as {
    neighborhoods: Neighborhood[];
    hasNextPage: boolean;
    cursor: string;
  };  

  console.log("this run", {cursor});
  
  return (
    <NeighborhoodSearch
      neighborhoods={neighborhoods}
      hasNextPage={hasNextPage}
      lastCursor={cursor}></NeighborhoodSearch>
  );
}
