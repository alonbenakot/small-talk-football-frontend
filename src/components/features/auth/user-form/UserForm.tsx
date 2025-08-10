import LoginForm from "../login-form/LoginForm.tsx";
import SignUpForm from "../signup-form/SignUpForm.tsx";
import { useState, useCallback } from "react";

export type FormType = 'login' | 'signup';

type Props = {
  initialFormType?: FormType;
  isOpenModal: boolean;
  setIsOpenModal: (isOpenModal: boolean) => void;
};

const UserForm = ({initialFormType = 'login', isOpenModal, setIsOpenModal}: Props) => {
  const [userFormType, setUserFormType] = useState<FormType>(initialFormType);

  const closeForm = useCallback(() => {
    setIsOpenModal(false);
  }, [setIsOpenModal]);

  const switchForm = useCallback(() =>
    setUserFormType((prevState: FormType) =>
      prevState === 'login' ? 'signup' : 'login'), []);

  return (
    <>
      { userFormType === 'login' && (
        <LoginForm
          isModalOpen={ isOpenModal }
          closeForm={ closeForm }
          handleSwitchForm={ switchForm }
        />
      ) }

      { userFormType === 'signup' && (
        <SignUpForm
          isModalOpen={ isOpenModal }
          closeForm={ closeForm }
          handleSwitchForm={ switchForm }
        />
      ) }
    </>
  );
};

export type FormProps = {
  isModalOpen: boolean,
  closeForm: () => void,
  handleSwitchForm: () => void;
}

export default UserForm;