import { useLoaderData } from 'react-router';
import { Neighborhood } from '@neighborhood/backend/src/types';
import neighborhoodsService from '../../services/neighborhoods';
import NeighborhoodSearch from '../../components/NeighborhoodSearch/NeighborhoodSearch';

export async function loader() {
  const neighborhoods: Neighborhood[] = await neighborhoodsService.getAllNeighborhoods();  
  return neighborhoods;
}

export default function ExplorePage() {
  const neighborhoods = useLoaderData() as Neighborhood[];

  // const neighborhoodList = neighborhoods.map(neighborhood => (
  //   <li key={neighborhood.id}>{neighborhood.name}</li>
  // ));

  return <NeighborhoodSearch neighborhoods={neighborhoods}></NeighborhoodSearch>
}
