import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { FiSearch } from "react-icons/fi";

const SearchBar = ({ placeholders, onChange, onSubmit}) => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const intervalRef = useRef(null);

  const startAnimation = () => {
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState !== "visible" && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    } else if (document.visibilityState === "visible") {
      startAnimation();
    }
  };

  useEffect(() => {
    startAnimation();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [placeholders]);

  const inputRef = useRef(null);
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit(e, value);
  };

  return (
    <form
      className={cn(
        "w-full relative max-w-2xl mx-auto bg-[#A3CBD6]/30 dark:bg-zinc-800 h-12 rounded-full overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200",
        value
      )}
      onSubmit={handleSubmit}
    >
      <input
        onChange={(e) => {
            setValue(e.target.value);
            onChange && onChange(e);
          }
        }
        ref={inputRef}
        value={value}
        type="text"
        className={cn(
          "w-full relative text-sm sm:text-base z-50 border-none text-black dark:text-white bg-transparent h-full rounded-full focus:outline-none focus:ring-0 pl-4 sm:pl-12 pr-20"
        )}
      />

      <button
        disabled={!value}
        type="submit"
        className="absolute left-2 top-1/2 z-[50] -translate-y-1/2 h-8 w-8 rounded-full text-white dark:text-gray-300 bg-gray-400 dark:bg-[#222222] transition duration-200 flex items-center justify-center hover:bg-zinc-700 dark:hover:bg-gray-300 hover:text-white dark:hover:text-black cursor-pointer"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <FiSearch className="h-4 w-4" />
        </motion.div>
      </button>

      <div className="absolute inset-0 flex items-center rounded-full pointer-events-none">
        <AnimatePresence mode="wait">
          {!value && (
            <motion.p
              initial={{
                y: 5,
                opacity: 0,
              }}
              key={`current-placeholder-${currentPlaceholder}`}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: -15,
                opacity: 0,
              }}
              transition={{
                duration: 0.3,
                ease: "linear",
              }}
              className="text-zinc-500 text-sm sm:text-base font-normal text-neutral-500 pl-4 sm:pl-12 text-left w-[calc(100%-2rem)] truncate"
            >
              {placeholders[currentPlaceholder]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
};

export default SearchBar;
