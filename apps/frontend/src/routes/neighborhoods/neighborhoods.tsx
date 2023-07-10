import { useLoaderData } from "react-router";
import neighborhoodsService from '../../services/neighborhoods';

export async function loader() {
    const neighborhoods = await neighborhoodsService.getAllNeighborhoods();
    return neighborhoods;
}

export default function Neighborhoods() {
    const neighborhoods = useLoaderData();
    //@ts-ignore
    const neighborhoodList = neighborhoods.map(neighborhood => {
        return <li>{neighborhood.name}</li>
    })
    return (
        <ul>
            {neighborhoodList}
        </ul>
    )
}