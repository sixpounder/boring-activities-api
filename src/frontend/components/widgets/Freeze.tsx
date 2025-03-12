import { JSX, ReactElement, useEffect, useMemo, useRef } from "react";

interface FreezeProps {
  effect: "blur" | "none";
  enabled: boolean;
  className: string;
  children: ReactElement | JSX.Element | JSX.Element[];
}

export const Freeze = (
  { effect, enabled, children, className }: Partial<FreezeProps>,
) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const appliedEffect = effect ?? "none";
  const eventSink = (event: Event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
  };

  const startSink = () => {
    wrapRef.current?.addEventListener("keydown", eventSink, {
      capture: true,
    });

    wrapRef.current?.addEventListener("focus", eventSink, {
      capture: true,
    });
  };

  const stopSink = () => {
    wrapRef.current?.removeEventListener("keydown", eventSink, {
      capture: true,
    });

    wrapRef.current?.removeEventListener("focus", eventSink, {
      capture: true,
    });
  };

  useEffect(() => {
    if (enabled) {
      startSink();
    } else {
      stopSink();
    }

    return () => stopSink();
  }, [enabled]);

  const effectClass = useMemo(() => {
    if (enabled) {
      return appliedEffect === "blur"
        ? "blur-sm pointer-events-none select-none"
        : "";
    } else {
      return "";
    }
  }, [enabled, appliedEffect]);

  return (
    <div
      className={`${className} ${effectClass}`}
      ref={wrapRef}
    >
      {children}
    </div>
  );
};
