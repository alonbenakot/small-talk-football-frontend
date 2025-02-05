import LoggedInArea from "../logged-in-area/LoggedInArea.tsx";
import LoggedOutArea from "../logged-out-area/LoggedOutArea.tsx";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store.ts";

const AuthArea = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    user ? <LoggedInArea/> : <LoggedOutArea/>
  )
}
export default AuthArea;