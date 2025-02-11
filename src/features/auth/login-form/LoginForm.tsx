import { useForm } from 'react-hook-form';
import Modal from '../../../components/modals/Modal';
import Input from '../../../components/input/Input';
import Button from '../../../components/button/Button';
import { FormProps } from '../user-form/UserForm';
import { useAuthStore } from "../../../store/store.ts";
import User from "../models/User.ts";
import useApi from "../../../utils/hooks/use-api.ts";
import { login } from "../../../utils/http.ts";

type FormData = {
  email: string;
  password: string;
};

const LoginForm = ({isModalOpen, closeForm, handleSwitchForm}: FormProps) => {
  const {dispatchLogin} = useAuthStore();
  const {isLoading, error, fetchedData, triggerApi} = useApi(login, null, false);
  const {register, handleSubmit, formState: {errors},} = useForm<FormData>({
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = (data: FormData) => {
    console.log('Submitted data:', data);
    const user: User = {
      email: data.email,
      id: 0,
      firstName: 'Alon',
      priorFootballKnowledge: false,
      lastName: 'Benakot'
    }

    dispatchLogin(user);
  };

  return (
    <Modal
      isOpen={ isModalOpen }
      onClose={ closeForm }
      className="w-full max-w-md mx-auto absolute top-20"
    >
      <form onSubmit={ handleSubmit(onSubmit) }>
        <h1 className="mb-2 font-medium">Login</h1>

        <Input
          label="Email"
          id="email"
          type="email"
          placeholder="yekutiel.cohen@gmail.com"
          { ...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email address',
            },
          }) }
          error={ errors.email?.message }
        />

        <Input
          label="Password"
          id="password"
          type="password"
          placeholder="123456"
          { ...register('password',
            {
              required: 'Dont\' be afraid to give us your password.',
              minLength: {
                value: 6,
                message: 'We would feel more comfortable if your password had at least 6 characters.'
              }
            }) }
          error={ errors.password?.message }
        />

        <div className="flex justify-between">
          <Button buttonType="secondary" type="button" onClick={ handleSwitchForm }>
            Not a member
          </Button>
          <div className="flex gap-2">
            <Button buttonType="primary" type="button" onClick={ closeForm }>
              Cancel
            </Button>
            <Button buttonType="cta" type="submit">
              Submit
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default LoginForm;
