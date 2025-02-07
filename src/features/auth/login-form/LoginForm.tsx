import Modal from "../../../components/modals/Modal.tsx";
import Input from "../../../components/input/Input.tsx";
import Button from "../../../components/button/Button.tsx";
import { FormProps } from "../user-form/UserForm.tsx";

const LoginForm = ({isModalOpen, closeForm, handleSwitchForm}: FormProps) => {

  return (
    <Modal
      isOpen={ isModalOpen }
      onClose={ closeForm }
      className="w-full max-w-md mx-auto absolute top-20">
      <form>
        <h2 className="mb-2">Login</h2>
        <Input label={ 'Email' } id={ 'email' }/>
        <Input label={ 'Password' } id={ 'password' }/>
        <div className="flex justify-between">
          <Button buttonType='secondary' type='button' onClick={handleSwitchForm}>Not a member</Button>
          <div className="flex gap-2">
            <Button buttonType='primary' type='button' onClick={closeForm}>Cancel</Button>
            <Button buttonType='cta'>Submit</Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default LoginForm;