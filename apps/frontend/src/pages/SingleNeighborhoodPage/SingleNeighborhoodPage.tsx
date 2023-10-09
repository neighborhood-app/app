import neighborhoodsService from '../../services/neighborhoods';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  useLoaderData,
} from 'react-router';
import requestServices from '../../services/requests';
import { useUser } from '../../store/user-context';
import {
  NeighborhoodDetailsForMembers,
  NeighborhoodDetailsForNonMembers,
  NeighborhoodType,
  RequestData,
  SingleNeighborhoodFormIntent,
  UserRole,
} from '../../types';
import NeighborhoodPageForMembers from './NeighborhoodPageForMembers';
import NeighborhoodPageForAdmin from './NeighborhoodPageForAdmin';
import NeighborhoodPageForNonMembers from './NeighborhoodPageForNonMembers';
import { Request } from '@prisma/client';

export async function loader({ params }: LoaderFunctionArgs) {
  // TODO: If unable to login because of token invalid or otherwise
  // redirect to /login
  // We can do this by sending request within a `try` block
  // While catching error, we can redirect
  // We will also need to modify `neighborhoodService.getSingleNeighborhood`
  // to throw an Error if request is unsuccessfull

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

  const intent = formData.get('intent') as SingleNeighborhoodFormIntent;
  // We should consider only returning success/error objects from all routes 
  // where we don't need the new data
  let response: Request | Response | { success: string } | { error: string } | null = null;

  if (intent === 'create-request') {
    response = await requestServices.createRequest(requestData);
  } else if (intent === 'join-neighborhood') {
    response = await neighborhoodsService.connectUserToNeighborhood(requestData.neighborhoodId);
  }

  return response;
}

export default function SingleNeighborhood() {
  // I have moved the function `checkLoggedUserRole` inside the component
  // to make the component self-contained
  // Please see if we can make this helper function uncluttered.
  // Now we are planning to save userId in the localStorage. That is required to get userData from the backend.
  // I think checking whether user is admin or not can be slighly easier if we have access to userId.
  // We just want to check the role and not do type-narrowing for Neighborhood
  function checkLoggedUserRole(
    userName: string,
    neighborhood: NeighborhoodType
  ): UserRole {
    function checkForNeighborhoodDetails(
      neighborhood:
        | NeighborhoodDetailsForMembers
        | NeighborhoodDetailsForNonMembers
    ): neighborhood is NeighborhoodDetailsForMembers {
      return (
        (neighborhood as NeighborhoodDetailsForMembers).admin !== undefined
      );
    }
    if (checkForNeighborhoodDetails(neighborhood)) {
      return neighborhood.admin.username === userName
        ? UserRole.ADMIN
        : UserRole.MEMBER;
    } else {
      return UserRole['NON-MEMBER'];
    }
  }

  // Here we only need the username, we can easily access it from localStorage
  // context seems to be overengineered solution to a simple problem
  const user = useUser();

  const neighborhoodData = useLoaderData() as NeighborhoodType;
  const userRole: UserRole = checkLoggedUserRole(
    user.username,
    neighborhoodData
  );

  // We are type-converting while passing `neighborhood` as argument
  // as `userRole` uniquely determines the type of `neighborhood`
  // I am not sure whether this is considered good practise or not
  if (userRole === UserRole.MEMBER) {
    return (
      <NeighborhoodPageForMembers
        neighborhood={neighborhoodData as NeighborhoodDetailsForMembers}
      />
    );
  } else if (userRole === UserRole.ADMIN) {
    return (
      <NeighborhoodPageForAdmin
        neighborhood={neighborhoodData as NeighborhoodDetailsForMembers}
      />
    );
  } else {
    return <NeighborhoodPageForNonMembers neighborhood={neighborhoodData} />;
  }
}
