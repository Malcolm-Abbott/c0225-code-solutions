## React Forms Exercise – Summary

### Overview

This exercise compared **uncontrolled** and **controlled** forms in React, and explored how to work with `FormData` and `Object.fromEntries` to handle form submissions.

---

### Uncontrolled form (`RegistrationFormUncontrolled`)

- **Pattern**: Let the browser manage input values; read them only when the form is submitted.

- **Typical flow**:

  - **Stop default submit behavior**:

    ```tsx
    event.preventDefault();
    ```

  - **Get the form element**:

    ```tsx
    const form = event.currentTarget as HTMLFormElement;
    ```

  - **Build `FormData` from the form**:

    ```tsx
    const formData = new FormData(form);
    ```

- **Reading specific fields**:

  ```tsx
  const username = (formData.get('username') ?? '') as string;
  const password = (formData.get('password') ?? '') as string;
  ```

- **Resetting the form**:
  - `form.reset()` works perfectly here, because the browser is in charge of the input values.

---

### Controlled form (`RegistrationFormControlled`)

- **Pattern**: React state is the **single source of truth** for inputs.

  ```tsx
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  <input value={username} onChange={(e) => setUsername(e.target.value)} />;
  ```

- **What we observed**:

  - Calling `form.reset()` **does not clear controlled inputs**, because React immediately writes the state values back into the DOM from state.

- **Correct way to clear a controlled form**:

  Reset the **state**, not the DOM:

  ```tsx
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // use username/password...
    setUsername('');
    setPassword('');
  }
  ```

- **Conclusion**:
  - Controlled inputs are **not** a bad practice; they are the **standard approach** when you need validation, dynamic UI, or close control over user input.

---

### `FormData` and `Object.fromEntries`

- **`FormData`**:

  - Created with `new FormData(form)`.
  - Represents form fields as key–value pairs (e.g. `("username", "alice")`).

- **Converting to a plain object**:

  ```tsx
  const formData = new FormData(form);
  const entries = Object.fromEntries(formData);
  ```

  - `formData` is an iterable of `[key, value]` pairs.
  - `Object.fromEntries(formData)` creates a simple object like:

    ```ts
    { username: 'alice', password: 'secret' }
    ```

  - This is convenient for logging, debugging, or sending data to an API.

---

### Key takeaways

- **Uncontrolled forms**:

  - Use the **browser** as the source of truth.
  - Read values with `FormData` on submit.
  - `form.reset()` works naturally.

- **Controlled forms**:

  - Use **React state** as the source of truth.
  - `form.reset()` alone won’t clear values; **use state setters** to reset.
  - Ideal when you need **validation**, **conditional UI**, or **live feedback**.

- **`FormData` + `Object.fromEntries`**:
  - Great combo to turn a form submission into a plain JavaScript object in one step.
