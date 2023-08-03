import DescriptionBox from "./components/DescriptionBox/DescriptionBox";
import MemberBox from "./components/MemberBox/MemberBox";
import RequestBox from "./components/RequestBox/RequestBox";
import neighborhoodsService from "../../services/neighborhoods";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  useLoaderData,
} from "react-router";
import createRequest from "../../services/requests";
import styles from "./neighborhood.module.css";
import {
  NeighborhoodDetailsForMembers,
  NeighborhoodDetailsForNonMembers,
  NeighborhoodType,
  User,
  RequestData,
} from "../../types";
import { useLoggedUser } from "../../utils/hooks";

function checkForNeighborhoodDetails(
  neighborhood: NeighborhoodDetailsForMembers | NeighborhoodDetailsForNonMembers
): neighborhood is NeighborhoodDetailsForMembers {
  return (neighborhood as NeighborhoodDetailsForMembers).admin !== undefined;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  const neighborhoods = await neighborhoodsService.getSingleNeighborhood(
    Number(id)
  );
  return neighborhoods;
}

export async function action({ params, request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const requestData = Object.fromEntries(formData) as unknown as RequestData;
  requestData.neighborhoodId = Number(params.id);

  const response = await createRequest(requestData);
  return response;
}

export default function Neighborhood() {
  let user = useLoggedUser();
  console.log(user);
  let neighborhood = useLoaderData() as NeighborhoodType;
  // We can get stored user through util/auth.js instead of useContext
  // const user = getStoredUser()

  if (checkForNeighborhoodDetails(neighborhood)) {
    return (
      <div className={styles.wrapper}>
        <DescriptionBox
          showJoinBtn={false}
          name={neighborhood.name}
          description={neighborhood.description ? neighborhood.description : ""}
        />
        <MemberBox
          showLeaveBtn={true}
          admin={neighborhood.admin as unknown as User}
          users={neighborhood.users as unknown as Array<User>}
        />
        <RequestBox requests={neighborhood.requests} />
      </div>
    );
  } else {
    return (
      <div className={styles.wrapper}>
        <DescriptionBox
          showJoinBtn={true}
          name={neighborhood.name}
          description={neighborhood.description ? neighborhood.description : ""}
        />
      </div>
    );
  }
}
