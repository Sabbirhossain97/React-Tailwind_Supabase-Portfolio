import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <div>
      <div style={{ height: "5px" }} />
      <button
        onClick={() => {
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }}
        className="fixed p-4 text-xs bottom-10 right-10 transition duration-300 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-900 text-white rounded-full text-center dark:hover:bg-zinc-800"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 text-sky-400 dark:text-teal-500"
        >
          <path
            fillRule="evenodd"
            d="M11.47 7.72a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}