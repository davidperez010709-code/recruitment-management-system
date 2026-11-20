import { EmptyState } from '@/components/rms/empty-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UpcomingInterviews } from './upcoming-interviews';
import type { EvaluationRow, InterviewRow } from './types';

export function InterviewerDashboard({
    interviews,
    evaluations,
}: {
    interviews: InterviewRow[];
    evaluations: EvaluationRow[];
}) {
    return (
        <div className="grid gap-4 xl:grid-cols-2">
            <UpcomingInterviews interviews={interviews} interviewer />
            <Card>
                <CardHeader>
                    <CardTitle>Evaluation history</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {evaluations.length ? (
                        evaluations.map((evaluation) => (
                            <div
                                key={evaluation.id}
                                className="flex items-center justify-between gap-3 rounded-lg border p-3"
                            >
                                <div>
                                    <p className="font-medium">
                                        {
                                            evaluation.interview.application
                                                .vacancy.title
                                        }
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {evaluation.recommendation.replaceAll(
                                            '_',
                                            ' ',
                                        )}
                                    </p>
                                </div>
                                <span className="rounded-md border px-2 py-1 text-sm">
                                    {Number(evaluation.overall_score).toFixed(
                                        1,
                                    )}{' '}
                                    / 100
                                </span>
                            </div>
                        ))
                    ) : (
                        <EmptyState
                            title="No evaluations submitted"
                            description="Completed evaluations will be listed here."
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
