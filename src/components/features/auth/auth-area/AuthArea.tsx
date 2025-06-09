import LoggedInArea from "../logged-in-area/LoggedInArea.tsx";
import LoggedOutArea from "../logged-out-area/LoggedOutArea.tsx";
import { useAuthStore } from "../../../../store/store.ts";

const AuthArea = () => {
  const {selectedUser} = useAuthStore();

  return (
    selectedUser ? <LoggedInArea/> : <LoggedOutArea/>
  )
}
export default AuthArea;