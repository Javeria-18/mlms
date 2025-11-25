import { Link, useLocation } from 'react-router-dom';
import { type ComponentType, type ReactNode, useMemo, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Bell,
  BookOpenCheck,
  GraduationCap,
  LayoutDashboard,
  LineChart,
  Menu,
  UsersRound,
  X,
} from 'lucide-react';

type Props = { children: ReactNode };

type NavItem = {
  label: string;
  to: string;
  icon: ComponentType<{ className?: string }>;
  match?: (path: string) => boolean;
  roles?: Array<'Admin' | 'Teacher' | 'Student'>;
};

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Courses', to: '/courses', icon: GraduationCap },
  { label: 'Assignments', to: '/assignments', icon: BookOpenCheck },
  { label: 'Quizzes', to: '/quizzes', icon: LineChart },
  { label: 'Notifications', to: '/notifications', icon: Bell },
  { label: 'Manage users', to: '/admin/users', icon: UsersRound, roles: ['Admin'] },
];

export function AppLayout({ children }: Props) {
  const { user, role, tenantId, logout } = useAuthStore();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const filteredNav = useMemo(() => {
    return navItems.filter((item) => {
      if (!item.roles) return true;
      if (!role) return false;
      return item.roles.includes(role);
    });
  }, [role]);

  const renderNavLinks = () =>
    filteredNav.map((item) => {
      const Icon = item.icon;
      const isActive =
        item.match?.(location.pathname) ?? location.pathname.startsWith(item.to);
      return (
        <Link
          key={item.label}
          to={item.to}
          onClick={() => setMobileNavOpen(false)}
          className={cn(
            'flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition',
            isActive
              ? 'bg-white/15 text-white shadow-inner shadow-indigo-500/20'
              : 'text-slate-300 hover:bg-white/10 hover:text-white',
          )}
        >
          <Icon className="h-4 w-4" />
          <span>{item.label}</span>
        </Link>
      );
    });

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.35),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(14,165,233,0.25),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,_rgba(15,23,42,0.9),_rgba(2,6,23,0.95))]" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-30 w-72 transform border-r border-white/10 bg-white/5 px-4 py-6 shadow-2xl backdrop-blur-2xl transition duration-300 md:static md:translate-x-0',
            mobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-slate-300">MLMS</p>
              <p className="text-lg font-semibold text-white">Learning Suite</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileNavOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="mt-8 space-y-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Navigation
          </div>
          <nav className="mt-3 flex flex-col gap-2">{renderNavLinks()}</nav>

          <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-200/90">
            <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Current session</p>
            <p className="mt-2 font-semibold text-white">{user?.username}</p>
            <p className="text-slate-300">
              {role} · {tenantId}
            </p>
          </div>
        </aside>

        {mobileNavOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setMobileNavOpen(false)}
          />
        )}

        {/* Main column */}
        <div className="relative flex flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b border-white/10 bg-white/5 px-4 shadow-lg shadow-black/10 backdrop-blur md:px-8">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white"
                onClick={() => setMobileNavOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Tenant</p>
                <p className="text-sm font-semibold text-white">{tenantId}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-white/80">
              <span className="hidden sm:flex items-center gap-2 rounded-2xl border border-white/15 px-3 py-1 text-xs font-semibold">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                {role}
              </span>
              <Button variant="ghost" className="text-white hover:bg-white/10" onClick={logout}>
                Logout
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-gradient-to-br from-white/90 via-white/70 to-white/75 text-slate-900">
            <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}