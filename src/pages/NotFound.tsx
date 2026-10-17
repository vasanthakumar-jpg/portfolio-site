import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <Helmet>
        <title>Page not found | Vasanthakumar Portfolio</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <Link to="/" className="text-blue-500 hover:text-blue-700 underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
          Return to Home
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
