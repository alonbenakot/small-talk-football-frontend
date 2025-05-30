import { ReactNode, useRef } from "react";
import { createPortal } from "react-dom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  closeOnOutsideClick?: boolean
};

const DialogModal = ({isOpen, onClose, children, className, closeOnOutsideClick}: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const handleClickOutside = () => {
    if (closeOnOutsideClick) {
      onClose();
    }
  }


  return createPortal(
    <div
      onClick={ handleClickOutside }
      className={ `fixed top-0 bottom-0 left-0 right-0 bg-black/20 z-50 flex justify-center items-center` }
    >
      <dialog
        ref={ dialogRef }
        className={ `rounded-lg p-6 shadow-lg border border-gray-200 scrollbar-thumb-gray-400 scrollbar-track-gray-100 ${ className }` }
        open={ isOpen }
        onClick={ (e) => e.stopPropagation() }
      >
        <button
          onClick={ onClose }
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          &times;
        </button>
        <div className="text-gray-700">{ children }</div>
      </dialog>
    </div>,
    document.body
  );
};

export default DialogModal;
