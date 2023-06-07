import { useLoaderData } from "react-router"

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