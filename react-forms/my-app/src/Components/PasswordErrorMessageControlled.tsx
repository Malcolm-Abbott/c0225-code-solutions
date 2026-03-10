interface PasswordErrorMessageProps {
  errorMessage: string;
}

export function PasswordErrorMessageControlled({
  errorMessage,
}: PasswordErrorMessageProps) {
  if (!errorMessage) {
    return null;
  }

  return <p className="text-red-500 text-sm">{errorMessage}</p>;
}
