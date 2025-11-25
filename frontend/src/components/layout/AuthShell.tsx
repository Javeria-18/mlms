import { type ReactNode } from 'react';
import { BookOpenCheck, LineChart, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

type AuthShellProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  helper?: ReactNode;
  className?: string;
};

const highlights = [
  {
    title: 'Unified learning spaces',
    description: 'Courses, quizzes, assignments, and analytics—together in one calm surface.',
    icon: BookOpenCheck,
  },
  {
    title: 'Insightful analytics',
    description: 'Real-time data for admins, teachers, and students with friendly visuals.',
    icon: LineChart,
  },
  {
    title: 'Tenant-grade security',
    description: 'Each school stays isolated with strict tenant-aware access controls.',
    icon: ShieldCheck,
  },
];

export function AuthShell({ children, title, subtitle, eyebrow, helper, className }: AuthShellProps) {
  return (
    <div className={cn('relative min-h-screen overflow-hidden px-4 py-10 text-white sm:px-8 lg:px-12', className)}>
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(99,102,241,0.3),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(12,74,110,0.4),_rgba(2,6,23,0.6))]" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="glass-panel rounded-3xl border border-white/10 p-8 sm:p-10">
          {eyebrow && (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100/80">
              {eyebrow}
            </span>
          )}
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl">{title}</h1>
          {subtitle && <p className="mt-4 text-base text-slate-200/90 sm:text-lg">{subtitle}</p>}

          <div className="mt-8 grid gap-6">
            {highlights.map(({ title: itemTitle, description, icon: Icon }) => (
              <div key={itemTitle} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-100/90">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <Icon className="h-5 w-5 text-sky-200" />
                </div>
                <div>
                  <p className="font-semibold text-white">{itemTitle}</p>
                  <p className="text-xs text-slate-200/80">{description}</p>
                </div>
              </div>
            ))}
          </div>

          {helper && <div className="mt-8 text-sm text-slate-200/80">{helper}</div>}
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-2xl shadow-indigo-500/10 sm:p-9">
          {children}
        </div>
      </div>
    </div>
  );
}



