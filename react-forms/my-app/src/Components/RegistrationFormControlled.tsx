import type React from 'react';
import { useState } from 'react';

export function RegistrationFormControlled() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(username, password);
    setUsername('');
    setPassword('');
  }
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
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <button type="submit" className="cursor-pointer">
        Register
      </button>
    </form>
  );
}
