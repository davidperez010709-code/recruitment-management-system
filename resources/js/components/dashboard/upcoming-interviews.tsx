import { Link } from '@inertiajs/react';
import { EmptyState } from '@/components/rms/empty-state';
import { StatusBadge } from '@/components/rms/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { InterviewRow } from './types';

export function UpcomingInterviews({
    interviews,
    interviewer = false,
}: {
    interviews: InterviewRow[];
    interviewer?: boolean;
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Upcoming interviews</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/interviews">View all</Link>
                </Button>
            </CardHeader>
            <CardContent className="space-y-3">
                {interviews.length ? (
                    interviews.map((interview) => (
                        <Link
                            key={interview.id}
                            href={`/interviews/${interview.id}`}
                            className="flex items-center justify-between gap-3 rounded-lg border p-3 hover:bg-muted/50"
                        >
                            <div>
                                <p className="font-medium">
                                    {interview.application.vacancy.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {interviewer
                                        ? `${interview.application.applicant.name} · `
                                        : ''}
                                    {interview.interview_type} ·{' '}
                                    {new Date(
                                        interview.interview_date,
                                    ).toLocaleString()}
                                </p>
                            </div>
                            <StatusBadge status={interview.status} />
                        </Link>
                    ))
                ) : (
                    <EmptyState
                        title="No upcoming interviews"
                        description="Scheduled sessions will appear here."
                    />
                )}
            </CardContent>
        </Card>
    );
}
