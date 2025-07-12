import { useAuthStore } from "../../store/store.ts";
import UserForm from "../features/auth/user-form/UserForm.tsx";
import * as React from "react";
import { useState } from "react";
import Button, { ButtonProps } from "./button/Button.tsx";

const ProtectedButton = ({onClick, ...rest}: ButtonProps) => {
  const {selectedUser} = useAuthStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!selectedUser) {
      e.preventDefault();
      setIsAuthModalOpen(true);
    } else {
      onClick?.(e);
    }
  };

  return (
    <>
      { isAuthModalOpen && (
        <UserForm
          initialFormType="login"
          isOpenModal={ isAuthModalOpen }
          setIsOpenModal={ () => setIsAuthModalOpen(false) }
        />
      ) }
      <Button onClick={ handleClick } { ...rest } />
    </>
  );
};

export default ProtectedButton;
