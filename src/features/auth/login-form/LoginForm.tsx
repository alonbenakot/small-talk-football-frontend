import { useForm } from 'react-hook-form';
import Modal from '../../../components/ui/modals/Modal';
import Input from '../../../components/ui/input/Input';
import Button from '../../../components/ui/button/Button';
import { FormProps } from '../user-form/UserForm';
import { useAuthStore } from "../../../store/store.ts";
import User from "../models/User.ts";
import useApi from "../../../utils/hooks/use-api.ts";
import { login } from "../../../utils/api/http.ts";
import ErrorBlock from "../../../components/ui/error-block/ErrorBlock.tsx";
import Loader from "../../../components/ui/loader/Loader.tsx";
import { useEffect } from "react";
import { LoginInput } from "../../../utils/api/api-inputs.ts";
import PasswordInput from "../../../components/ui/password-input/PasswordInput.tsx";

type FormData = LoginInput;

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
      await invokeLoginApi(data);
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

            <PasswordInput
              placeholder="123456"
              { ...register("password", {
                required: "Don't be afraid to give us your password.",
                minLength: {
                  value: 6,
                  message: "No way your password has less than 6 characters.",
                },
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
              <Button buttonType="cta" type="submit" disabled={ isLoading }>
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
