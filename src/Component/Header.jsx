import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Logo, Button } from "../utils/utilsIndex";
import ThemeToggleSwitch from "./ThemeToggler";
import { logout } from "../ReduxStore/auth";

function Header() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.auth.isAuthenticated);
  console.log(state);

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
    console.log(state)
    dispatch(logout());
  };

  return (
    <>
      <nav className="bg-blue-100 flex flex-row z-20 justify-evenly dark:bg-slate-600 py-5 w-screen overflow-hidden flex-wrap rounded-t-xl sticky top-0">
        <section className="w-1/6 flex flex-row justify-between items-center">
          <Link to="/">
            <Logo />
          </Link>
          <ThemeToggleSwitch />
        </section>
        <section className="w-4/6 flex flex-row justify-evenly items-center">
          <ul className="w-full flex flex-row justify-evenly items-center">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.path}>
                    <NavLink to={item.path}>
                      {({ isActive }) => (
                        <Button
                          content={item.label}
                          className={isActive ? "dark:bg-blue-400 bg-gray-500 shadow-xl dark:shadow-blue-50 shadow-gray-700" : "bg-blue-600"}
                        />
                      )}
                    </NavLink>
                  </li>
                )
            )}
          </ul>
          {state && (
            <section className=" flex flex-row justify-end">
              <Button onClick={handleLogout} content="Logout" />
            </section>
          )}
        </section>
      </nav>
    </>
  );
}

export default Header;
