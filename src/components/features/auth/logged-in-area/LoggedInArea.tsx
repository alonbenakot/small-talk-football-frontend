import Button from "../../../ui/button/Button.tsx";
import { useAuthStore } from "../../../../store/store.ts";

const LoggedInArea = () => {
  const {selectedUser, dispatchLogout} = useAuthStore();

  return (
    <>
      <h4 className="text-slate-300">Hi { selectedUser?.firstName }</h4>
      <Button buttonType="primary" onClick={ dispatchLogout }>Logout</Button>
    </>
  )
}
export default LoggedInArea;