import classNames from "classnames";
import { ReactNode } from "react";

export type Tint = "green" | "red" | "orange" | "blue" | "purple";

export interface PillProps {
  tint: Tint;
  className: string;
  children: ReactNode | ReactNode[];
}

export const Pill = (
  { tint = "green", className = "", children }: Partial<PillProps>,
) => {
  const colorClasses = (tint: Tint) => {
    return classNames({
      "bg-green-100 border-green-500 text-green-500 dark:bg-green-800 dark:border-green-800 dark:text-white dark:text-opacity-90":
        tint === "green",
      "bg-red-100 border-red-500 text-red-500 dark:bg-red-800 dark:border-red-800 dark:text-white dark:text-opacity-90":
        tint === "red",
      "bg-orange-100 border-orange-500 text-orange-500 dark:bg-orange-600 dark:border-orange-600 dark:text-white dark:text-opacity-90":
        tint === "orange",
      "bg-blue-100 border-blue-500 text-blue-500 dark:bg-blue-600 dark:border-blue-600 dark:text-white dark:text-opacity-90":
        tint === "blue",
      "bg-purple-100 border-purple-500 text-purple-500 dark:bg-purple-800 dark:border-purple-800 dark:text-white dark:text-opacity-90":
        tint === "purple",
    });
  };

  return (
    <span
      className={`block text-center text-xl px-3 py-2 select-none border rounded-lg ${
        colorClasses(tint)
      } ${className}`}
    >
      {children}
    </span>
  );
};
