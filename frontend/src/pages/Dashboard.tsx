import { AppLayout } from '@/components/layout/AppLayout';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import {
    getAdminDashboardSummary,
    getTeacherDashboardSummary,
    getStudentDashboardSummary,
} from '@/api/dashboard';
import { Link } from 'react-router-dom';

type AdminSummary = {
    users: {
        total: number;
        byRole: {
            Teacher?: number;
            Student?: number;
            [key: string]: number | undefined;
        };
    };
    totalCourses: number;
    totalEnrollments: number;
    performance: {
        quiz: { avgScore: number; submittedCount: number };
        assignment: { avgGrade: number; gradedCount: number };
    };
    optional?: {
        newEnrollments7d?: number;
        [key: string]: number | undefined;
    };
};

type TeacherCourseSummaryItem = {
    courseId: string;
    title: string;
    enrolled: number;
    quizAvgScore: number;
    assignmentAvgGrade: number;
};

type TeacherSummary = {
    myCourses: number;
    courseSummary: TeacherCourseSummaryItem[];
    recentSubmissions: any[];
};

type StudentCourseSummaryItem = {
    courseId: string;
    title: string;
    quizAvgScore: number;
    assignmentAvgGrade: number;
    totalVideos: number;
    videosCompleted: number;
    allVideosWatched: boolean;
};

type StudentSummary = {
    myCourses: number;
    courseSummary: StudentCourseSummaryItem[];
};

type Role = 'Admin' | 'Teacher' | 'Student' | null | undefined;

