// import { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// export default function Login() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');

//   const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async e => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('https://noted-the-bookmark-manager.onrender.com/api/auth/login', form);
//       localStorage.setItem('token', res.data.token);
//       navigate('/notes');
//     } catch (err) {
//       setError(err.response?.data?.error || 'Login failed');
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-bg px-4">
//       <form onSubmit={handleSubmit} className="bg-primary p-8 rounded-2xl shadow-xl w-full max-w-sm">
//         <h2 className="text-2xl font-bold mb-6 text-accent">Login</h2>
//         {error && <div className="mb-4 text-red-500">{error}</div>}
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={handleChange}
//           className="w-full mb-4 p-3 rounded bg-bg border border-muted focus:outline-none"
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={form.password}
//           onChange={handleChange}
//           className="w-full mb-6 p-3 rounded bg-bg border border-muted focus:outline-none"
//         />
//         <button className="w-full bg-accent text-black py-2 rounded hover:opacity-90 transition">
//           Login
//         </button>
//         <p className="mt-4 text-sm text-muted">
//           No account? <a href="/register" className="text-accent underline">Register</a>
//         </p>
//       </form>
//     </div>
//   );
// }

import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('https://noted-the-bookmark-manager.onrender.com/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      navigate('/notes');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = async () => {
    const testCredentials = { email: 'test0@gmail.com', password: 'test0' };
    setForm(testCredentials);
    setLoading(true);
    try {
      const res = await axios.post('https://noted-the-bookmark-manager.onrender.com/api/auth/login', testCredentials);
      localStorage.setItem('token', res.data.token);
      navigate('/notes');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-300">
      <div className="px-8 py-6 mt-4 text-left bg-gray-800 shadow-lg rounded-lg max-w-sm w-full">
        <h3 className="text-2xl font-bold text-center text-gray-100">Login</h3>
        
        <h4 className="text-center text-gray-500 mt-6">Testing Credentials</h4>
        <div className="mt-2 flex justify-center">
          <button
            onClick={handleTestLogin}
            className="bg-green-600 hover:bg-green-700 text-gray-100 font-bold py-2 px-4 rounded disabled:bg-gray-500 disabled:cursor-not-allowed"
            disabled={loading}
          >
            Login with TESTING CREDENTIALS
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <>
            {error && (
              <div className="mt-4 p-3 bg-red-900 text-red-300 rounded-md text-sm text-center">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="mt-4">
              <div>
                <label className="block text-gray-400" htmlFor="email">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mt-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-200"
                  required
                />
              </div>
              <div className="mt-4">
                <label className="block text-gray-400" htmlFor="password">Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mt-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-200"
                  required
                />
              </div>
              <div className="flex items-baseline justify-between mt-4">
                <button
                  type="submit"
                  className="px-6 py-2 text-gray-100 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none"
                >
                  Login
                </button>
              </div>
            </form>
            <p className="mt-4 text-center text-gray-400">
              No account? <a href="/register" className="text-blue-500 hover:underline">Register</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}