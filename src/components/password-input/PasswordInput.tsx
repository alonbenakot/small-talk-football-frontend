import Input from "../input/Input.tsx";
import { ComponentPropsWithRef, forwardRef, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

type Props = { error?: string } & ComponentPropsWithRef<'input'>;

const PasswordInput = forwardRef<HTMLInputElement, Props>(({error, ...props}, ref) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  return (
    <div className="mb-4">
      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
        Password
      </label>
      <div className="relative">
        <Input
          id="password"
          label=""
          type={isPasswordVisible ? "text" : "password"}
          {...props}
          ref={ref}
          isError={!!error}
        />
        <button
          type="button"
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          className="absolute inset-y-0 right-3 flex items-center justify-center text-emerald-700"
        >
          {isPasswordVisible ? (
            <EyeOffIcon className="w-4 h-4" />
          ) : (
            <EyeIcon className="w-4 h-4" />
          )}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
    </div>
  )
});

export default PasswordInput;