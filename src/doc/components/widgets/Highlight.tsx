import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import { PropsWithChildren, useEffect, useRef } from "react";
import "highlight.js/styles/night-owl.css";

hljs.registerLanguage("json", json);

export const Highlight = (
  { children, className = "" }: PropsWithChildren<{ className?: string }>,
) => {
  const codeElement = useRef(null);

  useEffect(() => {
    const el: HTMLElement = codeElement.current.querySelector("code");
    el.removeAttribute("data-highlighted");
    hljs.highlightElement(el);
  }, [children]);

  return (
    <div className={`max-h-[600px] overflow-auto rounded-md ${className}`}>
      <pre ref={codeElement}><code className="language-json">{children}</code></pre>
    </div>
  );
};
