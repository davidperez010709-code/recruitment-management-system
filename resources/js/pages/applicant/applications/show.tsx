import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { PageHeader } from '@/components/rms/page-header';
import { StatusBadge } from '@/components/rms/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Application = {
    id: number;
    application_number: string;
    cover_letter: string | null;
    status: string;
    submitted_at: string;
    vacancy: {
        title: string;
        reference_number: string;
        department: { name: string };
    };
    documents: {
        id: number;
        document_type: string;
        document_name: string;
        file_size: number;
    }[];
    interviews: {
        id: number;
        interview_type: string;
        interview_date: string;
        location: string | null;
        instructions: string | null;
        status: string;
    }[];
};

export default function ApplicationShow({
    application,
}: {
    application: Application;
}) {
    return (
        <>
            <Head title={application.application_number} />
            <div className="space-y-6 p-4 md:p-6">
                <Button variant="ghost" asChild>
                    <Link href="/applications">
                        <ArrowLeft className="size-4" />
                        My applications
                    </Link>
                </Button>
                <PageHeader
                    title={application.vacancy.title}
                    description={`${application.vacancy.department.name} · ${application.application_number}`}
                    action={<StatusBadge status={application.status} />}
                />
                <div className="grid gap-4 xl:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Application details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <p>
                                <span className="text-muted-foreground">
                                    Submitted:
                                </span>{' '}
                                {new Date(
                                    application.submitted_at,
                                ).toLocaleString()}
                            </p>
                            <p>
                                <span className="text-muted-foreground">
                                    Reference:
                                </span>{' '}
                                {application.vacancy.reference_number}
                            </p>
                            <div>
                                <p className="mb-1 text-muted-foreground">
                                    Cover letter
                                </p>
                                <p className="whitespace-pre-wrap">
                                    {application.cover_letter ||
                                        'No cover letter provided.'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Supporting documents</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {application.documents.length ? (
                                application.documents.map((document) => (
                                    <div
                                        key={document.id}
                                        className="flex items-center justify-between gap-3 rounded-lg border p-3"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <FileText className="size-4 shrink-0 text-primary" />
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium">
                                                    {document.document_name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {document.document_type} ·{' '}
                                                    {(
                                                        document.file_size /
                                                        1024
                                                    ).toFixed(0)}{' '}
                                                    KB
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <a
                                                href={`/application-documents/${document.id}/download`}
                                            >
                                                <Download className="size-4" />
                                                Download
                                            </a>
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No files were attached.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="xl:col-span-2">
                        <CardHeader>
                            <CardTitle>Interview updates</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {application.interviews.length ? (
                                application.interviews.map((interview) => (
                                    <div
                                        key={interview.id}
                                        className="flex flex-wrap items-start justify-between gap-3 rounded-lg border p-4"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {interview.interview_type}
                                            </p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {new Date(
                                                    interview.interview_date,
                                                ).toLocaleString()}
                                                {interview.location
                                                    ? ` · ${interview.location}`
                                                    : ''}
                                            </p>
                                            {interview.instructions ? (
                                                <p className="mt-2 text-sm">
                                                    {interview.instructions}
                                                </p>
                                            ) : null}
                                        </div>
                                        <StatusBadge
                                            status={interview.status}
                                        />
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No interview has been scheduled for this
                                    application yet.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
ApplicationShow.layout = {
    breadcrumbs: [
        { title: 'My applications', href: '/applications' },
        { title: 'Application details', href: '#' },
    ],
};
