import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "../../../../lib/utils";
import { Link } from "react-router-dom";

export const Tabbar = ({
  navItems,
  className,
  activeTab,
  onClick,
}: {
  navItems: {
    name: string;
  }[];
  className?: string;
  activeTab: number;
  onClick: (idx: number) => void;
}) => {
  const { scrollYProgress } = useScroll();

  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === "number") {
      let direction = current! - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.05) {
        setVisible(false);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  return (
    <div
      className={cn(
        "flex w-full  dark:border-white/[0.2]  dark:bg-black bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-8 py-2  items-center justify-center space-x-4",
        className
      )}
    >
      {navItems.map((navItem: any, idx: number) => (
        <button
          key={idx}
          onClick={() => onClick(idx)}
          className={`${
            activeTab === idx ? "border rounded-full" : ""
          } text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 `}
        >
          <span
            className={`${
              activeTab === idx ? "text-userPrimary font-bold" : "text-white"
            }`}
          >
            {navItem.label}
          </span>
          {activeTab === idx && (
            <span className="absolute inset-x-0 w-1/2 h-px mx-auto -bottom-px bg-gradient-to-r from-transparent via-userPrimary to-transparent" />
          )}
        </button>
      ))}
    </div>
  );
};
