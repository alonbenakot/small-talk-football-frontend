import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
};

const DialogModal = ({ isOpen, onClose, title, children }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const modalContent = (
    <div  className="fixed inset-0 flex items-center justify-center">
      <dialog
        ref={dialogRef}
        className="rounded-lg p-6 shadow-lg bg-white w-full max-w-md border border-gray-200"
        open={isOpen}
      >
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none">&times;</button>
        </div>
        <div className="text-gray-700">{children}</div>
      </dialog>
    </div>
  );

  return isOpen ? createPortal(modalContent, document.body) : null;
};

export default DialogModal;
