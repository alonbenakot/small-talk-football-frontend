import Button from "../../../components/button/Button.tsx";
import DialogModal from "../../../components/modals/Modal.tsx";
import { useState } from "react";

const LoggedOutArea = () => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isLoginForm, setIsLoginForm] = useState<boolean>(false);

  const handleLogin = () => {
    setIsOpenModal(true);
    setIsLoginForm(true);
  }
  const handleSignUp = () => {
    setIsOpenModal(true);
    setIsLoginForm(true);
  }

  return (
    <>
      <Button buttonType="cta" onClick={ handleLogin }>Log In</Button>
      <Button buttonType="cta" onClick={ handleSignUp }>Sign Up</Button>

      { isOpenModal &&
          <DialogModal
            isOpen={ isOpenModal }
            onClose={ () => setIsOpenModal(false) }
            className="w-full max-w-md mx-auto absolute top-20"
          >
            { isLoginForm ? 'Login' : 'Sign In' }
          </DialogModal>
      }

    </>
  )
}
export default LoggedOutArea;