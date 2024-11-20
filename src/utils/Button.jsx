import React from "react";

function Button({ content="Submit", className,textColor="text-white" , ...props }) {
  return (
    <>
      <button
     
        {...props}
        className={`bg-blue-500 px-5 py-3 ${textColor} font-medium hover:bg-blue-600 active:bg-blue-800 active:ring-1 active:ring-blue-900 rounded-lg ${className}`}
      >
        {content}
      </button>
    </>
  );
}

export default Button;
