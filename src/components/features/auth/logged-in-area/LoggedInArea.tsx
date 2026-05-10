import Button from "../../../ui/button/Button.tsx";
import {useAuthStore} from "../../../../store/store.ts";
import {useNavigate} from "react-router-dom";
import {UserRole} from "../models/User.ts";

const LoggedInArea = () => {
  const {selectedUser, dispatchLogout} = useAuthStore();
  const navigate = useNavigate();
  const isAdmin = selectedUser?.role === UserRole.ADMIN;

  const handleNameClick = () => {
    if (isAdmin) {
      navigate('/admin');
    }
  };

  return (
    <>
      <h4 
        className={`text-slate-300 ${isAdmin ? 'cursor-pointer hover:text-emerald-400 transition-colors duration-200' : ''}`}
        onClick={handleNameClick}
      >
        Hi { selectedUser?.firstName }
      </h4>
      <Button buttonType="primary" onClick={ dispatchLogout }>Logout</Button>
    </>
  )
}
export default LoggedInArea;