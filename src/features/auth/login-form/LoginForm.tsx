import { useForm } from 'react-hook-form';
import Modal from '../../../components/modals/Modal';
import Input from '../../../components/input/Input';
import Button from '../../../components/button/Button';
import { FormProps } from '../user-form/UserForm';
import { useAuthStore } from "../../../store/store.ts";
import User, { LoginInput } from "../models/User.ts";
import useApi from "../../../utils/hooks/use-api.ts";
import { login } from "../../../utils/http.ts";
import ErrorBlock from "../../../components/error-block/ErrorBlock.tsx";
import Loader from "../../../components/loader/Loader.tsx";
import { useEffect } from "react";

type FormData = {
  email: string;
  password: string;
};

const LoginForm = ({isModalOpen, closeForm, handleSwitchForm}: FormProps) => {
    const {dispatchLogin} = useAuthStore();
    const {isLoading, error, fetchedData, invokeApi: invokeLoginApi} = useApi<User, LoginInput>(login);
    const {register, handleSubmit, formState: {errors},} = useForm<FormData>({
      defaultValues: {
        email: "",
        password: ""
      }
    });

    useEffect(() => {
        if (fetchedData && !error) {
          dispatchLogin({...fetchedData.data, jwt: fetchedData.jwt});
          closeForm();
        }

      }, [fetchedData, error, closeForm, dispatchLogin]
    );

    const onSubmit = async (data: FormData) => {
      const loginInput: LoginInput = {
        email: data.email,
        password: data.password
      }
      await invokeLoginApi(loginInput);
    };

    return (
      <Modal
        isOpen={ isModalOpen }
        onClose={ closeForm }
        className="w-full max-w-md mx-auto absolute top-20"
      >
        <form onSubmit={ handleSubmit(onSubmit) }>
          <h1 className="mb-2 font-medium">Login</h1>
          { error && <ErrorBlock title="Failed to Login" message={ error }/> }
          { isLoading && <Loader/> }

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
                  message: 'Now way your password has less least 6 characters.'
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
                Login
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    );
  }
;

export default LoginForm;
