import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-xl p-10 text-center bg-white rounded-lg shadow-md">
        <h1 className="mb-4 text-3xl font-bold text-blue-600">
          Academic Cloud Locker
        </h1>

        <p className="mb-8 text-gray-600">
          Securely store, access, and verify academic marksheets and
          certificates anytime, anywhere.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/login"
            className="px-6 py-3 text-white transition bg-blue-600 rounded hover:bg-blue-700"
          >
            Login
          </Link>

          <Link
            to="/verify"
            className="px-6 py-3 text-blue-600 transition border border-blue-600 rounded hover:bg-blue-50"
          >
            Verify Document
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
