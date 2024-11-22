import React from "react";

function Button({
  content = "Submit",
  className = "",
  textColor = "text-white",
  variant = "primary", // primary, secondary, outline
  size = "md", // sm, md, lg
  ...props
}) {
  const baseStyles = `rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-300 ease-in-out transform active:scale-95`;

  const variants = {
    primary: `bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 text-white`,
    secondary: `bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 active:bg-gray-400 dark:active:bg-gray-500 text-gray-800 dark:text-gray-200`,
    outline: `border border-blue-500 dark:border-blue-400 text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 hover:text-white`,
  };

  const sizes = {
    sm: `px-4 py-2 text-sm`,
    md: `px-5 py-3 text-base`,
    lg: `px-6 py-4 text-lg`,
  };

  const finalClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button {...props} className={content =="Logout" ? className : finalClassName}>
      {content}
    </button>
  );
}

export default Button;
