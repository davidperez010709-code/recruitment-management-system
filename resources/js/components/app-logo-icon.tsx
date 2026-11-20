import type { ImgHTMLAttributes } from 'react';

/** Shared image mark for compact headers and authentication screens. */
export default function AppLogoIcon(
    props: ImgHTMLAttributes<HTMLImageElement>,
) {
    return (
        <img src="/images/ui.png" alt="University of Ibadan crest" {...props} />
    );
}
