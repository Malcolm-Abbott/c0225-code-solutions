export function RegistrationFormUncontrolled() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    // const username = (formData.get('username') ?? '') as string;
    // const password = (formData.get('password') ?? '') as string;
    // console.log(username, password);
    const entries = Object.fromEntries(formData);
    const { username, password } = entries;
    console.log(username, password);
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
        <input type="password" id="password" name="password" />
      </div>
      <button type="submit" className="cursor-pointer">
        Register
      </button>
    </form>
  );
}
