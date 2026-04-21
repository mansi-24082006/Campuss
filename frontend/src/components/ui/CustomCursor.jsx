import React, { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";

const CustomCursor = () => {
  const [cursorType, setCursorType] = useState("default");
  const [activeLabel, setActiveLabel] = useState("");

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const spring = { damping: 20, stiffness: 180 };
  const smoothX = useSpring(mouseX, spring);
  const smoothY = useSpring(mouseY, spring);

  const magneticX = useMotionValue(0);
  const magneticY = useMotionValue(0);

  useEffect(() => {
    const moveMouse = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleOver = (e) => {
      const target = e.target;

      const label = target.getAttribute("data-cursor-label");
      setActiveLabel(label || "");

      const magneticEl = target.closest(".magnetic");

      if (magneticEl) {
        setCursorType("pointer");

        const rect = magneticEl.getBoundingClientRect();
        magneticX.set(rect.left + rect.width / 2);
        magneticY.set(rect.top + rect.height / 2);
      } else if (target.closest("input, textarea")) {
        setCursorType("text");
      } else {
        setCursorType("default");
      }
    };

    const handleOut = () => {
      magneticX.set(mouseX.get());
      magneticY.set(mouseY.get());
    };

    window.addEventListener("mousemove", moveMouse);
    window.addEventListener("mouseover", handleOver);
    window.addEventListener("mouseout", handleOut);

    return () => {
      window.removeEventListener("mousemove", moveMouse);
      window.removeEventListener("mouseover", handleOver);
      window.removeEventListener("mouseout", handleOut);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">

      {/* 🌈 GRADIENT BLOB */}
      <motion.div
        style={{
          x: cursorType === "pointer" ? magneticX : smoothX,
          y: cursorType === "pointer" ? magneticY : smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="absolute"
      >
        <motion.div
          animate={{
            width: cursorType === "pointer" ? 120 : 30,
            height: cursorType === "pointer" ? 120 : 30,
            borderRadius:
              cursorType === "pointer"
                ? "60% 40% 30% 70% / 40% 60% 70% 30%"
                : "50%",
            scale: cursorType === "pointer" ? 1.2 : 1,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative flex items-center justify-center overflow-hidden"
        >

          {/* 🌈 Animated Gradient */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "linear-gradient(45deg, #ff00cc, #3333ff)",
                "linear-gradient(45deg, #00ffcc, #ff6600)",
                "linear-gradient(45deg, #ffcc00, #00ccff)",
                "linear-gradient(45deg, #ff00cc, #3333ff)",
              ],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* ✨ Glow */}
          <motion.div
            className="absolute w-full h-full blur-2xl opacity-50"
            animate={{ scale: cursorType === "pointer" ? 1.8 : 1 }}
            style={{
              background:
                "linear-gradient(45deg, #ff00cc, #3333ff)",
            }}
          />

          {/* 💬 LABEL */}
          <AnimatePresence>
            {activeLabel && cursorType === "pointer" && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="text-xs font-bold text-white uppercase tracking-widest z-10"
              >
                {activeLabel}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* 🎯 DOT */}
      <motion.div
        className="absolute w-2 h-2 rounded-full"
        style={{
          backgroundColor: "#1e40af", // dark blue (blue-800)
          boxShadow: "0 0 8px #1e40af, 0 0 16px #1e40af",
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}

      />

      {/* ✍️ TEXT MODE */}
      {cursorType === "text" && (
        <motion.div
          className="absolute w-[2px] h-6 bg-white"
          style={{
            x: smoothX,
            y: smoothY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </div>
  );
};

export default CustomCursor;