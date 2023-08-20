import { FC } from "react";

interface FullPageErrorProps {
  message?: string;
  handler?: () => void;
  type?: "reload" | "retry";
}

export const FullPageError: FC<FullPageErrorProps> = ({
  message,
  handler,
  type,
}) => (
  <div className="absolute flex items-center justify-center h-screen ">
    <div className="flex flex-col items-center justify-center gap-3">
      <svg
        className="w-10 h-10 text-red-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
      <h2 className="text-xl font-semibold text-center text-slate-800">
        {message ?? "Oops! Something went wrong 😢"}
      </h2>
      <p className="text-sm font-medium text-center text-slate-500 max-w-lg p-4">
        This is probably us not you, we're working on getting this fixed as soon
        as we can. You may be able to try again.
      </p>
      <button
        onClick={() =>
          type === "reload" ? window.location.reload() : handler?.()
        }
        className="px-6 py-3 text-base font-semibold text-white bg-slate-800 rounded-full">
        {type === "reload" ? "Please Reload" : "Please Try Again"}
      </button>
    </div>
  </div>
);

