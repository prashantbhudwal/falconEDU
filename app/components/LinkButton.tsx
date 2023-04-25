"use client";
import { motion, MotionProps } from "framer-motion";
import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";

interface LinkButtonProps extends LinkProps {
  children: ReactNode;
  className?: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
      <Link
        {...props}
        href={props.href}
        className={`bg-emerald-600 hover:bg-emerald-700 text-slate-200 font-medium py-2 px-4 rounded  ${
          className ? className : ""
        }`}
      >
        {children}
      </Link>
    </motion.div>
  );
};

export default LinkButton;
