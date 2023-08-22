import DescriptionBox from "../../components/DescriptionBox/DescriptionBox";
import MemberBox from "../../components/MemberBox/MemberBox";
import RequestBox from "../../components/RequestBox/RequestBox";
import neighborhoodsService from "../../services/neighborhoods";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  useLoaderData,
} from "react-router";
import createRequest from "../../services/requests";
import styles from "./SingleNeighborhoodPage.module.css";
import { useUser } from "../../store/user-context";
import {
  NeighborhoodDetailsForMembers,
  NeighborhoodDetailsForNonMembers,
  NeighborhoodType,
  RequestData,
} from "../../types";

function checkForNeighborhoodDetails(
  neighborhood: NeighborhoodDetailsForMembers | NeighborhoodDetailsForNonMembers
): neighborhood is NeighborhoodDetailsForMembers {
  return (neighborhood as NeighborhoodDetailsForMembers).admin !== undefined;
}

function checkLoggedUserRole(userName: string, neighborhood: NeighborhoodType): 'non-member' | 'member' | 'admin' {
  if (checkForNeighborhoodDetails(neighborhood)) {
    return neighborhood.admin.user_name === userName ? 'admin' : 'member';
  } else {
    return 'non-member';
  }
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  const neighborhood = await neighborhoodsService.getSingleNeighborhood(
    Number(id)
  );
  return neighborhood;
}

export async function action({ params, request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const requestData = Object.fromEntries(formData) as unknown as RequestData;
  requestData.neighborhoodId = Number(params.id);

  const response = await createRequest(requestData);
  return response;
}

export default function SingleNeighborhood() {
  const user = useUser();
  const neighborhood = useLoaderData() as NeighborhoodType;

  const userRole = checkLoggedUserRole(user.username, neighborhood);

  if ((userRole === 'member') && checkForNeighborhoodDetails(neighborhood)) {
    return (
      <div className={styles.wrapper}>
        <DescriptionBox
          showJoinBtn={false}
          showEditBtn={false}
          showLeaveBtn={true}
          name={neighborhood.name}
          description={neighborhood.description ? neighborhood.description : ""}
          users={neighborhood.users}
        />
        {/* <MemberBox
          showLeaveBtn={true}
          admin={neighborhood.admin as unknown as User}
          users={neighborhood.users as unknown as Array<User>}
        /> */}
        <RequestBox requests={neighborhood.requests} />
      </div>
    );
  } else if ((userRole === 'admin') && checkForNeighborhoodDetails(neighborhood)) {
    return (
      <div className={styles.wrapper}>
        <DescriptionBox
          showJoinBtn={false}
          showEditBtn={true}
          showLeaveBtn={false}
          name={neighborhood.name}
          description={neighborhood.description ? neighborhood.description : ""}
          users={neighborhood.users}
        />
        {/* <MemberBox
          showLeaveBtn={true}
          admin={neighborhood.admin as unknown as User}
          users={neighborhood.users as unknown as Array<User>}
        /> */}
        <RequestBox requests={neighborhood.requests} />
      </div>
    );
  } else {
    return (
      <div className={styles.wrapper}>
        <DescriptionBox
          showJoinBtn={true}
          showEditBtn={false}
          showLeaveBtn={false}
          name={neighborhood.name}
          description={neighborhood.description ? neighborhood.description : ""}
        />
      </div>
    );
  }
}
