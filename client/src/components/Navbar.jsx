import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 text-white bg-blue-600">
      {/* Left: Brand */}
      <Link to="/" className="text-xl font-bold">
        Academic Cloud Locker
      </Link>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {!user && (
          <>
            <Link
              to="/login"
              className="px-4 py-2 transition rounded hover:bg-blue-700"
            >
              Login
            </Link>
            <Link
              to="/verify"
              className="px-4 py-2 transition border border-white rounded hover:bg-white hover:text-blue-600"
            >
              Verify
            </Link>
          </>
        )}

        {user && (
          <button
            onClick={handleLogout}
            className="px-4 py-2 transition bg-red-500 rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
