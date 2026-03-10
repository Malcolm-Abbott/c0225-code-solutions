import { useState } from 'react';
import { PasswordErrorMessage } from './PasswordErrorMessage';

export function RegistrationFormUncontrolled() {
  const [password, setPassword] = useState('');
  const [isTouched, setIsTouched] = useState(false);

  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!isTouched) setIsTouched(true);
    setPassword(event.target.value);
  }

  const passwordErrorMessage =
    password.length > 0 && password.length < 8
      ? 'Password must be at least 8 characters long'
      : isTouched && password.length === 0
      ? 'Password is required'
      : '';

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    // const username = (formData.get('username') ?? '') as string;
    // const password = (formData.get('password') ?? '') as string;
    const username = (formData.get('username') ?? '') as string;
    const password = (formData.get('password') ?? '') as string;
    console.log(username, password);
    setIsTouched(false);
    form.reset();
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold">Uncontrolled Registration Form</h1>
      <div className="flex flex-col gap-1">
        <label htmlFor="username" className="text-lg font-bold">
          Username
        </label>
        <input type="text" id="username" name="username" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-lg font-bold">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={handlePasswordChange}
          onBlur={() => setIsTouched(false)}
        />
      </div>
      <PasswordErrorMessage errorMessage={passwordErrorMessage} />
      <button type="submit" className="cursor-pointer">
        Register
      </button>
    </form>
  );
}
