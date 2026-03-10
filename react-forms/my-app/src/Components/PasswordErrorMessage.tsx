interface PasswordErrorMessageProps {
  errorMessage: string;
}

export function PasswordErrorMessage({
  errorMessage,
}: PasswordErrorMessageProps) {
  if (!errorMessage) {
    return null;
  }

  return <p className="text-red-500 text-sm">{errorMessage}</p>;
}
