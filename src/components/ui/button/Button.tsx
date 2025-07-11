import { ComponentPropsWithoutRef } from "react";

export type ButtonProps = {
  buttonType: 'cta' | 'primary' | 'secondary';
} & ComponentPropsWithoutRef<'button'>;

const Button = ({children, buttonType, ...props}: ButtonProps) => {
  let className = 'text-white rounded-lg transition duration-300 cursor-pointer';

  if (buttonType === 'primary') {
    className += ' bg-emerald-600 px-2 py-1 hover:bg-emerald-700 disabled:bg-slate-500/60';
  }

  if (buttonType === 'secondary') {
    className = 'px-2 py-1 bg-white text-emerald-600 border border-emerald-600 rounded-lg transition duration-300 hover:bg-emerald-600 hover:text-white cursor-pointer';
  }

  if (buttonType === 'cta') {
    className += ' bg-emerald-500 px-4 py-2 hover:bg-slate-300 hover:text-emerald-600';
  }

  return (
    <button className={ className } { ...props }>{ children }</button>
  )
}
export default Button;