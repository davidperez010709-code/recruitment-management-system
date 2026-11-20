import { Link } from '@inertiajs/react';

type PageLink = { url: string | null; label: string; active: boolean };

function labelText(label: string) {
    return label
        .replace(/<[^>]*>/g, '')
        .replaceAll('&laquo;', '«')
        .replaceAll('&raquo;', '»')
        .replaceAll('&amp;', '&');
}

export function Pagination({ links }: { links: PageLink[] }) {
    if (links.length < 2) return null;

    return (
        <nav className="mt-5 flex flex-wrap gap-2" aria-label="Pagination">
            {links.map((link, index) =>
                link.url ? (
                    <Link
                        key={`${link.label}-${index}`}
                        href={link.url}
                        preserveScroll
                        className={`rounded-md border px-3 py-1.5 text-sm ${link.active ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-muted'}`}
                    >
                        {labelText(link.label)}
                    </Link>
                ) : (
                    <span
                        key={`${link.label}-${index}`}
                        className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground opacity-60"
                    >
                        {labelText(link.label)}
                    </span>
                ),
            )}
        </nav>
    );
}
