import { ReactNode } from "react";

const Center = ({ children }: { children: ReactNode | ReactNode[] }) => {
  return (
    <div className="flex flex-col justify-center items-center">{children}</div>
  );
};

export default Center;
