import { useLoaderData, LoaderFunctionArgs } from 'react-router';
import { Neighborhood } from '@neighborhood/backend/src/types';
import neighborhoodsService from '../../services/neighborhoods';
import NeighborhoodSearch from '../../components/NeighborhoodSearch/NeighborhoodSearch';

export async function loader({ params }: LoaderFunctionArgs) {
  const data = params.cursor
    ? await neighborhoodsService.getAllNeighborhoods(Number(params.cursor))
    : await neighborhoodsService.getAllNeighborhoods();
  return data;
}

export default function ExplorePage() {
  const neighborhoodsData = useLoaderData() as {
    neighborhoods: Neighborhood[];
    currentCursor: number;
    hasNextPage: boolean;
  };

  const { neighborhoods, currentCursor, hasNextPage } = neighborhoodsData;

  return (
    <NeighborhoodSearch
      neighborhoods={neighborhoods}
      cursor={currentCursor}
      isNextPage={hasNextPage}></NeighborhoodSearch>
  );
}
