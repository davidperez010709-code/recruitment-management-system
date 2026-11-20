import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { EvaluationSection } from '@/components/interviewer/interviews/evaluation-section';
import { InterviewInformation } from '@/components/interviewer/interviews/interview-information';
import { ManageInterview } from '@/components/interviewer/interviews/manage-interview';
import { PanelMembers } from '@/components/interviewer/interviews/panel-members';
import type {
    InterviewDetails,
    PanelMemberOption,
} from '@/components/interviewer/interviews/types';
import { PageHeader } from '@/components/rms/page-header';
import { StatusBadge } from '@/components/rms/status-badge';
import { Button } from '@/components/ui/button';

/** Session page composition; management controls are only rendered for HR managers. */
export default function InterviewShow({
    interview,
    evaluation,
    canEvaluate,
    canManage,
    availablePanelMembers,
}: {
    interview: InterviewDetails;
    evaluation: { id: number; overall_score: string } | null;
    canEvaluate: boolean;
    canManage: boolean;
    availablePanelMembers: PanelMemberOption[];
}) {
    return (
        <>
            <Head title={`Interview ${interview.id}`} />
            <div className="space-y-6 p-4 md:p-6">
                <Button variant="ghost" asChild>
                    <Link href="/interviews">
                        <ArrowLeft className="size-4" />
                        Interviews
                    </Link>
                </Button>
                <PageHeader
                    title={interview.application.applicant.name}
                    description={`${interview.application.vacancy.title} · ${interview.interview_type}`}
                    action={<StatusBadge status={interview.status} />}
                />
                <div className="grid gap-4 xl:grid-cols-2">
                    <InterviewInformation interview={interview} />
                    <PanelMembers interview={interview} />
                    <EvaluationSection
                        interview={interview}
                        evaluation={evaluation}
                        canEvaluate={canEvaluate}
                    />
                    {canManage ? (
                        <ManageInterview
                            interview={interview}
                            availablePanelMembers={availablePanelMembers}
                        />
                    ) : null}
                </div>
            </div>
        </>
    );
}

InterviewShow.layout = {
    breadcrumbs: [
        { title: 'Interviews', href: '/interviews' },
        { title: 'Session', href: '#' },
    ],
};
