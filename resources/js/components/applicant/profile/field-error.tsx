export function FieldError({ message }: { message?: string }) {
    return message ? (
        <span className="block text-xs text-destructive">{message}</span>
    ) : null;
}
