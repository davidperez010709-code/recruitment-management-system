import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Send } from 'lucide-react';
import { PageHeader } from '@/components/rms/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type Interview = {
    id: number;
    interview_type: string;
    interview_date: string;
    application: { applicant: { name: string }; vacancy: { title: string } };
};

export default function EvaluationCreate({
    interview,
}: {
    interview: Interview;
}) {
    const form = useForm({
        technical_score: '',
        communication_score: '',
        experience_score: '',
        comments: '',
        recommendation: 'RECOMMEND',
    });

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.post(`/interviews/${interview.id}/evaluation`, {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Candidate evaluation" />
            <div className="space-y-6 p-4 md:p-6">
                <Button variant="ghost" asChild>
                    <Link href={`/interviews/${interview.id}`}>
                        <ArrowLeft className="size-4" />
                        Interview details
                    </Link>
                </Button>
                <PageHeader
                    title="Candidate evaluation"
                    description={`${interview.application.applicant.name} · ${interview.application.vacancy.title} · ${new Date(interview.interview_date).toLocaleString()}`}
                />
                <Card>
                    <CardHeader>
                        <CardTitle>Score and recommendation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-3">
                                {(
                                    [
                                        'technical_score',
                                        'communication_score',
                                        'experience_score',
                                    ] as const
                                ).map((field) => (
                                    <label
                                        key={field}
                                        className="space-y-1.5 text-sm"
                                    >
                                        {field
                                            .replace('_score', '')
                                            .replace('_', ' ')}{' '}
                                        score (0–100)
                                        <Input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            value={form.data[field]}
                                            onChange={(e) =>
                                                form.setData(
                                                    field,
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {form.errors[field] ? (
                                            <span className="text-xs text-destructive">
                                                {form.errors[field]}
                                            </span>
                                        ) : null}
                                    </label>
                                ))}
                            </div>
                            <label className="block space-y-1.5 text-sm">
                                Recommendation
                                <select
                                    className={selectClass}
                                    value={form.data.recommendation}
                                    onChange={(e) =>
                                        form.setData(
                                            'recommendation',
                                            e.target.value,
                                        )
                                    }
                                >
                                    <option value="STRONGLY_RECOMMEND">
                                        Strongly recommend
                                    </option>
                                    <option value="RECOMMEND">Recommend</option>
                                    <option value="RESERVE">Reserve</option>
                                    <option value="DO_NOT_RECOMMEND">
                                        Do not recommend
                                    </option>
                                </select>
                                {form.errors.recommendation ? (
                                    <span className="text-xs text-destructive">
                                        {form.errors.recommendation}
                                    </span>
                                ) : null}
                            </label>
                            <label className="block space-y-1.5 text-sm">
                                Comments
                                <textarea
                                    className={textareaClass}
                                    rows={5}
                                    value={form.data.comments}
                                    onChange={(e) =>
                                        form.setData('comments', e.target.value)
                                    }
                                />
                            </label>
                            <div className="flex justify-end">
                                <Button disabled={form.processing}>
                                    <Send className="size-4" />
                                    Submit evaluation
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

const selectClass =
    'h-9 w-full rounded-md border border-input bg-background px-3 text-sm';
const textareaClass =
    'w-full rounded-md border border-input bg-background px-3 py-2 text-sm';
EvaluationCreate.layout = {
    breadcrumbs: [
        { title: 'Interviews', href: '/interviews' },
        { title: 'Evaluation', href: '#' },
    ],
};
