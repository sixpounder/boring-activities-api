import { ReactNode } from "react";

export default ({ children }: { children: ReactNode | ReactNode[] }) => {
  return (
    <div className="flex flex-col justify-center items-center">{children}</div>
  );
};
