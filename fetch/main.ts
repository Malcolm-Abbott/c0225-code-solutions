interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

async function fetchData(): Promise<User[]> {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = (await res.json()) as User[];
    console.log('users:', data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getUserNames(usersPromise: Promise<User[]>): Promise<string[]> {
  try {
    const users = await usersPromise;
    const userNames = users.map((user) => user.name);
    console.log('userNames:', userNames);
    return userNames;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

getUserNames(fetchData());
