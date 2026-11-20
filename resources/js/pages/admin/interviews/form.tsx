import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CalendarCheck } from 'lucide-react';
import { PageHeader } from '@/components/rms/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type CandidateApplication = {
    id: number;
    application_number: string;
    applicant: { name: string };
    vacancy: { title: string };
};
type PanelMember = { id: number; name: string; email: string };

export default function InterviewForm({
    applications,
    panelMembers,
}: {
    applications: CandidateApplication[];
    panelMembers: PanelMember[];
}) {
    const form = useForm({
        application_id: '',
        interview_type: 'Panel interview',
        interview_date: '',
        location: '',
        instructions: '',
        panel_member_ids: [] as number[],
    });

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.post('/admin/interviews', { preserveScroll: true });
    }

    function togglePanel(id: number) {
        form.setData(
            'panel_member_ids',
            form.data.panel_member_ids.includes(id)
                ? form.data.panel_member_ids.filter((item) => item !== id)
                : [...form.data.panel_member_ids, id],
        );
    }

    return (
        <>
            <Head title="Schedule interview" />
            <div className="space-y-6 p-4 md:p-6">
                <Button variant="ghost" asChild>
                    <Link href="/interviews">
                        <ArrowLeft className="size-4" />
                        Interviews
                    </Link>
                </Button>
                <PageHeader
                    title="Schedule interview"
                    description="Choose a shortlisted application, set the session details, and assign interviewers."
                />
                <Card>
                    <CardHeader>
                        <CardTitle>Interview details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-5">
                            <label className="block space-y-1.5 text-sm">
                                Candidate application
                                <select
                                    className={selectClass}
                                    value={form.data.application_id}
                                    onChange={(e) =>
                                        form.setData(
                                            'application_id',
                                            e.target.value,
                                        )
                                    }
                                >
                                    <option value="">
                                        Choose shortlisted application
                                    </option>
                                    {applications.map((application) => (
                                        <option
                                            key={application.id}
                                            value={application.id}
                                        >
                                            {application.applicant.name} ·{' '}
                                            {application.vacancy.title} ·{' '}
                                            {application.application_number}
                                        </option>
                                    ))}
                                </select>
                                {err(form.errors.application_id)}
                            </label>
                            <div className="grid gap-4 md:grid-cols-2">
                                <label className="space-y-1.5 text-sm">
                                    Interview type
                                    <select
                                        className={selectClass}
                                        value={form.data.interview_type}
                                        onChange={(e) =>
                                            form.setData(
                                                'interview_type',
                                                e.target.value,
                                            )
                                        }
                                    >
                                        {[
                                            'Panel interview',
                                            'Technical interview',
                                            'Academic presentation',
                                            'HR interview',
                                            'Other',
                                        ].map((type) => (
                                            <option key={type}>{type}</option>
                                        ))}
                                    </select>
                                </label>
                                <label className="space-y-1.5 text-sm">
                                    Date and time
                                    <Input
                                        type="datetime-local"
                                        value={form.data.interview_date}
                                        onChange={(e) =>
                                            form.setData(
                                                'interview_date',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {err(form.errors.interview_date)}
                                </label>
                                <label className="space-y-1.5 text-sm">
                                    Location or meeting details
                                    <Input
                                        value={form.data.location}
                                        onChange={(e) =>
                                            form.setData(
                                                'location',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Room, building, or online link"
                                    />
                                </label>
                            </div>
                            <label className="block space-y-1.5 text-sm">
                                Candidate instructions
                                <textarea
                                    className={textareaClass}
                                    rows={3}
                                    value={form.data.instructions}
                                    onChange={(e) =>
                                        form.setData(
                                            'instructions',
                                            e.target.value,
                                        )
                                    }
                                />
                            </label>
                            <fieldset className="space-y-2">
                                <legend className="text-sm font-medium">
                                    Interview panel
                                </legend>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {panelMembers.map((member) => (
                                        <label
                                            key={member.id}
                                            className="flex items-center gap-3 rounded-lg border p-3 text-sm"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={form.data.panel_member_ids.includes(
                                                    member.id,
                                                )}
                                                onChange={() =>
                                                    togglePanel(member.id)
                                                }
                                            />
                                            <span>
                                                <span className="block font-medium">
                                                    {member.name}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {member.email}
                                                </span>
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                {err(form.errors.panel_member_ids)}
                            </fieldset>
                            <div className="flex justify-end">
                                <Button disabled={form.processing}>
                                    <CalendarCheck className="size-4" />
                                    Schedule session
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

function err(value?: string) {
    return value ? (
        <span className="block text-xs text-destructive">{value}</span>
    ) : null;
}
const selectClass =
    'h-9 w-full rounded-md border border-input bg-background px-3 text-sm';
const textareaClass =
    'w-full rounded-md border border-input bg-background px-3 py-2 text-sm';
InterviewForm.layout = {
    breadcrumbs: [
        { title: 'Interviews', href: '/interviews' },
        { title: 'Schedule', href: '/admin/interviews/create' },
    ],
};
