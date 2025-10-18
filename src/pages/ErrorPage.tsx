import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router-dom";
import ErrorBlock from "../components/ui/error-block/ErrorBlock.tsx";
import Button from "../components/ui/button/Button.tsx";

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate()

  let title = "Something went wrong";
  let message = "An unexpected error occurred.";

  // If it's a thrown Response (from loader/action)
  if (isRouteErrorResponse(error)) {
    title = `Error ${ error.status }`;
    message = error.data || "Request failed.";
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <ErrorBlock title={ title } message={ message }/>
      <Button
        onClick={ () => navigate(-1) }
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        buttonType="primary"
      >
        Go Back
      </Button>
    </div>
  );
};

export default ErrorPage;
