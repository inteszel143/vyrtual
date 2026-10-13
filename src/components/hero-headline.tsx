"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

const headlineVariants: Variants = {
  initial: { y: 0 },
  animate: {
    y: [0, -6, 0],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function HeroHeadline() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.h1
      variants={headlineVariants}
      initial="initial"
      animate={shouldReduceMotion ? "initial" : "animate"}
      className="mt-6 max-w-4xl text-5xl font-medium leading-[1.08] tracking-[-0.055em] sm:text-6xl lg:text-7xl"
    >
      Your office, wherever work happens.
    </motion.h1>
  );
}
