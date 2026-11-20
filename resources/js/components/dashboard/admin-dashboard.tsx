import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { EmptyState } from '@/components/rms/empty-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RecentApplications } from './recent-applications';
import { UpcomingInterviews } from './upcoming-interviews';
import type { ApplicationRow, InterviewRow } from './types';

type Props = {
    monthlyActivity: { month: string; applications: number }[];
    statusDistribution: { status: string; total: number | string }[];
    applicationsByVacancy: {
        id: number;
        title: string;
        applications_count: number;
    }[];
    recentApplications: ApplicationRow[];
    upcomingInterviews: InterviewRow[];
};

const chartColors = [
    '#1e3a8a',
    '#0891b2',
    '#059669',
    '#7c3aed',
    '#d97706',
    '#dc2626',
];

/** Recruitment charts and activity panels for HR roles. */
export function AdminDashboard({
    monthlyActivity,
    statusDistribution,
    applicationsByVacancy,
    recentApplications,
    upcomingInterviews,
}: Props) {
    // These values are query results from the dashboard controller, never demo chart data.
    return (
        <>
            <div className="grid gap-4 xl:grid-cols-3">
                <Card className="xl:col-span-2">
                    <CardHeader>
                        <CardTitle>Application activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {monthlyActivity.length ? (
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={monthlyActivity}
                                        margin={{
                                            left: 0,
                                            right: 12,
                                            top: 10,
                                            bottom: 4,
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                        />
                                        <XAxis
                                            dataKey="month"
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            allowDecimals={false}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="applications"
                                            stroke="#1e3a8a"
                                            strokeWidth={3}
                                            dot={{ r: 4 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <EmptyState
                                title="No application activity yet"
                                description="Application activity will appear here when candidates apply."
                            />
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Application status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {statusDistribution.length ? (
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusDistribution.map(
                                                (item) => ({
                                                    ...item,
                                                    total: Number(item.total),
                                                }),
                                            )}
                                            dataKey="total"
                                            nameKey="status"
                                            innerRadius={55}
                                            outerRadius={95}
                                            paddingAngle={3}
                                        >
                                            {statusDistribution.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={entry.status}
                                                        fill={
                                                            chartColors[
                                                                index %
                                                                    chartColors.length
                                                            ]
                                                        }
                                                    />
                                                ),
                                            )}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <EmptyState
                                title="No applications yet"
                                description="Status distribution will appear when applications are submitted."
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Applications by vacancy</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {applicationsByVacancy.length ? (
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={applicationsByVacancy}
                                        layout="vertical"
                                        margin={{ left: 12, right: 20 }}
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
                                            width={130}
                                            tickLine={false}
                                        />
                                        <Tooltip />
                                        <Bar
                                            dataKey="applications_count"
                                            fill="#0891b2"
                                            radius={[0, 5, 5, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <EmptyState
                                title="No vacancies yet"
                                description="Create a vacancy to start tracking applicant interest."
                            />
                        )}
                    </CardContent>
                </Card>
                <UpcomingInterviews interviews={upcomingInterviews} />
            </div>
            <RecentApplications applications={recentApplications} admin />
        </>
    );
}
