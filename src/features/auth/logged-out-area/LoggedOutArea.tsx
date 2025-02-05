import Button from "../../../components/button/Button.tsx";
import User from "../models/User.ts";
import { useDispatch } from "react-redux";
import DialogModal from "../../../components/modals/Modal.tsx";
import { useState } from "react";

const LoggedOutArea = () => {
  const dispatch = useDispatch();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isLoginForm, setIsLoginForm] = useState<boolean>(false);

  const user: User = {
    email: "alon@gmail.com",
    id: 0,
    firstName: "Alon ",
    lastName: "Benakot",
    priorFootballKnowledge: false
  };

  const handleLogin = () => {
    // dispatch(login(user));
    setIsOpenModal(true);
    setIsLoginForm(true);
  }
  const handleSignUp = () => {
    setIsOpenModal(true);
    setIsLoginForm(true);
    // dispatch(login(user));
  }

  return (
    <>
      <Button buttonType="cta" onClick={ handleLogin }>Log In</Button>
      <Button buttonType="cta" onClick={ handleSignUp }>Sign Up</Button>

      { isOpenModal && <DialogModal
        isOpen={ isOpenModal }
        onClose={ () => setIsOpenModal(false) }
        title="Login"
      >h

      </DialogModal> }
    </>
  )
}
export default LoggedOutArea;