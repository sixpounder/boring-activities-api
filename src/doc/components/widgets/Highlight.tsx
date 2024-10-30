import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import React, { PropsWithChildren, useEffect, useRef } from 'react';

hljs.registerLanguage('json', json);

export const Highlight = ({ children, className = "" }: PropsWithChildren<{ className?: string }>) => {
    const codeElement = useRef(null);

    useEffect(() => {
        const el: HTMLElement = codeElement.current.querySelector("code");
        el.removeAttribute("data-highlighted");
        hljs.highlightElement(el);
    }, [ children ])

    return (
        <pre ref={codeElement}><code className={className}>{children}</code></pre>
    );
}