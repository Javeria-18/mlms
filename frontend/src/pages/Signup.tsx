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
  role: 'Teacher' | 'Student';
};

export default function Signup() {
  const { register, handleSubmit } = useForm<Form>({ defaultValues: { role: 'Student' } });
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (v: Form) => {
    setError(null); setLoading(true);
    try {
      await signup(v);
      navigate('/login', { replace: true });
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100';

  return (
    <AuthShell
      title="Invite your educators"
      subtitle="Teachers and students join existing tenants with a polished onboarding flow."
      eyebrow="Collaborative accounts"
      helper={
        <>
          Need an admin space first?{' '}
          <Link className="text-emerald-200 underline-offset-4 hover:underline" to="/signup/admin">
            Create tenant
          </Link>
        </>
      }
    >
      <div className="mb-8 space-y-2">
        <p className="text-2xl font-semibold text-slate-900">Teacher & Student signup</p>
        <p className="text-sm text-slate-500">Provide the tenant credentials shared with you.</p>
        {error && <div className="rounded-2xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-600">Tenant ID</label>
            <input className={inputClass} {...register('tenantId', { required: true })} placeholder="acme-university" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Tenant Secret</label>
            <input className={inputClass} {...register('tenantSecret', { required: true })} placeholder="Shared tenant key" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-600">Role</label>
            <select className={inputClass} {...register('role', { required: true })}>
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Username</label>
            <input className={inputClass} {...register('username', { required: true })} placeholder="zoe.tan" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600">Email</label>
          <input type="email" className={inputClass} {...register('email', { required: true })} placeholder="teacher@acme.edu" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600">Password</label>
          <input type="password" className={inputClass} {...register('password', { required: true, minLength: 4 })} placeholder="Minimum 4 characters" />
        </div>

        <Button disabled={loading} className="h-12 w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-sky-500 text-base font-semibold text-white shadow-lg shadow-emerald-500/20">
          {loading ? 'Creating…' : 'Create account'}
        </Button>
      </form>

      <div className="mt-6 text-sm text-slate-500">
        Already have an account?{' '}
        <Link className="font-medium text-emerald-600 hover:text-emerald-500" to="/login">
          Login
        </Link>
      </div>
    </AuthShell>
  );
}