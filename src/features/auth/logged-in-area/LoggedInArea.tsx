import Button from "../../../components/button/Button.tsx";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../store/user-slice.ts";
import { RootState } from "../../../store/store.ts";

const LoggedInArea = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  }
  return (
    <>
      <h4 className="text-slate-300">Hi { user?.firstName }</h4>
      <Button buttonType="primary" onClick={ handleLogout }>Logout</Button>
    </>
  )
}
export default LoggedInArea;