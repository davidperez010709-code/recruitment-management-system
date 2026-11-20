import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function MetricCard({
    label,
    value,
    detail,
    icon: Icon,
}: {
    label: string;
    value: number | string;
    detail?: string;
    icon: LucideIcon;
}) {
    return (
        <Card className="gap-3 py-5">
            <CardContent className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="mt-2 text-2xl font-semibold tabular-nums">
                        {value}
                    </p>
                    {detail ? (
                        <p className="mt-1 text-xs text-muted-foreground">
                            {detail}
                        </p>
                    ) : null}
                </div>
                <span className="rounded-lg bg-primary/10 p-2.5 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                </span>
            </CardContent>
        </Card>
    );
}