export function Dashboard() {
    const role = useAuthStore((s) => s.role) as Role;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [adminData, setAdminData] = useState<AdminSummary | null>(null);
    const [teacherData, setTeacherData] = useState<TeacherSummary | null>(null);
    const [studentData, setStudentData] = useState<StudentSummary | null>(null);
    const heroCopy = {
        Admin: {
            title: 'Command the entire learning network',
            subtitle: 'Track enrollment growth, course health, and performance trends across every tenant space.',
        },
        Teacher: {
            title: 'Orchestrate teaching with confidence',
            subtitle: 'See how each course is performing and close the loop on submissions in minutes.',
        },
        Student: {
            title: 'Stay ahead in every course',
            subtitle: 'Monitor quiz scores, assignment grades, and video progress from one calm dashboard.',
        },
        default: {
            title: 'Loading your workspace',
            subtitle: 'We are fetching role-specific insights for your tenant.',
        },
    } as const;

    useEffect(() => {
        if (!role) return;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                if (role === 'Admin') {
                    const data = await getAdminDashboardSummary();
                    setAdminData(data);
                    setTeacherData(null);
                    setStudentData(null);
                } else if (role === 'Teacher') {
                    const data = await getTeacherDashboardSummary();
                    setTeacherData(data);
                    setAdminData(null);
                    setStudentData(null);
                } else if (role === 'Student') {
                    const data = await getStudentDashboardSummary();
                    setStudentData(data);
                    setAdminData(null);
                    setTeacherData(null);
                }
            } catch (e: any) {
                setError(e?.response?.data?.error || 'Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [role]);

    if (!role) {
        return (
            <AppLayout>
                <div className="space-y-6">
                    <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
                        <p className="text-sm font-medium text-slate-600">Dashboard</p>
                        <p className="text-sm text-slate-500 mt-2">Loading user role...</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const hero = heroCopy[role];
    const refreshedAt = new Date().toLocaleString();
    const adminStatsData = adminData
        ? [
              {
                  label: 'Total users',
                  value: adminData.users.total.toLocaleString(),
                  helper: `Teachers ${adminData.users.byRole.Teacher ?? 0} · Students ${adminData.users.byRole.Student ?? 0}`,
                  gradient: 'from-sky-50/80 via-white to-white',
              },
              {
                  label: 'Courses',
                  value: adminData.totalCourses.toLocaleString(),
                  helper: 'Published across the tenant',
                  gradient: 'from-indigo-50/80 via-white to-white',
              },
              {
                  label: 'Enrollments',
                  value: adminData.totalEnrollments.toLocaleString(),
                  helper: 'Active learners across courses',
                  gradient: 'from-emerald-50/80 via-white to-white',
              },
              {
                  label: 'Avg assignment grade',
                  value: `${adminData.performance.assignment.avgGrade.toFixed(1)}%`,
                  helper: `${adminData.performance.assignment.gradedCount} graded submissions`,
                  gradient: 'from-amber-50/80 via-white to-white',
              },
          ]
        : [];

    return (
        <AppLayout>
            <div className="space-y-8">
                <div className="rounded-3xl border border-slate-100 bg-gradient-to-br from-slate-50 via-white to-white p-6 shadow-sm shadow-slate-200">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                                {role} space
                            </p>
                            <h1 className="mt-2 text-3xl font-semibold text-slate-900">{hero.title}</h1>
                            <p className="text-sm text-slate-600">{hero.subtitle}</p>
                        </div>
                        <div className="rounded-2xl bg-white/80 px-4 py-3 text-sm text-slate-500 shadow-inner shadow-slate-200">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Last refreshed</p>
                            <p className="mt-1 text-sm font-semibold text-slate-900">{refreshedAt}</p>
                        </div>
                    </div>
                </div>

                {loading && (
                    <div className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-500 shadow-sm">
                        Loading dashboard data...
                    </div>
                )}

                {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
                        Error: {error}
                    </div>
                )}

                {!loading && !error && role === 'Admin' && adminData && (
                    <div className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            {adminStatsData.map((stat) => (
                                <div
                                    key={stat.label}
                                    className={`rounded-3xl border border-slate-100 bg-gradient-to-br ${stat.gradient} p-5 shadow-sm shadow-slate-200`}
                                >
                                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
                                    <p className="mt-3 text-3xl font-semibold text-slate-900">{stat.value}</p>
                                    <p className="mt-2 text-sm text-slate-500">{stat.helper}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid gap-4 lg:grid-cols-2">
                            <div className="rounded-3xl border border-slate-100 bg-white/90 p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900">Quiz performance</h2>
                                        <p className="text-sm text-slate-500">Submitted attempts: {adminData.performance.quiz.submittedCount}</p>
                                    </div>
                                    <Link
                                        to="/analytics/courses?mode=quiz"
                                        className="inline-flex items-center rounded-full bg-slate-900/5 px-4 py-1.5 text-sm font-semibold text-sky-600 hover:bg-sky-50"
                                    >
                                        View analytics
                                    </Link>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-slate-100 bg-white/90 p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900">Assignment performance</h2>
                                        <p className="text-sm text-slate-500">
                                            Avg grade {adminData.performance.assignment.avgGrade.toFixed(1)}% ·{' '}
                                            {adminData.performance.assignment.gradedCount} graded submissions
                                        </p>
                                    </div>
                                    <Link
                                        to="/analytics/courses?mode=assignment"
                                        className="inline-flex items-center rounded-full bg-slate-900/5 px-4 py-1.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
                                    >
                                        View analytics
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-100 bg-white/90 p-5 shadow-sm">
                            <h2 className="text-lg font-semibold text-slate-900">New enrollments (7 days)</h2>
                            <p className="mt-2 text-3xl font-semibold text-slate-900">{adminData.optional?.newEnrollments7d ?? 0}</p>
                            <p className="text-sm text-slate-500">Fresh learners joining your tenant</p>
                        </div>
                    </div>
                )}

                {!loading && !error && role === 'Teacher' && teacherData && (
                    <div className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="rounded-3xl border border-slate-100 bg-white/90 p-5 shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">My courses</p>
                                <p className="mt-3 text-3xl font-semibold text-slate-900">{teacherData.myCourses}</p>
                                <p className="text-sm text-slate-500">Active teaching spaces</p>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-100 bg-white/95 p-5 shadow-sm">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                                <h2 className="text-lg font-semibold text-slate-900">Course summary</h2>
                                <p className="text-sm text-slate-500">
                                    {teacherData.courseSummary.length} course{teacherData.courseSummary.length === 1 ? '' : 's'}
                                </p>
                            </div>
                            {teacherData.courseSummary.length === 0 ? (
                                <p className="mt-4 text-sm text-slate-500">No courses yet.</p>
                            ) : (
                                <div className="mt-4 overflow-x-auto">
                                    <table className="min-w-full text-sm">
                                        <thead>
                                            <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                                                <th className="px-3 py-2">Course</th>
                                                <th className="px-3 py-2">Enrolled</th>
                                                <th className="px-3 py-2">Quiz avg</th>
                                                <th className="px-3 py-2">Assignment avg</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {teacherData.courseSummary.map((c) => (
                                                <tr key={c.courseId} className="border-t border-slate-100">
                                                    <td className="px-3 py-3 font-medium text-slate-900">{c.title || c.courseId}</td>
                                                    <td className="px-3 py-3 text-slate-600">{c.enrolled}</td>
                                                    <td className="px-3 py-3">
                                                        <Link
                                                            to={`/analytics/courses/${c.courseId}/quizzes`}
                                                            className="text-sm font-semibold text-sky-600 hover:text-sky-500"
                                                        >
                                                            View
                                                        </Link>
                                                    </td>
                                                    <td className="px-3 py-3">
                                                        <Link
                                                            to={`/analytics/courses/${c.courseId}/assignments`}
                                                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                                                        >
                                                            View
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div className="rounded-3xl border border-slate-100 bg-white/95 p-5 shadow-sm">
                            <h2 className="text-lg font-semibold text-slate-900">Recent submissions</h2>
                            {teacherData.recentSubmissions.length === 0 ? (
                                <p className="mt-4 text-sm text-slate-500">No recent submissions.</p>
                            ) : (
                                <ul className="mt-4 divide-y divide-slate-100 text-sm">
                                    {teacherData.recentSubmissions.map((s) => (
                                        <li key={s.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className="font-semibold text-slate-900">
                                                    {s.student?.username || s.student?.id || 'Unknown student'}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    Course: {s.course?.title || s.course?.id || 'Unknown course'}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    Assignment: {s.assignment?.title || s.assignment?.id} ({s.assignment?.id})
                                                </p>
                                            </div>
                                            <div className="text-xs text-slate-400">
                                                {s.createdAt && <span>{new Date(s.createdAt).toLocaleString()}</span>}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}

                {!loading && !error && role === 'Student' && studentData && (
                    <div className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="rounded-3xl border border-slate-100 bg-white/90 p-5 shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">My courses</p>
                                <p className="mt-3 text-3xl font-semibold text-slate-900">{studentData.myCourses}</p>
                                <p className="text-sm text-slate-500">Active enrollments</p>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-100 bg-white/95 p-5 shadow-sm">
                            <h2 className="text-lg font-semibold text-slate-900">Course progress</h2>
                            {studentData.courseSummary.length === 0 ? (
                                <p className="mt-4 text-sm text-slate-500">You are not enrolled in any courses yet.</p>
                            ) : (
                                <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                    {studentData.courseSummary.map((c) => {
                                        const videoText =
                                            c.totalVideos === 0
                                                ? 'No videos in this course'
                                                : `${c.videosCompleted}/${c.totalVideos} videos watched`;
                                        const progressPercent =
                                            c.totalVideos === 0 ? 0 : Math.round((c.videosCompleted / c.totalVideos) * 100);
                                        return (
                                            <div
                                                key={c.courseId}
                                                className="rounded-3xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm"
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <p className="text-base font-semibold text-slate-900">{c.title || c.courseId}</p>
                                                        <p className="mt-1 text-sm text-slate-500">
                                                            Quiz avg {c.quizAvgScore.toFixed(1)} · Assignment avg{' '}
                                                            {c.assignmentAvgGrade.toFixed(1)}
                                                        </p>
                                                    </div>
                                                    {c.allVideosWatched && c.totalVideos > 0 && (
                                                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                                                            All videos watched
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="mt-4 space-y-2">
                                                    <div className="flex justify-between text-xs font-medium text-slate-500">
                                                        <span>Video progress</span>
                                                        {c.totalVideos > 0 && <span>{progressPercent}%</span>}
                                                    </div>
                                                    {c.totalVideos > 0 ? (
                                                        <>
                                                            <div className="h-2 w-full rounded-full bg-slate-200/70">
                                                                <div
                                                                    className="h-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all"
                                                                    style={{ width: `${progressPercent}%` }}
                                                                />
                                                            </div>
                                                            <p className="text-xs text-slate-500">{videoText}</p>
                                                        </>
                                                    ) : (
                                                        <p className="text-xs text-slate-500">{videoText}</p>
                                                    )}
                                                </div>

                                                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                                                    <Link
                                                        to={`/me/analytics/courses/${c.courseId}/quizzes`}
                                                        className="rounded-full border border-slate-200 px-3 py-1 text-sky-600 hover:bg-sky-50"
                                                    >
                                                        Quiz analytics
                                                    </Link>
                                                    <Link
                                                        to={`/me/analytics/courses/${c.courseId}/assignments`}
                                                        className="rounded-full border border-slate-200 px-3 py-1 text-indigo-600 hover:bg-indigo-50"
                                                    >
                                                        Assignment analytics
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}