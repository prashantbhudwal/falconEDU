"use client";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className={`bg-emerald-500 ring-1 ring-slate-700 text-slate-700 rounded-md px-2 py-1 font-medium capitalize disabled:opacity-50 px-8 py-2  ${
        props.className ? props.className : ""
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
