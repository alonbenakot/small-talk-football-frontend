import { ComponentPropsWithoutRef } from 'react';

type Props = {
  label: string;
  id: string;
  error?: string;
  checkbox?: boolean;
} & ComponentPropsWithoutRef<'input'>;

const Input = ({label, id, error, checkbox, ...props}: Props) => {
  if (checkbox) {
    return (
      <div className="mb-4">
        <div className="flex items-center">
          <input
            id={ id }
            type="checkbox"
            name={ id }
            { ...props }
            className={ `w-3 h-3 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-700 accent-emerald-600 ${
              error ? 'border-red-500' : ''
            }` }
          />
          <label htmlFor={ id } className="ml-2 text-sm font-medium text-gray-700">
            { label }
          </label>
        </div>
        { error && <p className="mt-2 text-sm text-red-600">{ error }</p> }
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label htmlFor={ id } className="block text-sm font-medium text-gray-700">
        { label }
      </label>
      <input
        id={ id }
        name={ id }
        { ...props }
        className={ `mt-1 block px-2 py-1 w-full rounded-md shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm ${
          error ? 'border-red-500' : 'border-gray-300'
        }` }
      />
      { error && <p className="mt-2 text-sm text-red-600">{ error }</p> }
    </div>
  );
};

export default Input;
