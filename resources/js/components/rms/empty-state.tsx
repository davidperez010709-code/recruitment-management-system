import { Inbox } from 'lucide-react';

export function EmptyState({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="flex min-h-40 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <Inbox className="mb-3 size-8 text-slate-400" aria-hidden="true" />
            <h3 className="font-medium">{title}</h3>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
                {description}
            </p>
        </div>
    );
}
