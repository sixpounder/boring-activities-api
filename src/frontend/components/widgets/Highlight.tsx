import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import { useEffect, useRef } from "react";
import "../../styles/highlight.css";

hljs.registerLanguage("json", json);

export const Highlight = (
  { text, className = "" }: { className?: string; text: string },
) => {
  const codeElement = useRef<HTMLPreElement | null>(null);

  useEffect(() => {
    if (codeElement.current) {
      const el: HTMLElement | null = codeElement.current.querySelector("code");
      el!.removeAttribute("data-highlighted");
      hljs.highlightElement(el!);
    }
  }, [text]);

  return (
    <div
      className={`relative w-full cursor-default ${className}`}
    >
      <div className="max-h-[600px] rounded-lg overflow-auto">
        <pre
          className="z-0 cursor-text"
          ref={codeElement}
        ><code className="language-json" style={{paddingRight: "2.5rem"}}>{text}</code></pre>
      </div>
    </div>
  );
};
