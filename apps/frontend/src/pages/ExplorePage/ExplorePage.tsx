import { useLoaderData, LoaderFunctionArgs } from 'react-router';
import { NeighborhoodsPerPage } from '@neighborhood/backend/src/types';
import neighborhoodsService from '../../services/neighborhoods';
import NeighborhoodSearch from '../../components/NeighborhoodSearch/NeighborhoodSearch';

export async function loader({ params }: LoaderFunctionArgs) {
  const data = params.cursor
    ? await neighborhoodsService.getNeighborhoods(Number(params.cursor))
    : await neighborhoodsService.getNeighborhoods();
  return data;
}

export default function ExplorePage() {
  const neighborhoodsData = useLoaderData() as NeighborhoodsPerPage;

  const { neighborhoods, currentCursor, hasNextPage } = neighborhoodsData;

  return (
    <NeighborhoodSearch
      neighborhoods={neighborhoods}
      cursor={currentCursor}
      isNextPage={hasNextPage}></NeighborhoodSearch>
  );
}
