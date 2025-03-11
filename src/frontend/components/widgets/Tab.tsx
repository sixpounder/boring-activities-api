import { ReactElement } from "react";

export interface TabProps {
  label: string;
  children: ReactElement;
}

export const Tab = ({ children }: TabProps) => {
  return <>{children}</>;
};
