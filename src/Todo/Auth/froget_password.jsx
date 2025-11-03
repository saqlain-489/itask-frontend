// components/ForgotPassword.jsx
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from "react-router-dom";


export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      toast.success(data.message || 'If that email exists, a reset link was sent.');
      navigate('/signin')
    } catch (err) {
      toast.error('Network error');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="signin-container">
    <form onSubmit={handleSubmit} className='signin'>
      <h3>Forgot password</h3>
      <input value={email} className='form-control w-75' onChange={e => setEmail(e.target.value)} placeholder="Your email" />
      <button disabled={sending} className='btn btn-primary w-75'>{sending ? 'Sending...' : 'Send reset link'}</button>
    </form>
    </div>
  );
}
