import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Logo, Button } from "../utils/utilsIndex";
import ThemeToggleSwitch from "./ThemeToggler";
import { logout } from "../ReduxStore/auth";

function Header() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.auth.isAuthenticated);

  const navItems = [
    {
      label: "Home",
      path: "/",
      active: true,
    },
    {
      label: "Creators",
      path: "/creator",
      active: state,
    },
    {
      label: "Addpost",
      path: "/postform",
      active: state,
    },
    {
      label: "Account",
      path: "/account",
      active: state,
    },
    {
      label: "Login",
      path: "/login",
      active: !state,
    },
    {
      label: "Sign Up",
      path: "/signup",
      active: !state,
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-blue-100/80 dark:bg-slate-800/80 backdrop-blur-md shadow-lg flex flex-row justify-between items-center px-6 py-4 w-full sticky top-0 z-50">
      {/* Left Section: Logo and Theme Toggle */}
      <div className="flex items-center gap-4">
        <Link to="/">
          <Logo className="w-10 h-10" />
        </Link>
        <ThemeToggleSwitch />
      </div>

      {/* Center Section: Navigation Links */}
      <ul className="hidden md:flex flex-row gap-6 items-center">
        {navItems.map(
          (item) =>
            item.active && (
              <li key={item.path}>
                <NavLink to={item.path}>
                  {({ isActive }) => (
                    <Button
                      content={item.label}
                      className={`${
                        isActive
                          ? "bg-blue-600 ring-4 ring-blue-400 text-white dark:bg-blue-500 dark:text-gray-200"
                          : "bg-transparent text-gray-800 dark:text-gray-300 hover:bg-blue-200 dark:hover:bg-blue-700"
                      } px-4 py-2 rounded-md transition duration-300`}
                    />
                  )}
                </NavLink>
              </li>
            )
        )}
      </ul>

     
      <div className="flex items-center gap-4">
        {state && (
          <Button
            onClick={handleLogout}
            content="Logout"
            className="bg-red-600 font-bold font-mono text-lg hover:bg-red-600  dark:hover:bg-red-700 active:bg-red-800 text-white px-4 py-2 rounded-md transition duration-300"
          />
        )}
      </div>

      {/* Mobile Navigation (Hidden on larger screens) */}
      <div className="md:hidden">
        <button className="text-gray-800 dark:text-gray-200 focus:outline-none">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>
    </nav>
  );
}

export default Header;
