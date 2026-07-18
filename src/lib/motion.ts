"use client";

import { motion, type Variants, type Transition } from "framer-motion";

/* ── Shared Easing Curves ── */
export const easings = {
  luxury: [0.16, 1, 0.3, 1] as const,
  bounce: [0.34, 1.56, 0.64, 1] as const,
  smooth: [0.4, 0, 0.2, 1] as const,
  snap: [0.22, 1, 0.36, 1] as const,
} as const;

export const durations = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.7,
} as const;

/* ── Shared Transitions ── */
export const transitions = {
  default: { duration: durations.normal, ease: easings.luxury },
  spring: { type: "spring" as const, stiffness: 300, damping: 30 },
  springBouncy: { type: "spring" as const, stiffness: 400, damping: 25 },
  springGentle: { type: "spring" as const, stiffness: 200, damping: 20 },
  smooth: { duration: durations.slow, ease: easings.smooth },
  snap: { duration: durations.fast, ease: easings.snap },
} as const;

/* ── Predefined Animation Variants ── */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.default,
  },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.default,
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durations.normal },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.default,
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.default,
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.default,
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

/* ── Overlay & Dialog Variants ── */
export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, ease: easings.smooth },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

export const dialogVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: easings.luxury,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 4,
    transition: { duration: 0.2 },
  },
};

/* ── Drawer Variants ── */
export const drawerVariants = {
  right: {
    hidden: { x: "100%" },
    visible: { x: 0, transition: { duration: 0.35, ease: easings.luxury } },
    exit: { x: "100%", transition: { duration: 0.25, ease: easings.smooth } },
  },
  left: {
    hidden: { x: "-100%" },
    visible: { x: 0, transition: { duration: 0.35, ease: easings.luxury } },
    exit: { x: "-100%", transition: { duration: 0.25, ease: easings.smooth } },
  },
  top: {
    hidden: { y: "-100%" },
    visible: { y: 0, transition: { duration: 0.35, ease: easings.luxury } },
    exit: { y: "-100%", transition: { duration: 0.25, ease: easings.smooth } },
  },
  bottom: {
    hidden: { y: "100%" },
    visible: { y: 0, transition: { duration: 0.35, ease: easings.luxury } },
    exit: { y: "100%", transition: { duration: 0.25, ease: easings.smooth } },
  },
};

/* ── Toast Variants ── */
export const toastVariants: Variants = {
  hidden: { opacity: 0, y: 100, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: easings.luxury,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};
