import { Link } from '@inertiajs/react';
import { ClipboardCheck } from 'lucide-react';
import { StatusBadge } from '@/components/rms/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { InterviewDetails } from './types';

export function EvaluationSection({
    interview,
    evaluation,
    canEvaluate,
}: {
    interview: InterviewDetails;
    evaluation: { id: number; overall_score: string } | null;
    canEvaluate: boolean;
}) {
    const sessionIsActive = ['SCHEDULED', 'RESCHEDULED'].includes(
        interview.status,
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Evaluation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {evaluation ? (
                    <div className="rounded-md border p-3">
                        <p className="font-medium">
                            Your score: {evaluation.overall_score}/100
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Your evaluation has been submitted.
                        </p>
                    </div>
                ) : canEvaluate && sessionIsActive ? (
                    <Button asChild>
                        <Link href={`/interviews/${interview.id}/evaluation`}>
                            <ClipboardCheck className="size-4" />
                            Submit evaluation
                        </Link>
                    </Button>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Evaluation is unavailable for this session.
                    </p>
                )}
                {interview.evaluations.map((item) => (
                    <div
                        key={item.id}
                        className="rounded-md border p-3 text-sm"
                    >
                        <p className="font-medium">
                            {item.evaluator.name} · {item.overall_score}/100
                        </p>
                        <p>
                            <StatusBadge status={item.recommendation} />
                        </p>
                        <p className="whitespace-pre-wrap text-muted-foreground">
                            {item.comments}
                        </p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
