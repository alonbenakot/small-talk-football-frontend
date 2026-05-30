import {HTMLMotionProps, motion} from "framer-motion";

export type ButtonProps = {
  buttonType: 'cta' | 'primary' | 'secondary' | 'prominent';
} & Omit<HTMLMotionProps<'button'>, 'buttonType'>;

const Button = ({children, buttonType, className: customClassName, ...props}: ButtonProps) => {
  let className = 'text-white rounded-lg transition duration-300 cursor-pointer';

  if (buttonType === 'primary') {
    className += ' bg-emerald-600 px-2 py-1 hover:bg-emerald-700 disabled:bg-slate-500/60';
  }

  if (buttonType === 'secondary') {
    className = 'px-2 py-1 bg-white text-emerald-600 border border-emerald-600 rounded-lg transition duration-300 hover:bg-emerald-600 hover:text-white cursor-pointer';
  }

  if (buttonType === 'cta') {
    className += ' bg-emerald-500 px-4 py-2 hover:bg-emerald-700';
  }

  if (buttonType === 'prominent') {
    className += ' bg-emerald-600 px-8 py-4 hover:bg-emerald-700 font-semibold text-lg shadow-lg';
  }

  const finalClassName = customClassName ? `${className} ${customClassName}` : className;

  return (
    <motion.button 
      className={finalClassName} 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}
export default Button;