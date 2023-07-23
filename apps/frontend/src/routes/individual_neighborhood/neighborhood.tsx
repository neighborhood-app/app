import DescriptionBox from "../../components/DescriptionBox/DescriptionBox";
import MemberBox from "../../components/MemberBox/MemberBox";
import RequestBox from "../../components/RequestBox/RequestBox";
import neighborhoodsService from '../../services/neighborhoods';
import { LoaderFunctionArgs, useLoaderData, useOutletContext } from "react-router";

import styles from "./neighborhood.module.css"
import { NeighborhoodDetailsForMembers, User } from "../../types";


export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  const neighborhoods = await neighborhoodsService.getSingleNeighborhood(Number(id));
  return neighborhoods;
}

export default function Neighborhood() {
  const neighborhood = useLoaderData() as NeighborhoodDetailsForMembers;
  //Ask how to represent two types???
  //@ts-ignore  
  const [userContext, setUserContext] = useOutletContext();
  console.log(userContext);

  
  return (
    <div className={styles.wrapper}>
      <DescriptionBox name={neighborhood.name} description={neighborhood.description ? neighborhood.description : ''} />
      <MemberBox admin={neighborhood.admin as unknown as User} users={neighborhood.users as unknown as Array<User>} />
      <RequestBox requests={neighborhood.requests}/>
    </div>
  )
}