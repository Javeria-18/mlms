import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { signup } from '../api/auth';
import { AuthShell } from '@/components/layout/AuthShell';
import { Button } from '@/components/ui/button';

type Form = {
  tenantId: string;
  tenantSecret: string;
  username: string;
  email: string;
  password: string;
};

export default function SignupAdmin() {
  const { register, handleSubmit } = useForm<Form>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (v: Form) => {
    setError(null); setLoading(true);
    try {
      await signup({ ...v, role: 'Admin' });
      navigate('/login', { replace: true });
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100';

  return (
    <AuthShell
      title="Launch a new learning tenant"
      subtitle="Create your organization’s private space with tenant-level analytics, content, and security."
      eyebrow="Administrator onboarding"
    >
      <div className="mb-8 space-y-2">
        <p className="text-2xl font-semibold text-slate-900">Admin signup</p>
        <p className="text-sm text-slate-500">This account becomes the root owner of your tenant.</p>
        {error && <div className="rounded-2xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-600">Tenant ID</label>
            <input className={inputClass} {...register('tenantId', { required: true })} placeholder="northstar-college" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Tenant Secret</label>
            <input className={inputClass} {...register('tenantSecret', { required: true })} placeholder="Used for inviting staff" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-600">Username</label>
            <input className={inputClass} {...register('username', { required: true })} placeholder="dean.richards" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Email</label>
            <input type="email" className={inputClass} {...register('email', { required: true })} placeholder="you@northstar.edu" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600">Password</label>
          <input type="password" className={inputClass} {...register('password', { required: true, minLength: 4 })} placeholder="Minimum 4 characters" />
        </div>

        <Button disabled={loading} className="h-12 w-full rounded-2xl bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400 text-base font-semibold shadow-lg shadow-sky-500/25">
          {loading ? 'Creating…' : 'Create tenant'}
        </Button>
      </form>

      <div className="mt-6 text-sm text-slate-500">
        Already configured your tenant?{' '}
        <Link className="font-medium text-indigo-600 hover:text-indigo-500" to="/login">
          Login
        </Link>
      </div>
    </AuthShell>
  );
}