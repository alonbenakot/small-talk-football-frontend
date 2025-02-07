import Modal from "../../../components/modals/Modal.tsx";
import Input from "../../../components/input/Input.tsx";
import Button from "../../../components/button/Button.tsx";
import { FormProps } from "../user-form/UserForm.tsx";


const SignUpForm = ({isModalOpen, closeForm, handleSwitchForm}: FormProps) => {

  return (
    <Modal
      isOpen={ isModalOpen }
      onClose={ closeForm }
      className="w-full max-w-md mx-auto absolute top-20">
      <form>
        <h2 className="mb-2">Sign Up</h2>
        <Input label={ 'First Name' } id={ 'first-name' }/>
        <Input label={ 'Last Name' } id={ 'last-name' }/>
        <Input label={ 'Email' } id={ 'email' }/>
        <Input label={ 'Password' } id={ 'password' }/>
        <Input label={ 'Prior Football Knowledge' } id={ 'password' } checkbox/>
        <div className="flex justify-between">
          <Button buttonType='secondary' type='button' onClick={handleSwitchForm}>Already a member</Button>
          <div className="flex gap-2">
            <Button buttonType='primary' type='button' onClick={closeForm}>Cancel</Button>
            <Button buttonType='cta'>Submit</Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default SignUpForm;