import { useLoaderData } from 'react-router';
import neighborhoodsService from '../../services/neighborhoods';
import { NeighborhoodType } from '../../types';

export async function loader() {
  const neighborhoods = await neighborhoodsService.getAllNeighborhoods();
  return neighborhoods;
}

export default function Neighborhoods() {
  const neighborhoods = useLoaderData() as Array<NeighborhoodType>;

  const neighborhoodList = neighborhoods.map((neighborhood) => <li>{neighborhood.name}</li>);
  return <ul>{neighborhoodList}</ul>;
}
