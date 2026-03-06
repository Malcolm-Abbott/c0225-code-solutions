type ButtonProps = {
  buttonText: string;
};

export function Button({ buttonText }: ButtonProps) {
  return <button>{buttonText}</button>;
}
