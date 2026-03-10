import type React from 'react';
import { useState } from 'react';
import { PasswordErrorMessage } from './PasswordErrorMessage';

export function RegistrationFormControlled() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isTouched, setIsTouched] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(username, password);
    setUsername('');
    setPassword('');
    setIsTouched(false);
  }

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

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold">Controlled Registration Form</h1>
      <div className="flex flex-col gap-1">
        <label htmlFor="username" className="text-lg font-bold">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-lg font-bold">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
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
