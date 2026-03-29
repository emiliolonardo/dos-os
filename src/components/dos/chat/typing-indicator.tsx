"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================

interface TypingUser {
  userId: string;
  userName: string;
}

interface TypingIndicatorProps {
  users: TypingUser[];
  className?: string;
}

// ============================================
// TYPING INDICATOR COMPONENT
// ============================================

export function TypingIndicator({ users, className }: TypingIndicatorProps) {
  if (users.length === 0) return null;

  // Format the typing message based on number of users
  const getTypingText = () => {
    const names = users.map((u) => u.userName || "Someone");

    if (names.length === 1) {
      return `${names[0]} is typing`;
    } else if (names.length === 2) {
      return `${names[0]} and ${names[1]} are typing`;
    } else if (names.length === 3) {
      return `${names[0]}, ${names[1]}, and ${names[2]} are typing`;
    } else {
      return `${names[0]}, ${names[1]}, and ${names.length - 2} others are typing`;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className={cn("flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground", className)}
      >
        <div className="flex items-center gap-1">
          <TypingDots />
        </div>
        <span>{getTypingText()}</span>
      </motion.div>
    </AnimatePresence>
  );
}

// ============================================
// TYPING DOTS COMPONENT
// ============================================

function TypingDots() {
  const dotVariants = {
    initial: { y: 0 },
    animate: { y: -4 },
  };

  const dotTransition = {
    duration: 0.4,
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: "easeInOut",
  };

  return (
    <div className="flex items-center gap-0.5">
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          variants={dotVariants}
          initial="initial"
          animate="animate"
          transition={{
            ...dotTransition,
            delay: index * 0.15,
          }}
          className="size-1.5 rounded-full bg-muted-foreground"
        />
      ))}
    </div>
  );
}

// ============================================
// TYPING DOT (SINGLE) COMPONENT
// ============================================

export function TypingDot() {
  return (
    <motion.span
      className="inline-block size-2 rounded-full bg-current"
      animate={{
        opacity: [0.4, 1, 0.4],
        scale: [0.9, 1.1, 0.9],
      }}
      transition={{
        duration: 1.2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export default TypingIndicator;
