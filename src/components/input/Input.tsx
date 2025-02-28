import { ComponentPropsWithRef, forwardRef } from 'react';

type Props = {
  label: string;
  id: string;
  error?: string;
  isError?: boolean
  checkbox?: boolean;
} & ComponentPropsWithRef<'input'>;

const Input = forwardRef<HTMLInputElement, Props>(
  ({label, id, error, isError, checkbox, ...props}, ref) => {

    if (checkbox) {
      return (
        <div className="mb-4">
          <div className="flex items-center">
            <input
              ref={ ref }
              id={ id }
              type="checkbox"
              name={ id }
              { ...props }
              className={ `w-3 h-3 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-700 accent-emerald-600 ${
                error ? 'border-red-400' : ''
              }` }
            />
            <label htmlFor={ id } className="ml-2 text-sm font-medium text-gray-700">
              { label }
            </label>
          </div>
          { error && <p className="mt-2 text-xs text-red-600">{ error }</p> }
        </div>
      );
    }

    return (
      <div className="mb-4">
        <label htmlFor={ id } className="block text-sm font-medium text-gray-700">
          { label }
        </label>
        <div className="relative">
          <input
            ref={ ref }
            id={ id }
            name={ id }
            { ...props }
            className={ `mt-1 block px-2 py-1 w-full border-2 rounded-md shadow-sm focus:border-emerald-700 focus:ring-emerald-700 sm:text-sm ${
              error || isError ? 'border-rose-500' : 'border-emerald-600/70'
            }` }
          />
        </div>
        { error && <p className="mt-2 text-xs text-rose-600">{ error }</p> }
      </div>
    );
  }
);

export default Input;
