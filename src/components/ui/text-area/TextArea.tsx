import {ComponentPropsWithRef, forwardRef} from "react";

type Props = {
  label: string;
  id: string;
  rows: number;
  error?: string;
  isError?: boolean;
} & ComponentPropsWithRef<'textarea'>;

const TextArea = forwardRef<HTMLTextAreaElement, Props>(
    ({id, rows, error, isError, ...props}, ref) => {
      return (
          <div className="mb-4">
          <textarea
              ref={ref}
              id={id}
              name={id}
              rows={rows}
              {...props}
              className={`mt-1 block px-2 py-1 w-full border-2 rounded-md shadow-sm focus:border-emerald-700 focus:ring-emerald-700 sm:text-sm ${
                  error || isError ? 'border-rose-500' : 'border-emerald-600/70'
              }`}
          />
            {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
          </div>
      );
    }
);

TextArea.displayName = "TextArea";
export default TextArea;
