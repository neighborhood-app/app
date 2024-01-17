import { ActionFunctionArgs, LoaderFunctionArgs, useLoaderData } from 'react-router';
import { Request, CreateRequestData } from '@neighborhood/backend/src/types';
import notificationService from '../../services/notifications';
import neighborhoodService from '../../services/neighborhoods';
import requestService from '../../services/requests';
import {
  EditNeighborhoodData,
  ErrorObj,
  NeighborhoodDetailsForMembers,
  NeighborhoodType,
  SingleNeighborhoodFormIntent,
  UserRole,
} from '../../types';
import NeighborhoodPageForMembers from './NeighborhoodPageForMembers';
import NeighborhoodPageForAdmin from './NeighborhoodPageForAdmin';
import NeighborhoodPageForNonMembers from './NeighborhoodPageForNonMembers';
import { getStoredUser } from '../../utils/auth';

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  const neighborhood = await neighborhoodService.getSingleNeighborhood(Number(id));

  return neighborhood;
}

export async function action({ params, request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const neighborhoodId = Number(params.id);

  const intent = formData.get('intent') as SingleNeighborhoodFormIntent;
  formData.delete('intent');
  // We should consider only returning success/error objects from all routes
  // where we don't need the new data
  let response: Request | Response | { success: string } | ErrorObj | null = null;

  if (intent === 'create-request') {
    const requestData = Object.fromEntries(formData) as unknown as CreateRequestData;
    requestData.neighborhood_id = neighborhoodId;
    response = await requestService.createRequest(requestData);
  } else if (intent === 'join-neighborhood') {
    response = await notificationService.joinNeighborhood(neighborhoodId);
  } else if (intent === 'leave-neighborhood') {
    response = await neighborhoodService.leaveNeighborhood(neighborhoodId);
  } else if (intent === 'edit-neighborhood') {
    const neighborhoodData = Object.fromEntries(formData) as unknown as EditNeighborhoodData;
    response = await neighborhoodService.editNeighborhood(neighborhoodId, neighborhoodData);
  } else if (intent === 'delete-neighborhood') {
    response = await neighborhoodService.deleteNeighborhood(neighborhoodId);
  }

  return response;
}

export default function SingleNeighborhood() {
  // Now we are planning to save userId in the localStorage. That is required to get userData from the backend.
  // I think checking whether user is admin or not can be slighly easier if we have access to userId.
  // We just want to check the role and not do type-narrowing for Neighborhood
  function checkLoggedUserRole(neighborhood: NeighborhoodType, username?: string): UserRole {
    const isNhoodMemberOrAdmin = (
      neighborhood: NeighborhoodType,
    ): neighborhood is NeighborhoodDetailsForMembers => Object.hasOwn(neighborhood, 'admin');

    if (isNhoodMemberOrAdmin(neighborhood)) {
      return neighborhood.admin.username === username ? UserRole.ADMIN : UserRole.MEMBER;
    }
    return UserRole['NON-MEMBER'];
  }

  const user = getStoredUser();
  const neighborhoodData = useLoaderData() as NeighborhoodType;

  // We are type-converting while passing `neighborhood` as argument
  // as `userRole` uniquely determines the type of `neighborhood`
  // I am not sure whether this is considered good practise or not
  const userRole: UserRole = checkLoggedUserRole(neighborhoodData, user?.username);

  if (userRole === UserRole['NON-MEMBER']) {
    return <NeighborhoodPageForNonMembers neighborhood={neighborhoodData} />;
  }

  if (userRole === UserRole.MEMBER) {
    return (
      <NeighborhoodPageForMembers
        neighborhood={neighborhoodData as NeighborhoodDetailsForMembers}
      />
    );
  }
  // This is the version for admins
  return (
    <NeighborhoodPageForAdmin neighborhood={neighborhoodData as NeighborhoodDetailsForMembers} />
  );
}
