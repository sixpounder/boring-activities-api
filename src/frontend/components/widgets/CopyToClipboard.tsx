import { debounce } from "lodash-es";
import icon from "../../assets/copy.svg";
import { useEffect, useState } from "react";
import { useFloating } from "@floating-ui/react-dom";

const CopyToClipboard = (
  { className, content, label }: Partial<
    { className: string; content: string; label: string }
  >,
) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const { refs, strategy, x, y } = useFloating({
    open: tooltipVisible,
    placement: "top",
  });

  const showTooltip = () => {
    if (!tooltipVisible) {
      setTooltipVisible(true);
    }
  };

  const hideTooltip = debounce(() => {
    if (tooltipVisible) {
      setTooltipVisible(false);
    }
  }, 1000);

  useEffect(() => {
    if (tooltipVisible) {
      hideTooltip();
    }
  }, [tooltipVisible]);

  const onClick = () => {
    navigator.clipboard.writeText(content ?? "");
    showTooltip();
  };

  return (
    <button
      ref={refs.setReference}
      className={`w-10 ${className}`}
      type="button"
      title={label ?? "Copy to clipboard"}
      aria-label={label ?? "Copy to clipboard"}
      onClick={onClick}
    >
      <div
        // eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml
        dangerouslySetInnerHTML={{ __html: icon }}
      >
      </div>
      {tooltipVisible && (
        <div
          ref={refs.setFloating}
          className="bg-teal-800 text-white text-opacity-90 rounded-lg whitespace-nowrap px-3 py-2"
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
          }}
        >
          Copied!
        </div>
      )}
    </button>
  );
};

export default CopyToClipboard;
