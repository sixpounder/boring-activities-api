export const Loading = ({ className }: Partial<{ className: string }>) => {
  return (
    <div className={`flex space-x-2 ${className ?? ""}`}>
      <div
        className="dot w-4 h-4 dark:bg-gray-50 bg-neutral-800 bg-opacity-25 rounded-full animate-loader"
        style={{ animationDelay: "0s" }}
      >
      </div>
      <div
        className="dot w-4 h-4 dark:bg-gray-50 bg-neutral-800 bg-opacity-25 rounded-full animate-loader"
        style={{ animationDelay: ".3s" }}
      >
      </div>
      <div
        className="dot w-4 h-4 dark:bg-gray-50 bg-neutral-800 bg-opacity-25 rounded-full animate-loader"
        style={{ animationDelay: ".6s" }}
      >
      </div>
    </div>
  );
};
