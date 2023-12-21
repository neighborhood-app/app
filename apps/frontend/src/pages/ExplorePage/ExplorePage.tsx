import { useLoaderData, LoaderFunctionArgs } from 'react-router';
import { NeighborhoodsPerPage } from '@neighborhood/backend/src/types';
import neighborhoodsService from '../../services/neighborhoods';
import NeighborhoodSearch from '../../components/NeighborhoodSearch/NeighborhoodSearch';

export async function loader({ params }: LoaderFunctionArgs) {
  const data = await neighborhoodsService.getNeighborhoods(Number(params.cursor) || undefined);
  return data;
}

export default function ExplorePage() {
  const { neighborhoods, newCursor, hasNextPage } = useLoaderData() as NeighborhoodsPerPage;

  return (
    <NeighborhoodSearch
      neighborhoods={neighborhoods}
      cursor={newCursor}
      isNextPage={hasNextPage}></NeighborhoodSearch>
  );
}
