import { useState } from 'react';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleSignup(e) {
    e.preventDefault();
    const res = await fetch('http://localhost:8000/accounts/signup/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('Signup successful!');
    } else {
      setMessage(data.error || 'Signup failed.');
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Sign Up</h1>
      <form onSubmit={handleSignup}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="border p-2 mb-2 w-full" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 mb-2 w-full" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">Sign Up</button>
      </form>
      <p className="mt-2">{message}</p>
    </div>
  );
}
