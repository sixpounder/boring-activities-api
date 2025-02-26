import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import { PropsWithChildren, useEffect, useRef } from "react";
import "../../styles/highlight.css";
import { isString } from "lodash-es";
import CopyToClipboard from "./CopyToClipboard";

hljs.registerLanguage("json", json);

export const Highlight = (
  { children, className = "" }: PropsWithChildren<{ className?: string }>,
) => {
  const rawText = isString(children) ? children : "";
  const codeElement = useRef<HTMLPreElement | null>(null);

  useEffect(() => {
    if (codeElement.current) {
      const el: HTMLElement | null = codeElement.current.querySelector("code");
      el!.removeAttribute("data-highlighted");
      hljs.highlightElement(el!);
    }
  }, [children]);

  return (
    <div
      className={`relative w-full ${className}`}
    >
      <div className="toolbox absolute z-10 top-1 right-1 flex flex-col justify-start">
        <CopyToClipboard
          content={rawText}
          className="dark:text-slate-300 dark:hover:text-white text-gray-500 hover:text-gray-950 transition-colors"
        >
        </CopyToClipboard>
      </div>
      <div className="max-h-[600px] rounded-lg overflow-auto">
        <pre
          className="z-0"
          ref={codeElement}
        ><code className="language-json" style={{paddingRight: "2.5rem"}}>{children}</code></pre>
      </div>
    </div>
  );
};
