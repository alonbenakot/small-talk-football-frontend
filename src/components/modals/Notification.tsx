import Modal from "./Modal.tsx";
import Button from "../button/Button.tsx";

type Props = {
  isModalOpen: boolean,
  onClose: () => void,
  title: string,
  text: string
}
const Notification = ({isModalOpen, onClose, title, text}: Props) => {
  return (
    <Modal
      isOpen={ isModalOpen }
      onClose={ onClose }
      className="max-w-sm mx-auto absolute top-20 bg-yellow-300/70"
      closeOnOutsideClick>
      <h3 className="mb-2 font-medium">{ title }</h3>
      <p className="mb-4 font-light">{ text }</p>
      <Button buttonType="primary" onClick={ onClose }>
        Sorry
      </Button>
    </Modal>
  )
}

export default Notification;