import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col justify-center items-center text-center p-4">
      <h1 className="text-4xl text-emerald-700 font-bold mb-2">404 - Not Found</h1>
      <p className="text-slate-300 mb-6">Sorry, we couldn’t find that page.</p>
      <Link to="/" className="text-blue-500 hover:underline">
        Go back home
      </Link>
    </div>
  );
};

export default NotFoundPage;