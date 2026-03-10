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

---

### Extra functionality & deeper dive (second session)

This section captures additional patterns and refinements added later, beyond the core forms.

#### 1. Controlled vs. uncontrolled – deeper understanding

- **Uncontrolled form** (`RegistrationFormUncontrolled`):

  - Inputs are managed by the **browser**, not React.
  - On submit, values are read with `FormData`, then `form.reset()` returns the DOM to its default state.
  - You can still add **React state purely for validation UI** around an otherwise uncontrolled input.

- **Controlled form** (`RegistrationFormControlled`):
  - Inputs are driven entirely by **React state** (`value` + `onChange`).
  - `form.reset()` does not clear visible values unless you also reset state.
  - The idiomatic way to clear a controlled form is to **reset the state** on submit.

#### 2. Sharing a password error component between forms

- Initially, the password error component was **form-specific**:
  - It received `password` and `isFocused` and performed its own validation logic inside.
- It was refactored into a **reusable, presentation-only** component:
  - It now accepts a single `errorMessage` prop.
  - Both the controlled and uncontrolled forms compute their own error strings and pass them down.
- This cleanly separates:
  - **Validation rules** (inside each form) from
  - **Display of the error** (inside the shared component).

#### 3. Designing clear validation state (`isTouched` + `password`)

- **State per password field**:

  - `password`: current value of the input.
  - `isTouched`: whether the user has interacted with the field.

- **Error logic**:

  ```ts
  if (password.length > 0 && password.length < 8) {
    // "Password must be at least 8 characters long"
  } else if (isTouched && password.length === 0) {
    // "Password is required"
  } else {
    // no error
  }
  ```

- **Behavior**:
  - Empty + **not** touched → **no message**.
  - Empty + touched → **“Password is required”**.
  - Non‑empty but too short → **length message**, regardless of `isTouched`.

This logic is easy to read and can be applied consistently in both the controlled and uncontrolled forms (they only differ in how `password` is sourced).

#### 4. State vs. local variables in uncontrolled forms

- A brief experiment tried to reuse the error component in the uncontrolled form via a plain `let password` variable updated in an event handler.
- The issue:
  - Component functions run again on every render, so `let password = ''` was **reset each render**.
  - Updates to that variable did **not** persist across renders, and the error component often saw an empty string.
- Takeaway:
  - Any value that must survive re-renders and drive UI needs to live in **React state or refs**, not in ordinary local variables.
