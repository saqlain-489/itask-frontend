import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:3000/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || 'Failed to reset password');
      } else {
        toast.success('Password reset. Please sign in.');
        navigate('/signin');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="signin-container">
    <form onSubmit={handleSubmit} className='signin'>
      <h3>Set new password</h3>
      <input value={password} onChange={e => setPassword(e.target.value)} className='form-control w-75' type="password" placeholder="New password" />
      <button disabled={submitting} className='btn btn-primary w-75'>{submitting ? 'Updating...' : 'Update password'}</button>
    </form>
    </div>
  );
}
