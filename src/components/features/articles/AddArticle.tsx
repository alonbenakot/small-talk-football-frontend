import Spinner from "../../ui/spinner/Spinner.tsx";
import Input from "../../ui/input/Input.tsx";
import Button from "../../ui/button/Button.tsx";
import { useAuthStore } from "../../../store/store.ts";
import useApi from "../../../utils/hooks/use-api.ts";
import User from "../auth/models/User.ts";
import { AddArticleInput } from "../../../utils/api/api-inputs.ts";
import { addArticle } from "../../../utils/api/http.ts";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import MessageBlock from "../../ui/message-block/MessageBlock.tsx";
import { useState } from "react";
import ErrorBlock from "../../ui/error-block/ErrorBlock.tsx";

type FormData = AddArticleInput;
const SUCCESS_MSG = "Your article was submitted and will be awaiting the approval of an admin.";

const AddArticle = () => {
  const {selectedUser} = useAuthStore();
  const {isLoading, error, invokeApi} = useApi<User, AddArticleInput>(addArticle);
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState<boolean>(false);
  const {register, handleSubmit, formState: {errors},} = useForm<FormData>({
    defaultValues: {
      title: "",
      author: `${ selectedUser?.firstName } ${ selectedUser?.lastName }`,
      text: ""
    }
  });



  const onSubmit = async (data: FormData) => {
    const success = await invokeApi(data);
    if (success) {
      setSubmitted(true);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 bg-white shadow-md rounded-2xl">
      <form onSubmit={ handleSubmit(onSubmit) }>
        <h1 className="mb-2 font-medium">Submit an Article</h1>

        { error && <ErrorBlock title="Submition Error" message={ error }/> }
        {submitted && <MessageBlock title="Success" message={SUCCESS_MSG}/>}
        { isLoading && <Spinner/> }

        <Input
          label="Title"
          id="title"
          type="text"
          // placeholder="yekutiel.cohen@gmail.com"
          { ...register('title', {
            required: 'Title is required',
            minLength: {
              value: 3,
              message: "Seems odd to have such a short title.",
            },
          }) }
          error={ errors.title?.message }
        />

        <Input
          label="Author"
          id="author"
          type="text"
          disabled={ true }
          { ...register('author', {
            required: 'Author is required',
            minLength: {
              value: 3,
              message: "Do you even have a syllable?",
            },
          }) }
          error={ errors.author?.message }
        />

        <Input
          label="Article"
          id="text"
          type="text"
          textarea
          { ...register('text', {
            required: 'You failed to do the basic thing of actually providing an article',
            minLength: {
              value: 200,
              message: "Please consider making your article longer. We do not accept half-baked articles.",
            },
          }) }
          error={ errors.text?.message }
        />

        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button buttonType="primary" type="button" onClick={ () => navigate(-1) }>
              Back
            </Button>
            <Button buttonType="cta" type="submit" disabled={ isLoading || !selectedUser || submitted}>
              Submit
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddArticle;