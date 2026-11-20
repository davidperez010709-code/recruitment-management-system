import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    BriefcaseBusiness,
    CalendarClock,
    CheckCircle2,
    ClipboardList,
    FileCheck2,
    UserRound,
    UsersRound,
    Video,
} from 'lucide-react';
import { AdminDashboard } from '@/components/dashboard/admin-dashboard';
import { ApplicantDashboard } from '@/components/dashboard/applicant-dashboard';
import { InterviewerDashboard } from '@/components/dashboard/interviewer-dashboard';
import type {
    ApplicationRow,
    EvaluationRow,
    InterviewRow,
    NotificationRow,
} from '@/components/dashboard/types';
import { MetricCard } from '@/components/rms/metric-card';
import { PageHeader } from '@/components/rms/page-header';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';

type Audience = 'admin' | 'applicant' | 'interviewer';

type Props = {
    audience: Audience;
    stats: Record<string, number>;
    monthlyActivity?: { month: string; applications: number }[];
    statusDistribution?: { status: string; total: number | string }[];
    applicationsByVacancy?: {
        id: number;
        title: string;
        applications_count: number;
    }[];
    recentApplications?: ApplicationRow[];
    upcomingInterviews?: InterviewRow[];
    evaluationHistory?: EvaluationRow[];
    notifications?: NotificationRow[];
};

const audienceContent = {
    admin: {
        title: 'Recruitment overview',
        description:
            'A live overview of recruitment activity and the current candidate pipeline.',
    },
    interviewer: {
        title: 'Interview dashboard',
        description:
            'Review your assigned sessions and outstanding evaluations.',
    },
    applicant: {
        title: 'Applicant dashboard',
        description:
            'Track your profile, applications, and upcoming recruitment activity.',
    },
} satisfies Record<Audience, { title: string; description: string }>;

/** Role-aware shell; each audience's widgets live in its own component. */
export default function Dashboard({
    audience,
    stats,
    monthlyActivity = [],
    statusDistribution = [],
    applicationsByVacancy = [],
    recentApplications = [],
    upcomingInterviews = [],
    evaluationHistory = [],
    notifications = [],
}: Props) {
    const metrics = getMetrics(audience, stats);

    return (
        <>
            <Head title="Dashboard" />
            <div className="space-y-6 p-4 md:p-6">
                <PageHeader
                    title={audienceContent[audience].title}
                    description={audienceContent[audience].description}
                    action={
                        audience === 'applicant' ? (
                            <Button asChild>
                                <Link href="/vacancies">Browse vacancies</Link>
                            </Button>
                        ) : undefined
                    }
                />
                <div
                    className={`grid gap-4 sm:grid-cols-2 ${audience === 'admin' ? 'xl:grid-cols-4' : 'xl:grid-cols-3'}`}
                >
                    {metrics.map(([label, value, icon]) => (
                        <MetricCard
                            key={label}
                            label={label}
                            value={value ?? 0}
                            icon={icon}
                        />
                    ))}
                </div>

                {audience === 'admin' ? (
                    <AdminDashboard
                        monthlyActivity={monthlyActivity}
                        statusDistribution={statusDistribution}
                        applicationsByVacancy={applicationsByVacancy}
                        recentApplications={recentApplications}
                        upcomingInterviews={upcomingInterviews}
                    />
                ) : audience === 'applicant' ? (
                    <ApplicantDashboard
                        applications={recentApplications}
                        interviews={upcomingInterviews}
                        notifications={notifications}
                    />
                ) : (
                    <InterviewerDashboard
                        interviews={upcomingInterviews}
                        evaluations={evaluationHistory}
                    />
                )}
            </div>
        </>
    );
}

function getMetrics(audience: Audience, stats: Record<string, number>) {
    const metrics = {
        admin: [
            ['Applicants', stats.totalApplicants, UsersRound],
            ['Active vacancies', stats.activeVacancies, BriefcaseBusiness],
            ['Applications', stats.totalApplications, ClipboardList],
            ['Pending review', stats.pendingReview, Activity],
            ['Shortlisted', stats.shortlisted, CheckCircle2],
            ['Scheduled interviews', stats.scheduledInterviews, Video],
            ['Selected candidates', stats.successfulCandidates, FileCheck2],
        ],
        applicant: [
            [
                'Profile completion',
                `${stats.profileCompletion ?? 0}%`,
                UserRound,
            ],
            [
                'Available vacancies',
                stats.availableVacancies,
                BriefcaseBusiness,
            ],
            [
                'Applications submitted',
                stats.applicationsSubmitted,
                ClipboardList,
            ],
            ['Under review', stats.underReview, Activity],
            ['Shortlisted', stats.shortlisted, CheckCircle2],
            ['Upcoming interviews', stats.upcomingInterviews, CalendarClock],
        ],
        interviewer: [
            ['Assigned interviews', stats.assignedInterviews, Video],
            ['Upcoming sessions', stats.upcomingInterviews, CalendarClock],
            ['Completed interviews', stats.completedInterviews, CheckCircle2],
            ['Pending evaluations', stats.pendingEvaluations, ClipboardList],
        ],
    } as const;

    return metrics[audience];
}

Dashboard.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' } satisfies BreadcrumbItem,
    ],
};
