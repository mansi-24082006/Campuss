import React from "react";
import { motion } from "framer-motion";

const AnimatedSwitch = ({ checked, onChange, iconOn, iconOff, className = "" }) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-2 ${
        checked ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-800"
      } ${className}`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-lg ${
          checked ? "ml-6" : "ml-1"
        }`}
      >
        {checked ? (
          <span className="text-indigo-600 scale-75">{iconOn}</span>
        ) : (
          <span className="text-slate-400 scale-75">{iconOff}</span>
        )}
      </motion.span>
    </button>
  );
};

export default AnimatedSwitch;
