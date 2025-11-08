import * as React from 'react';
import {ComponentPropsWithRef, forwardRef, ReactNode} from 'react';
import {Check} from "lucide-react";

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
  iconImg?: ReactNode;
  checked?: boolean;
} & InputProps;

const Input = forwardRef<unknown, Props>(
    ({label, id, error, isError, checkbox, radio, radioValue, iconImg, checked, ...props}, ref) => {

      if (checkbox) {
        return (
            <div className="mb-4">
              <div className="flex items-center">
                <input
                    ref={ref as React.Ref<HTMLInputElement>}
                    id={id}
                    type="checkbox"
                    name={id}
                    {...props} // Narrowed to input props only
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
            <div className="mb-3">
              <label
                  htmlFor={id}
                  className={`w-full flex items-center gap-4 bg-white p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                      checked
                          ? 'border-emerald-700 bg-emerald-700/50 shadow-lg'
                          : 'border-slate-600 hover:bg-emerald-600'
                  } ${error ? 'border-red-400' : ''}`}
              >
                <input
                    {...props}
                    ref={ref as React.Ref<HTMLInputElement>}
                    id={id}
                    type="radio"
                    value={radioValue}
                    className="sr-only"
                />

                {iconImg && <div className="shrink-0">{iconImg}</div>}

                <span
                    className={`text-lg font-medium flex-1 text-left ${checked ? 'text-emerald-700' : 'text-zinc-800'}`}>
                  {label}
                </span>

                {checked && (
                    <Check className="w-5 h-5 text-emerald-700"/>
                )}
              </label>
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
                  {...props}
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
