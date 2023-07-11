import SearchFilterForm from "../../components/SearchFilterForm/SearchFilterForm";
import DescriptionBox from "../../components/DescriptionBox/DescriptionBox";
import MemberBox from "../../components/MemberBox/MemberBox";
import neighborhoodsService from '../../services/neighborhoods';
import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { Button } from "react-bootstrap"
import styles from "./neighborhood.module.css"
import { NeighborhoodDetailsForMembers} from "../../types";

export async function loader({params}: LoaderFunctionArgs) {
  const { id } = params;
  const neighborhoods = await neighborhoodsService.getSingleNeighborhood(Number(id));
  return neighborhoods;
}

export default function Neighborhood() {
  const neighborhood = useLoaderData() as NeighborhoodDetailsForMembers;
  
  return (
    <div className={styles.wrapper}>
      <DescriptionBox details={neighborhood}/>
      <MemberBox admin={neighborhood.admin} users={neighborhood.users}/>
      <SearchFilterForm />
      <div className={`${styles.column} ${styles.requestColumn}`}>
        <div className={styles.requestBox}>
          <div className={styles.requestHeader}>
            <p className={styles.author}>John Smith</p>
            <p>16.03.2023</p>
          </div>
          <p>I need help finding my cat</p>
          <Button className={styles.helpButton}>Offer help</Button>
        </div>
        <div className={styles.requestBox}>
          <div className={styles.requestHeader}>
            <p className={styles.author}>Sonny Crocket</p>
            <p>15.03.2023</p>
          </div>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad incidunt dignissimos praesentium obcaecati rerum ducimus laudantium exercitationem distinctio atque quaerat?</p>
          <Button className={styles.helpButton}>Offer help</Button>
        </div>
        <div className={styles.requestBox}>
          <div className={styles.requestHeader}>
            <p className={styles.author}>Gandalf the Grey</p>
            <p>04.03.2023</p>
          </div>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste, corporis!</p>
          <Button className={styles.helpButton}>Offer help</Button>
        </div>
      </div>
    </div>
  )
}