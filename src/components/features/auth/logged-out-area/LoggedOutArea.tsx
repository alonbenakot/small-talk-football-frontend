import Button from "../../../ui/button/Button.tsx";
import { useState } from "react";
import UserForm, { FormType } from "../user-form/UserForm.tsx";

const LoggedOutArea = () => {
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormType>('login');

  const handleLogin = () => {
    setFormType('login');
    setIsOpenForm(true);
  };

  const handleSignUp = () => {
    setFormType('signup');
    setIsOpenForm(true);
  };

  return (
    <>
      <Button buttonType="cta" onClick={ handleLogin }>
        Log In
      </Button>
      <Button buttonType="cta" onClick={ handleSignUp }>
        Sign Up
      </Button>
      { isOpenForm && (
        <UserForm
          initialFormType={ formType }
          isOpenModal={ isOpenForm }
          setIsOpenModal={ setIsOpenForm }
        />
      ) }
    </>
  );
};

export default LoggedOutArea;
