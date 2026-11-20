import { Head, router } from '@inertiajs/react';
import { Download, Search } from 'lucide-react';
import { useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { MetricCard } from '@/components/rms/metric-card';
import { PageHeader } from '@/components/rms/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ClipboardList,
    CheckCircle2,
    XCircle,
    BookmarkCheck,
} from 'lucide-react';

type ReportData = {
    summary: {
        total: number;
        selected: number;
        rejected: number;
        reserved: number;
    };
    byStatus: { status: string; total: number }[];
    byVacancy: {
        vacancy_id: number;
        total: number;
        vacancy: { title: string; reference_number: string };
    }[];
    filters: { from?: string; to?: string };
};

export default function ReportsIndex({
    summary,
    byStatus,
    byVacancy,
    filters,
}: ReportData) {
    const [from, setFrom] = useState(filters.from || '');
    const [to, setTo] = useState(filters.to || '');
    function apply(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        router.get(
            '/admin/reports',
            { from, to },
            { preserveState: true, replace: true },
        );
    }
    const exportHref = `/admin/reports/export?${new URLSearchParams({ ...(from ? { from } : {}), ...(to ? { to } : {}) }).toString()}`;

    return (
        <>
            <Head title="Recruitment reports" />
            <div className="space-y-6 p-4 md:p-6">
                <PageHeader
                    title="Recruitment reports"
                    description="Review application outcomes by date, vacancy, and current status."
                    action={
                        <Button variant="outline" asChild>
                            <a href={exportHref}>
                                <Download className="size-4" />
                                Export CSV
                            </a>
                        </Button>
                    }
                />
                <form
                    onSubmit={apply}
                    className="grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-[1fr_1fr_auto]"
                >
                    <label className="space-y-1 text-sm">
                        From
                        <InputDate value={from} setValue={setFrom} />
                    </label>
                    <label className="space-y-1 text-sm">
                        To
                        <InputDate value={to} setValue={setTo} />
                    </label>
                    <Button className="self-end">
                        <Search className="size-4" />
                        Apply dates
                    </Button>
                </form>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <MetricCard
                        label="Applications"
                        value={summary.total}
                        icon={ClipboardList}
                    />
                    <MetricCard
                        label="Selected"
                        value={summary.selected}
                        icon={CheckCircle2}
                    />
                    <MetricCard
                        label="Rejected"
                        value={summary.rejected}
                        icon={XCircle}
                    />
                    <MetricCard
                        label="Reserved"
                        value={summary.reserved}
                        icon={BookmarkCheck}
                    />
                </div>
                <div className="grid gap-4 xl:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Applications by status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {byStatus.length ? (
                                byStatus.map((item) => (
                                    <div
                                        key={item.status}
                                        className="flex items-center justify-between rounded-md border p-3"
                                    >
                                        <span>
                                            {item.status.replaceAll('_', ' ')}
                                        </span>
                                        <span className="font-semibold tabular-nums">
                                            {item.total}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No applications in this date range.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Applications by vacancy</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {byVacancy.length ? (
                                <div className="h-80">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart
                                            data={byVacancy.map((item) => ({
                                                title: item.vacancy.title,
                                                applications: Number(
                                                    item.total,
                                                ),
                                            }))}
                                            layout="vertical"
                                            margin={{ left: 10, right: 12 }}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                horizontal={false}
                                            />
                                            <XAxis
                                                type="number"
                                                allowDecimals={false}
                                            />
                                            <YAxis
                                                type="category"
                                                dataKey="title"
                                                width={150}
                                                tickLine={false}
                                            />
                                            <Tooltip />
                                            <Bar
                                                dataKey="applications"
                                                fill="#1e3a8a"
                                                radius={[0, 5, 5, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No vacancy applications in this date range.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

function InputDate({
    value,
    setValue,
}: {
    value: string;
    setValue: (value: string) => void;
}) {
    return (
        <input
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            type="date"
            value={value}
            onChange={(event) => setValue(event.target.value)}
        />
    );
}
ReportsIndex.layout = {
    breadcrumbs: [{ title: 'Reports', href: '/admin/reports' }],
};
