export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white p-0.5 ring-1 ring-black/5">
                {/* The supplied crest stays in the shared logo used by every layout. */}
                <img
                    src="/images/ui.png"
                    alt="University of Ibadan crest"
                    className="size-full object-contain"
                />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    University of Ibadan
                </span>
                <span className="truncate text-xs leading-tight text-muted-foreground">
                    Recruitment RMS
                </span>
            </div>
        </>
    );
}
