import { useAuthStore } from "../../../store/store.ts";
import UserForm from "../../features/auth/user-form/UserForm.tsx";
import * as React from "react";
import { useState, useCallback, useEffect, useRef } from "react";
import Button, { ButtonProps } from "./Button.tsx";

const ProtectedButton = ({onClick, ...rest}: ButtonProps) => {
  const {selectedUser} = useAuthStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const pendingClickRef = useRef<React.MouseEvent<HTMLButtonElement> | null>(null);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  // Trigger the pending click when user becomes logged in
  useEffect(() => {
    if (selectedUser && pendingClickRef.current && !isAuthModalOpen) {
      onClick?.(pendingClickRef.current);
      pendingClickRef.current = null;
    }
  }, [selectedUser, onClick, isAuthModalOpen]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!selectedUser) {
      e.preventDefault();
      pendingClickRef.current = e;
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
          setIsOpenModal={ closeAuthModal }
        />
      ) }
      <Button onClick={ handleClick } { ...rest } />
    </>
  );
};

export default ProtectedButton;