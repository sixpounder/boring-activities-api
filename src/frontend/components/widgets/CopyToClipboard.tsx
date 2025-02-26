import icon from "../../assets/copy.svg";

export default (
  { className, content, label }: Partial<
    { className: string; content: string; label: string }
  >,
) => {
  return (
    <button
      className={`w-10 ${className}`}
      type="button"
      title={label ?? "Copy to clipboard"}
      aria-label={label ?? "Copy to clipboard"}
      onClick={() => navigator.clipboard.writeText(content ?? "")}
      // eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml
      dangerouslySetInnerHTML={{ __html: icon }}
    >
    </button>
  );
};
