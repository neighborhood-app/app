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
  UserRole,
} from "../../types";
import NeighborhoodPageForMembers from "./NeighborhoodPageForMembers";
import NeighborhoodPageForAdmin from "./NeighborhoodPageForAdmin";
import NeighborhoodPageForNonMembers from "./NeighborhoodPageForNonMembers";

function checkForNeighborhoodDetails(
  neighborhood: NeighborhoodDetailsForMembers | NeighborhoodDetailsForNonMembers
): neighborhood is NeighborhoodDetailsForMembers {
  return (neighborhood as NeighborhoodDetailsForMembers).admin !== undefined;
}

function checkLoggedUserRole(
  userName: string,
  neighborhood: NeighborhoodType
): UserRole {
  if (checkForNeighborhoodDetails(neighborhood)) {
    return neighborhood.admin.user_name === userName
      ? UserRole.ADMIN
      : UserRole.MEMBER;
  } else {
    return UserRole["NON-MEMBER"];
  }
}

export async function loader({ params }: LoaderFunctionArgs) {
  // TODO: If unable to login because of token invalid or otherwise
  // redirect to /login

  const { id } = params;
  // TODO: provide type for neighborhood.
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
  const user = useUser(); // Here we only need the username, we can easily access it from localStorage
  // context seems to be overengineered solution to a simple problem

  const neighborhood = useLoaderData() as NeighborhoodType;

  const userRole = checkLoggedUserRole(user.username, neighborhood);

  if (userRole === UserRole.MEMBER) {
    return (
      <NeighborhoodPageForMembers
        neighborhood={neighborhood as NeighborhoodDetailsForMembers}
      />
    );
  } else if (userRole === UserRole.ADMIN) {
    return (
      <NeighborhoodPageForAdmin
        neighborhood={neighborhood as NeighborhoodDetailsForMembers}
      />
    );
  } else {
    return <NeighborhoodPageForNonMembers neighborhood={neighborhood} />;
  }
}
