import { redirect } from "react-router-dom";
import { deleteStoredUser } from "../utils/auth";

export function loader() {
  deleteStoredUser();

  return redirect("/login");
}
