import React from "react";
import "./Stylish404.css";

export interface Stylish404Props {
  title: string;
  message: string;
}

const Stylish404: React.FC = ({ title, message }: Partial<Stylish404Props> = {
  title: "An error occurred",
  message:
    "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.",
}) => {
  return (
    <div className="container-404">
      <div className="icon-container">
        <svg
          width="200px"
          height="200px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 9H8C6.34315 9 5 10.3431 5 12C5 13.6569 6.34315 15 8 15H9M9 15L12 12M9 15L5 19M14 9H15M15 9L19 5M15 9L12 12M14 15H16C17.6569 15 19 13.6569 19 12C19 11.1716 18.6642 10.4216 18.1213 9.87868M8 12H12M15 12H16"
            stroke="#464455"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <h1 className="error-code">{title}</h1>
      <p className="error-message">{message}</p>
    </div>
  );
};

export default Stylish404;
