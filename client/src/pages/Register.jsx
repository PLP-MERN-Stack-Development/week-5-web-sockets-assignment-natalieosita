import React, { useState } from 'react';
import { registerUser } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await registerUser(form);
      alert('Registration successful!');
      navigate('/login');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input placeholder="Username" onChange={e => setForm({ ...form, username: e.target.value })} />
      <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;