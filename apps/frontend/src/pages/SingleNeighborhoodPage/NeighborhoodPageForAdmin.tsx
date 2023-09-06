import styles from "./SingleNeighborhoodPage.module.css";
import DescriptionBox from "../../components/DescriptionBox/DescriptionBox";
import RequestBox from "../../components/RequestBox/RequestBox";
import { NeighborhoodDetailsForMembers } from "../../types";

const NeighborhoodPageForAdmin = (props: {
  neighborhood: NeighborhoodDetailsForMembers;
}) => {
  const neighborhood = props.neighborhood;

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
};

export default NeighborhoodPageForAdmin;
