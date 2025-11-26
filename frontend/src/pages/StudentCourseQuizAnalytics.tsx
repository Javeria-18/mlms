// src/pages/StudentCourseQuizAnalytics.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { getStudentCourseQuizAnalytics, exportQuizAnalyticsPDF } from '@/api/analytics';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
type QuizHistory = {
    score: number;
    createdAt: string;
};

type Quiz = {
    id: string;
    title: string;
    totalPoints: number;
    lastScore: number | null;
    history: QuizHistory[];
};

type QuizAnalyticsData = {
    courseId: string;
    courseTitle: string;
    quizzes?: Quiz[];  // Make quizzes optional
};


export default function StudentCourseQuizAnalytics() {
    const { courseId } = useParams<{ courseId: string }>();
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<QuizAnalyticsData | null>(null);

    useEffect(() => {
        if (!courseId) return;
        setLoading(true);
        setError(null);
        getStudentCourseQuizAnalytics(courseId)
            .then(setData)
            .catch((e: any) => setError(e?.response?.data?.error || 'Failed to load quiz analytics'))
            .finally(() => setLoading(false));
    }, [courseId]);

    const handleExportPDF = async () => {
        if (!courseId) return;
        try {
            setExporting(true);
            const blob = await exportQuizAnalyticsPDF(courseId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `my_quiz_analytics_${courseId}_${new Date().getTime()}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (error) {
            console.error('Export failed:', error);
            setError('Failed to export PDF');
        } finally {
            setExporting(false);
        }
    };

    return (
        <AppLayout>
            <div className="space-y-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-semibold">My Quiz Analytics</h1>
                        <p className="text-sm text-gray-600">
                            Course: {data?.courseTitle || courseId}
                        </p>
                        <div className="mt-2 text-xs">
                            <Link to="/dashboard" className="text-blue-600 hover:underline">
                                ← Back to dashboard
                            </Link>
                        </div>
                    </div>
                    <Button
                        onClick={handleExportPDF}
                        disabled={exporting || !data}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        {exporting ? 'Exporting...' : 'Export PDF'}
                    </Button>
                </div>

                {loading && <div className="text-sm text-gray-600">Loading...</div>}
                {error && <div className="text-sm text-red-600">Error: {error}</div>}

                {!loading && !error && data && (
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                        {data.quizzes && data.quizzes.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Score</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Points</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Attempt</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {data.quizzes.map((quiz) => (
                                        <tr key={quiz.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quiz.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {quiz.lastScore !== null ? `${quiz.lastScore}%` : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {quiz.totalPoints}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {quiz.history.length > 0
                                                    ? new Date(quiz.history[quiz.history.length - 1].createdAt).toLocaleDateString()
                                                    : 'No attempts'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="p-4 text-sm text-gray-500">No quizzes found</p>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}