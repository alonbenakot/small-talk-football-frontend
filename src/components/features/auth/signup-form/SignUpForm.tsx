import Modal from "../../../ui/modals/Modal.tsx";
import Input from "../../../ui/input/Input.tsx";
import Button from "../../../ui/button/Button.tsx";
import {FormProps} from "../user-form/UserForm.tsx";
import {useForm} from "react-hook-form";
import {useAuthStore, useLangStore} from "../../../../store/store.ts";
import useApi from "../../../../utils/hooks/use-api.ts";
import {SignUpInput} from "../../../../utils/api/api-inputs.ts";
import User from "../models/User.ts";
import {signUp} from "../../../../utils/api/http.ts";
import Spinner from "../../../ui/spinner/Spinner.tsx";
import ErrorBlock from "../../../ui/error-block/ErrorBlock.tsx";
import {useEffect} from "react";
import PasswordInput from "../../../ui/password-input/PasswordInput.tsx";
import {COUNTRY_CODES, Lang, LANGUAGE_LABELS} from "../../language/Lang.ts";
import Flag from "react-flagkit";

type FormData = SignUpInput;

const SignUpForm = ({isModalOpen, closeForm, handleSwitchForm}: FormProps) => {
  const {dispatchLogin, selectedUser} = useAuthStore();
  const {dispatchToggleLang} = useLangStore();
  const {isLoading, error, fetchedData, invokeApi: invokeSignUpApi} = useApi<User, SignUpInput>(signUp);
  const {register, handleSubmit, formState: {errors}} = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      priorFootballKnowledge: false,
      userIndications: {
        preferredLanguage: Lang.BRITISH,
      }
    }
  });

  useEffect(() => {
    console.log('SignUpForm useEffect triggered:', { 
      hasFetchedData: !!fetchedData, 
      hasError: !!error, 
      hasSelectedUser: !!selectedUser,
      preferredLang: fetchedData?.data?.userIndications?.preferredLanguage 
    });
    
    if (fetchedData && !error && !selectedUser) {
      console.log('Dispatching login and language change');
      dispatchLogin({...fetchedData.data, jwt: fetchedData.jwt});
      dispatchToggleLang(fetchedData.data.userIndications?.preferredLanguage);
      closeForm();
    }
  }, [fetchedData, error, selectedUser, closeForm, dispatchLogin, dispatchToggleLang]);

  const onSubmit = async (data: FormData) => {
    await invokeSignUpApi(data);
  }

  return (
    <Modal
      isOpen={ isModalOpen }
      onClose={ closeForm }
      className="w-full max-w-md mx-auto absolute top-20 max-h-[80vh] overflow-y-auto">
      <form onSubmit={ handleSubmit(onSubmit) }>
        <h2 className="mb-2 font-medium">Sign Up</h2>
        { isLoading && <Spinner/> }
        { selectedUser && !fetchedData &&
          <ErrorBlock title="You are already logged in" message="Let's not overcomplicate things."/> }
        { error && <ErrorBlock title="SignUp Error" message={ error }/> }

        <Input
          label="First Name"
          id="firstName"
          { ...register("firstName", {required: "Please fill out your first name."}) }
          error={ errors.firstName?.message }
        />

        <Input
          label="Last Name"
          id="lastName"
          { ...register("lastName", {required: "Please fill out your last name."}) }
          error={ errors.lastName?.message }
        />

        <Input
          label="Email"
          id="email"
          type="email"
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

        <PasswordInput
          { ...register("password", {
            required: 'Dont\' be afraid to give us your password.',
            minLength: {
              value: 6,
              message: 'We would feel more comfortable if your password had at least 6 characters.'
            }
          }) }
          error={ errors.password?.message }
        />

        <div className="mb-4">
          <label htmlFor="preferredLanguage" className="block text-sm font-medium mb-2">
            Preferred Language
          </label>
          <div className="flex gap-2">
            {Object.values(Lang).map((lang) => (
              <label
                key={lang}
                className="flex-1 flex items-center justify-center gap-2 p-3 border-2 rounded-md cursor-pointer transition-colors has-[:checked]:border-emerald-600 has-[:checked]:bg-emerald-50 hover:border-emerald-400"
              >
                <input
                  type="radio"
                  value={lang}
                  {...register("userIndications.preferredLanguage", { required: "Please select your preferred language" })}
                  className="sr-only"
                />
                <Flag country={COUNTRY_CODES[lang]} className="w-6 h-4" />
                <span className="text-sm">{LANGUAGE_LABELS[lang]}</span>
              </label>
            ))}
          </div>
          {errors.userIndications?.preferredLanguage && (
            <p className="text-red-500 text-xs mt-1">{errors.userIndications.preferredLanguage.message}</p>
          )}
        </div>

        <Input label="Prior Football Knowledge" id="priorFootballKnowledge" checkbox
               { ...register("priorFootballKnowledge") }/>

        <div className="flex justify-between">
          <Button buttonType='secondary' type='button' onClick={ handleSwitchForm }>Already a member</Button>
          <div className="flex gap-2">
            <Button buttonType='primary' type='button' onClick={ closeForm }>Cancel</Button>
            <Button buttonType='cta' disabled={ isLoading || !!selectedUser }>Sign Up</Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default SignUpForm;