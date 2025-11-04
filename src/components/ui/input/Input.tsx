import * as React from 'react';
import {ComponentPropsWithRef, forwardRef} from 'react';

type InputProps = ComponentPropsWithRef<'input'>;

type Props = {
  label: string;
  id: string;
  error?: string;
  radioValue?: string;
  isError?: boolean;
  checkbox?: boolean;
  radio?: boolean;
  textarea?: boolean;
} & InputProps;

const Input = forwardRef<unknown, Props>(
    ({label, id, error, isError, checkbox, radio, radioValue, ...props}, ref) => {
      const inputProps = props as InputProps;

      if (checkbox) {
        return (
            <div className="mb-4">
              <div className="flex items-center">
                <input
                    ref={ref as React.Ref<HTMLInputElement>}
                    id={id}
                    type="checkbox"
                    name={id}
                    {...inputProps} // Narrowed to input props only
                    className={`w-3 h-3 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-700 accent-emerald-600 ${
                        error ? 'border-red-400' : ''
                    }`}
                />
                <label htmlFor={id} className="ml-2 text-sm font-medium text-gray-700">
                  {label}
                </label>
              </div>
              {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
            </div>
        );
      }

      if (radio) {
        return (
            <div className="mb-4">
              <div className="flex items-center">
                <input
                    ref={ref as React.Ref<HTMLInputElement>}
                    id={id}
                    type="radio"
                    value={radioValue}
                    name={id}
                    {...inputProps} // Narrowed to input props only
                    className={`w-3 h-3 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-700 accent-emerald-600 ${
                        error ? 'border-red-400' : ''
                    }`}
                />
                <label htmlFor={id} className="ml-2 text-sm font-medium text-gray-700">
                  {label}
                </label>
              </div>
              {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
            </div>
        );
      }

      return (
          <div className="mb-4">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                  {label}
                </label>
            )}
            <div className="relative">
              <input
                  ref={ref as React.Ref<HTMLInputElement>}
                  id={id}
                  name={id}
                  {...inputProps}
                  className={`mt-1 block px-2 py-1 w-full border-2 rounded-md shadow-sm focus:border-emerald-700 focus:ring-emerald-700 sm:text-sm ${
                      error || isError ? 'border-rose-500' : 'border-emerald-600/70'
                  }`}
              />
            </div>
            {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
          </div>
      );
    }
);

export default Input;
