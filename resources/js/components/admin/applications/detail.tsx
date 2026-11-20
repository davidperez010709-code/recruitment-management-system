export function Detail({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
                {label}
            </p>
            <p className="mt-1 break-words">{value}</p>
        </div>
    );
}
