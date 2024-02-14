import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { FaCartArrowDown } from "react-icons/fa";
import useCart from "../../../hooks/useCart";
// import useAdmin from "../../../hooks/useAdmin";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [cart] = useCart();
  // const [isAdmin] = useAdmin();

  const handleLogout = () => {
    logOut()
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  };
  const menuItems = (
    <>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/menu">Order Menu</Link>
      </li>
      <li>
        <Link to="/order">Order Food</Link>
      </li>
      {/* {user && isAdmin && (
        <li>
          <Link to="/dashboard/adminHome">Admin Home</Link>
        </li>
      )}
      {user && !isAdmin && (
        <li>
          <Link to="/dashboard/userHome">User Home</Link>
        </li>
      )} */}
      {!user ? (
        <li>
          <Link to="/login">Login</Link>
        </li>
      ) : (
        <li>
          <button onClick={handleLogout} className="btn btn-primary btn-sm">
            Logout
          </button>
        </li>
      )}
    </>
  );
  return (
    <div className="navbar fixed z-10 bg-black bg-opacity-40 max-w-screen-xl mx-auto text-white">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 text-black"
          >
            {menuItems}
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl">
          CRRR
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{menuItems}</ul>
      </div>
      <div className="navbar-end">
        {user && (
          <a className="text-white bg-indigo-700 px-3 py-1 rounded font-bold mx-3">
            {user?.displayName}
          </a>
        )}
        <Link to="/dashboard/myCart">
          <button className="btn">
            <FaCartArrowDown />

            <div className="badge badge-secondary">
              + {cart.length ? cart.length : 0}
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
