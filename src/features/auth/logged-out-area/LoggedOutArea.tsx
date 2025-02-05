import Button from "../../../components/button/Button.tsx";
import User from "../models/User.ts";
import { useDispatch } from "react-redux";
import { login } from "../../../store/user-slice.ts";

const LoggedOutArea = () => {
  const dispatch = useDispatch();
  const user: User = {
    email: "alon@gmail.com",
    id: 0,
    firstName: "Alon ",
    lastName: "Benakot",
    priorFootballKnowledge: false
  };

  const handleLogin = () => {
    dispatch(login(user));
  }
  const handleSignUp = () => {
    dispatch(login(user));
  }

  return (
    <>
      <Button buttonType="cta" onClick={handleLogin}>Log In</Button>
      <Button buttonType="cta" onClick={handleSignUp}>Sign Up</Button>
    </>
  )
}
export default LoggedOutArea;