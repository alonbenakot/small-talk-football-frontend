import Modal from "../../../components/modals/Modal.tsx";
import Input from "../../../components/input/Input.tsx";
import Button from "../../../components/button/Button.tsx";
import { FormProps } from "../user-form/UserForm.tsx";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../../../store/store.ts";

type FormData = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  priorFootballKnowledge: boolean,
}

const SignUpForm = ({isModalOpen, closeForm, handleSwitchForm}: FormProps) => {
  const {dispatchLogin} = useAuthStore();
  const {register, handleSubmit, formState: {errors}} = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      priorFootballKnowledge: false,
    }
  });

  const onSubmit = (data: FormData) => {
    console.log('Submitted data:', data);
    dispatchLogin({...data})
  }

  return (
    <Modal
      isOpen={ isModalOpen }
      onClose={ closeForm }
      className="w-full max-w-md mx-auto absolute top-20 max-h-[80vh] overflow-y-auto">
      <form onSubmit={ handleSubmit(onSubmit) }>
        <h2 className="mb-2 font-medium">Sign Up</h2>
        <Input label="First Name" id="firstName"
               { ...register("firstName", {required: "Please fill out your first name."}) }
               error={ errors.firstName?.message }
        />
        <Input label="Last Name" id="lastName"
               { ...register("lastName", {required: "Please fill out your last name."}) }
               error={ errors.lastName?.message }
        />
        <Input label="Email" id="email"
               { ...register('email', {
                 required: 'Email is required',
                 pattern: {
                   value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                   message: 'Enter a valid email address',
                 }
               }) }
               error={ errors.email?.message }
        />
        <p className="text-xs mb-2">We'll only share your email with third parties if they pay us.</p>
        <Input label="Password" id="password"
               { ...register("password", {
                 required: 'Dont\' be afraid to give us your password.',
                 minLength: {
                   value: 6,
                   message: 'We would feel more comfortable if your password had at least 6 characters.'
                 }
               }) }
               error={ errors.password?.message }
        />
        <Input label="Prior Football Knowledge" id="priorFootballKnowledge" checkbox
               { ...register("priorFootballKnowledge") }/>
        <div className="flex justify-between">
          <Button buttonType='secondary' type='button' onClick={ handleSwitchForm }>Already a member</Button>
          <div className="flex gap-2">
            <Button buttonType='primary' type='button' onClick={ closeForm }>Cancel</Button>
            <Button buttonType='cta'>Submit</Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default SignUpForm;