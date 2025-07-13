import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      localStorage.setItem('token', res.data.token);
      navigate('/notes');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-bg px-4">
      <form onSubmit={handleSubmit} className="bg-primary p-8 rounded-2xl shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-accent">Register</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded bg-bg border border-muted focus:outline-none"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded bg-bg border border-muted focus:outline-none"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-6 p-3 rounded bg-bg border border-muted focus:outline-none"
        />
        <button className="w-full bg-accent text-black py-2 rounded hover:opacity-90 transition">
          Register
        </button>
        <p className="mt-4 text-sm text-muted">
          Already have an account? <a href="/login" className="text-accent underline">Login</a>
        </p>
      </form>
    </div>
  );
}
