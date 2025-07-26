import Modal from "./Modal.tsx";

type Props = {
  isModalOpen: boolean;
  onClose: () => void;
  title: string;
  text: string;
  children?: React.ReactNode;
};

const Notification = ({isModalOpen, onClose, title, text, children}: Props) => {
  return (
    <Modal
      isOpen={ isModalOpen }
      onClose={ onClose }
      className="max-w-sm mx-auto absolute top-20"
      closeOnOutsideClick
    >

      <h3 className="mb-2 font-medium">{ title }</h3>
      <p className="mb-4 font-light">{ text }</p>
      <div className="flex gap-2">{ children }</div>

    </Modal>
  );
};

export default Notification;
