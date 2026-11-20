import { StatusBadge } from '@/components/rms/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AdminApplication } from './types';

export function InterviewHistorySection({
    application,
}: {
    application: AdminApplication;
}) {
    return (
        <Card className="xl:col-span-2">
            <CardHeader>
                <CardTitle>Interviews and evaluations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {application.interviews.length ? (
                    application.interviews.map((interview) => (
                        <div
                            key={interview.id}
                            className="rounded-lg border p-4"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="font-medium">
                                        {interview.interview_type}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(
                                            interview.interview_date,
                                        ).toLocaleString()}
                                    </p>
                                </div>
                                <StatusBadge status={interview.status} />
                            </div>
                            <p className="mt-3 text-xs font-medium text-muted-foreground uppercase">
                                Panel:{' '}
                                {interview.panel_members
                                    .map((member) => member.name)
                                    .join(', ') || 'Not assigned'}
                            </p>
                            <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                {interview.evaluations.map((evaluation) => (
                                    <div
                                        key={evaluation.id}
                                        className="rounded-md bg-muted/60 p-3 text-sm"
                                    >
                                        <p className="font-medium">
                                            {evaluation.evaluator.name} ·{' '}
                                            {evaluation.overall_score}/100
                                        </p>
                                        <p>
                                            {evaluation.recommendation.replaceAll(
                                                '_',
                                                ' ',
                                            )}
                                        </p>
                                        <p className="whitespace-pre-wrap text-muted-foreground">
                                            {evaluation.comments}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground">
                        No interviews scheduled.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
