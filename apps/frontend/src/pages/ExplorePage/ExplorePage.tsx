import { useLoaderData, LoaderFunctionArgs, ActionFunctionArgs } from 'react-router';
import { Neighborhood, NeighborhoodsPerPage } from '@neighborhood/backend/src/types';
import neighborhoodsService from '../../services/neighborhoods';
import NeighborhoodSearch from '../../components/NeighborhoodSearch/NeighborhoodSearch';

export async function loader({ params }: LoaderFunctionArgs) {
  const data = await neighborhoodsService.getNeighborhoods(Number(params.cursor) || undefined);
  return data;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { searchTerm } = Object.fromEntries(formData) as unknown as { searchTerm: string };
  console.log({searchTerm});
  
  const filteredNeighborhoods: Neighborhood[] = await neighborhoodsService.filterByName(searchTerm);
  return filteredNeighborhoods;
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
