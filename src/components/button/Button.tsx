import { ComponentPropsWithoutRef } from "react";

type Props = {
  buttonType: 'cta' | 'primary' | 'secondary';
} & ComponentPropsWithoutRef<'button'>;

const Button = ({children, buttonType, ...props}: Props) => {
  let className = 'bg-emerald-600 text-white rounded-lg hover:bg-emerald-800 transition duration-300';

  if (buttonType === 'primary') {
    className += ' px-2 py-1 hover:bg-emerald-700';
  }

  if (buttonType === 'secondary') {
    className = 'px-2 py-1 bg-white text-emerald-600 border border-emerald-600 rounded-lg transition duration-300 hover:bg-emerald-600 hover:text-white';
  }

  if (buttonType === 'cta') {
    className += ' px-4 py-2 hover:bg-slate-300 hover:text-emerald-600';
  }

  return (
    <button className={ className } { ...props }>{ children }</button>
  )
}
export default Button;