import { Download, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Detail } from './detail';
import type { AdminApplication } from './types';

export function CandidateSummary({
    application,
}: {
    application: AdminApplication;
}) {
    const profile = application.applicant.applicant_profile;

    return (
        <>
            <div className="grid gap-4 xl:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Candidate profile</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
                        <Detail
                            label="Email"
                            value={application.applicant.email}
                        />
                        <Detail
                            label="Phone"
                            value={application.applicant.phone || '—'}
                        />
                        <Detail
                            label="Date of birth"
                            value={profile?.date_of_birth?.slice(0, 10) || '—'}
                        />
                        <Detail
                            label="State of origin"
                            value={profile?.state_of_origin || '—'}
                        />
                        <Detail
                            label="Nationality"
                            value={profile?.nationality || '—'}
                        />
                        <Detail
                            label="Address"
                            value={profile?.address || '—'}
                        />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Application</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <Detail
                            label="Department"
                            value={application.vacancy.department.name}
                        />
                        <Detail
                            label="Submitted"
                            value={new Date(
                                application.submitted_at,
                            ).toLocaleString()}
                        />
                        <div>
                            <p className="text-xs text-muted-foreground uppercase">
                                Cover letter
                            </p>
                            <p className="mt-1 whitespace-pre-wrap">
                                {application.cover_letter ||
                                    'No cover letter provided.'}
                            </p>
                        </div>
                        <div className="space-y-2 border-t pt-3">
                            <p className="font-medium">Documents</p>
                            {application.documents.length ? (
                                application.documents.map((document) => (
                                    <a
                                        key={document.id}
                                        href={`/application-documents/${document.id}/download`}
                                        className="flex items-center justify-between gap-3 rounded-md border p-2.5 hover:bg-muted/50"
                                    >
                                        <span className="flex min-w-0 items-center gap-2">
                                            <FileText className="size-4 shrink-0 text-primary" />
                                            <span className="truncate">
                                                {document.document_name}
                                            </span>
                                        </span>
                                        <Download className="size-4 shrink-0" />
                                    </a>
                                ))
                            ) : (
                                <p className="text-muted-foreground">
                                    No documents uploaded.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Qualifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {profile?.qualifications.length ? (
                            profile.qualifications.map((qualification) => (
                                <div
                                    key={qualification.id}
                                    className="rounded-lg border p-3"
                                >
                                    <p className="font-medium">
                                        {qualification.qualification} ·{' '}
                                        {qualification.field_of_study}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {qualification.institution_name} ·{' '}
                                        {qualification.graduation_year}
                                        {qualification.grade
                                            ? ` · ${qualification.grade}`
                                            : ''}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No qualifications listed.
                            </p>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Work experience</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {profile?.work_experiences.length ? (
                            profile.work_experiences.map((experience) => (
                                <div
                                    key={experience.id}
                                    className="rounded-lg border p-3"
                                >
                                    <p className="font-medium">
                                        {experience.job_title} ·{' '}
                                        {experience.organization}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {experience.start_date.slice(0, 10)} –{' '}
                                        {experience.is_current
                                            ? 'Present'
                                            : experience.end_date?.slice(
                                                  0,
                                                  10,
                                              ) || '—'}
                                    </p>
                                    {experience.responsibilities ? (
                                        <p className="mt-2 text-sm whitespace-pre-wrap">
                                            {experience.responsibilities}
                                        </p>
                                    ) : null}
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No work experience listed.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
