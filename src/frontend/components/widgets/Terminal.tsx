import { PropsWithChildren } from "react";

export const Terminal = (props: PropsWithChildren<{ prompt?: string }>) => {
  return (
    <div className="w-full">
      <div className="coding inverse-toggle px-5 pt-4 shadow-lg text-gray-100 text-sm font-mono subpixel-antialiased bg-gray-800 dark:bg-slate-700 pb-6 rounded-lg leading-normal overflow-auto">
        <div className="top mb-2 flex">
          <div className="h-3 w-3 bg-red-500 rounded-full"></div>
          <div className="ml-2 h-3 w-3 bg-orange-300 rounded-full"></div>
          <div className="ml-2 h-3 w-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="mt-4 flex">
          <span className="text-green-400">{props.prompt ?? "$~"}</span>
          <p className="flex-1 typing items-center pl-2">
            {props.children}
            <br />
          </p>
        </div>
      </div>
    </div>
  );
};
