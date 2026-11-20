import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { CandidateSummary } from '@/components/admin/applications/candidate-summary';
import { InterviewHistorySection } from '@/components/admin/applications/interview-history-section';
import { RecruitmentDecisionSection } from '@/components/admin/applications/recruitment-decision-section';
import { ScreeningSection } from '@/components/admin/applications/screening-section';
import type { AdminApplication } from '@/components/admin/applications/types';
import { PageHeader } from '@/components/rms/page-header';
import { StatusBadge } from '@/components/rms/status-badge';
import { Button } from '@/components/ui/button';

/** Composes the candidate record and the separate workflow panels. */
export default function AdminApplicationShow({
    application,
}: {
    application: AdminApplication;
}) {
    return (
        <>
            <Head title={`Application ${application.application_number}`} />
            <div className="space-y-6 p-4 md:p-6">
                <Button variant="ghost" asChild>
                    <Link href="/admin/applications">
                        <ArrowLeft className="size-4" />
                        Applications
                    </Link>
                </Button>
                <PageHeader
                    title={application.applicant.name}
                    description={`${application.vacancy.title} · ${application.application_number}`}
                    action={<StatusBadge status={application.status} />}
                />
                <CandidateSummary application={application} />
                <div className="grid gap-4 xl:grid-cols-2">
                    <ScreeningSection application={application} />
                    <RecruitmentDecisionSection application={application} />
                    <InterviewHistorySection application={application} />
                </div>
            </div>
        </>
    );
}

AdminApplicationShow.layout = {
    breadcrumbs: [
        { title: 'Applications', href: '/admin/applications' },
        { title: 'Review', href: '#' },
    ],
};
