"use client";
import { motion, MotionProps } from "framer-motion";
type CombinedProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  MotionProps;

interface ButtonProps extends CombinedProps {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      {...props}
      className={`bg-emerald-500 ring-1 ring-slate-700 text-slate-700 rounded-md px-2 py-1 font-medium capitalize disabled:opacity-50 px-8 py-2  ${
        props.className ? props.className : ""
      }`}
    >
      {children}
    </motion.button>
  );
};

export default Button;
