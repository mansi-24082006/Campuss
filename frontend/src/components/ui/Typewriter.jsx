import React, { useState, useEffect } from 'react';

const Typewriter = ({ text, speed = 100, delay = 0, className = "" }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStarted(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, started]);

  return (
    <span className={className}>
      {displayedText}
      <span className="inline-block w-[2px] h-[1.2em] bg-indigo-600 ml-1 align-middle animate-pulse shadow-[0_0_8px_rgba(79,70,229,0.6)]"></span>
    </span>
  );
};

export default Typewriter;
