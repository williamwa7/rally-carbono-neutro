import { useEffect } from 'react';

export default function PreventPullToRefresh() {
    useEffect(() => {
        let maybePrevent = false;

        const onTouchStart = (e) => {
            if (window.scrollY === 0) {
                maybePrevent = true;
            }
        };

        const onTouchMove = (e) => {
            if (maybePrevent) {
                maybePrevent = false;
                e.preventDefault(); // bloqueia o scroll (e o refresh)
            }
        };

        document.addEventListener('touchstart', onTouchStart, { passive: false });
        document.addEventListener('touchmove', onTouchMove, { passive: false });

        return () => {
            document.removeEventListener('touchstart', onTouchStart);
            document.removeEventListener('touchmove', onTouchMove);
        };
    }, []);

    return null;
}
