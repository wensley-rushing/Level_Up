// src/components/Preloader.jsx
'use client'; // Note: This directive is for Next.js; remove it for a Vite React app
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const words = [
    "SocialSync",
    "AI_Power",
    "ManagerHub",
    "ConnectSphere",
    "SmartFlow",
    "LeadBot",
    "EngageAI",
    "TeamPulse"
  ];
export const opacityAnim = {
  initial: { opacity: 0 },
  enter: { opacity: 0.75, transition: { duration: 1, delay: 0.2 } },
};

export const slideUpAnim = {
  initial: { top: 0 },
  exit: { top: "-100vh", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 } },
};

export default function Preloader({ onComplete }) {
  const [index, setIndex] = useState(0);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    if (index === words.length - 1) {
      setTimeout(() => {
        onComplete(); // Call the onComplete callback instead of redirecting
      }, 1500);
      return;
    }
    setTimeout(() => {
      setIndex(index + 1);
    }, index === 0 ? 1000 : 150);
  }, [index, onComplete]);

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height} L0 0`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height} L0 0`;

  const curve = {
    initial: { d: initialPath, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } },
    exit: { d: targetPath, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 } },
  };

  return (
    <motion.div variants={slideUpAnim} initial="initial" exit="exit" className="introduction">
      {dimension.width > 0 && (
        <>
          <motion.p variants={opacityAnim} initial="initial" animate="enter">
            <span></span>{words[index]}
          </motion.p>
          <svg>
            <motion.path variants={curve} initial="initial" exit="exit"></motion.path>
          </svg>
        </>
      )}
    </motion.div>
    );
}
