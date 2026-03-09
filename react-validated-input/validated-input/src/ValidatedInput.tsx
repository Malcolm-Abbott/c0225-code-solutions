import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { FaTimesCircle, FaCheckCircle } from 'react-icons/fa';

type ValidatedInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ValidatedInput({ value, onChange }: ValidatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  let isValid = true;
  const isEmpty = value.length === 0;
  const isTooShort = value.length > 0 && value.length < 8;
  let errorMessage = '';

  if (isTooShort) {
    isValid = false;
    errorMessage = 'Password must be at least 8 characters long';
  } else if (isEmpty && isFocused) {
    isValid = false;
    errorMessage = 'Password is required';
  } else {
    isValid = true;
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (!isFocused) setIsFocused(true);
    onChange(e.target.value);
  }

  return (
    <div className="mb-4 w-full max-w-md p-4">
      <label htmlFor="password" className="block mb-1 font-medium">
        Password
      </label>
      <div className="flex items-center">
        <input
          type="password"
          id="password"
          value={value}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          onBlur={() => setIsFocused(false)}
        />
        {!isValid && (
          <FaTimesCircle
            className="ml-2 text-red-500 text-xl"
            aria-hidden="true"
          />
        )}
        {isValid && !isEmpty && (
          <FaCheckCircle
            className="ml-2 text-green-500 text-xl"
            aria-hidden="true"
          />
        )}
      </div>
      <p className={`text-red-500 text-sm mt-1${isValid ? ' hidden' : ''}`}>
        {errorMessage}
      </p>
    </div>
  );
}
