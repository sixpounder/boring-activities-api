import classNames from "classnames";

export interface PillProps {
  label: string;
  tint: "green" | "red" | "orange" | "blue";
}

export type Tint = "green" | "red" | "orange" | "blue";

export const Pill = ({ label = "", tint = "green" }: Partial<PillProps>) => {
  const colorClasses = (tint: Tint) => {
    return classNames({
      "bg-green-100 border-green-500 text-green-500 dark:bg-green-500 dark:text-green-100":
        tint === "green",
      "bg-red-100 border-red-500 text-red-500 dark:bg-red-500 dark:text-red-100":
        tint === "red",
      "bg-orange-100 border-orange-500 text-orange-500 dark:bg-orange-500 dark:text-orange-100":
        tint === "orange",
      "bg-blue-100 border-blue-500 text-blue-500 dark:bg-blue-500 dark:text-blue-100":
        tint === "blue",
    });
  };

  return (
    <span
      className={"block text-center text-xl px-3 py-2 select-none border rounded-lg " +
        colorClasses(tint)}
    >
      {label}
    </span>
  );
};
