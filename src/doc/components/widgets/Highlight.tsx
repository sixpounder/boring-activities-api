import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import { PropsWithChildren, useEffect, useRef } from "react";
import "../../styles/highlight.css";

hljs.registerLanguage("json", json);

export const Highlight = (
  { children, className = "" }: PropsWithChildren<{ className?: string }>,
) => {
  const codeElement = useRef<HTMLPreElement | null>(null);

  useEffect(() => {
    if (codeElement.current) {
      const el: HTMLElement | null = codeElement.current.querySelector("code");
      el!.removeAttribute("data-highlighted");
      hljs.highlightElement(el!);
    }
  }, [children]);

  return (
    <div className={`max-h-[600px] overflow-auto rounded-md ${className}`}>
      <pre
        ref={codeElement}
      ><code className="language-json">{children}</code></pre>
    </div>
  );
};
