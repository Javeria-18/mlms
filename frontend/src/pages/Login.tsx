import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/auth';
import { useAuthStore } from '../store/auth';
import { AuthShell } from '@/components/layout/AuthShell';
import { Button } from '@/components/ui/button';

type Form = { tenantId: string; username: string; password: string };

export default function Login() {
  const { register, handleSubmit } = useForm<Form>({ defaultValues: { tenantId: '', username: '', password: '' } });
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: Form) => {
    setError(null); setLoading(true);
    try {
      const res = await login(values);
      setAuth({
        tenantId: res.user.tenantId,
        sessionToken: res.sessionToken,
        role: res.user.role,
        user: res.user,
      });
      navigate('/dashboard', { replace: true });
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back to MLMS"
      subtitle="Sign in to orchestrate courses, assessments, and analytics in one beautiful space."
      eyebrow="Multi-tenant learning"
      helper={
        <>
          Need a tenant?{' '}
          <Link to="/signup/admin" className="text-sky-200 underline-offset-4 hover:underline">
            Create an admin space
          </Link>
        </>
      }
    >
      <div className="mb-8 space-y-2">
        <p className="text-2xl font-semibold text-slate-900">Login</p>
        <p className="text-sm text-slate-500">Use your tenant credentials to continue.</p>
        {error && <div className="rounded-2xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600">Tenant ID</label>
          <input
            className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            {...register('tenantId', { required: true })}
            placeholder="acme-university"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600">Username</label>
          <input
            className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            {...register('username', { required: true })}
            placeholder="prof.kidman"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600">Password</label>
          <input
            type="password"
            className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            {...register('password', { required: true })}
            placeholder="••••••••"
          />
        </div>

        <Button disabled={loading} className="h-12 w-full rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 text-base font-semibold shadow-lg shadow-indigo-500/20">
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-500">
        <span>New tenant?</span>
        <Link className="font-medium text-sky-600 hover:text-sky-500" to="/signup/admin">
          Admin signup
        </Link>
        <span className="text-slate-400">·</span>
        <Link className="font-medium text-sky-600 hover:text-sky-500" to="/signup">
          Teacher/Student signup
        </Link>
      </div>
    </AuthShell>
  );
}

