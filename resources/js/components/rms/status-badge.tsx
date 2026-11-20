import { Badge } from '@/components/ui/badge';

const positive = new Set(['PUBLISHED', 'SELECTED', 'QUALIFIED', 'COMPLETED']);
const negative = new Set(['CANCELLED', 'REJECTED', 'NOT_QUALIFIED']);
const attention = new Set([
    'SUBMITTED',
    'UNDER_REVIEW',
    'PENDING',
    'SCHEDULED',
    'RESCHEDULED',
]);

export function StatusBadge({ status }: { status: string | null | undefined }) {
    const value = status || 'UNKNOWN';
    const variant = positive.has(value)
        ? 'default'
        : negative.has(value)
          ? 'destructive'
          : attention.has(value)
            ? 'secondary'
            : 'outline';

    return (
        <Badge variant={variant} className="font-medium">
            {value
                .replaceAll('_', ' ')
                .toLowerCase()
                .replace(/\b\w/g, (letter) => letter.toUpperCase())}
        </Badge>
    );
}
