import React, { useState } from 'react';
import { loginUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await loginUser(form);
      login(res.data.token, form.username);
      navigate('/');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Username" onChange={e => setForm({ ...form, username: e.target.value })} />
      <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;