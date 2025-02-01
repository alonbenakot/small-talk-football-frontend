import { ComponentPropsWithoutRef } from "react";

type Props = {
  buttonType: 'cta' | 'primary' | 'secondary';
} & ComponentPropsWithoutRef<'button'>;

const Button = ({children, buttonType, ...props}: Props) => {
  let className = ' bg-emerald-600 text-white rounded-lg hover:bg-emerald-800 transition duration-300';

  if (buttonType === 'primary') {
    className += ' px-2 py-1 hover:bg-emerald-700';
  }

  if (buttonType === 'secondary') {
    className += '';
  }

  if (buttonType === 'cta') {
    className += ' px-4 py-2 hover:bg-slate-300 hover:text-emerald-600';
  }

  return (
    <button className={ className } { ...props }>{ children }</button>
  )
}
export default Button;