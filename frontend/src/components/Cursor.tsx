'use client';

import React, { useEffect, useRef } from 'react';

export const Cursor: React.FC = () => {
    const curRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cur = curRef.current;
        const ring = ringRef.current;
        if (!cur || !ring) return;

        let mx = 0, my = 0, rx = 0, ry = 0;
        let animationFrameId: number;

        const onMouseMove = (e: MouseEvent) => {
            mx = e.clientX;
            my = e.clientY;
            cur.style.left = mx + 'px';
            cur.style.top = my + 'px';
        };

        const animRing = () => {
            rx += (mx - rx) * 0.12;
            ry += (my - ry) * 0.12;
            ring.style.left = rx + 'px';
            ring.style.top = ry + 'px';
            animationFrameId = requestAnimationFrame(animRing);
        };

        document.addEventListener('mousemove', onMouseMove);
        animationFrameId = requestAnimationFrame(animRing);

        const applyHoverEffect = () => {
            cur.style.width = '20px'; cur.style.height = '20px';
            ring.style.width = '60px'; ring.style.height = '60px';
        };

        const removeHoverEffect = () => {
            cur.style.width = '12px'; cur.style.height = '12px';
            ring.style.width = '38px'; ring.style.height = '38px';
        };

        const attachHoverListeners = () => {
            document.querySelectorAll('a, button, [role="button"]').forEach(el => {
                el.addEventListener('mouseenter', applyHoverEffect);
                el.addEventListener('mouseleave', removeHoverEffect);
            });
        };

        // MutationObserver to attach to dynamically rendered elements
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    attachHoverListeners();
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
        attachHoverListeners();

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animationFrameId);
            observer.disconnect();
            document.querySelectorAll('a, button, [role="button"]').forEach(el => {
                el.removeEventListener('mouseenter', applyHoverEffect);
                el.removeEventListener('mouseleave', removeHoverEffect);
            });
        };
    }, []);

    return (
        <>
            <div className="cursor" ref={curRef}></div>
            <div className="cursor-ring" ref={ringRef}></div>
        </>
    );
};
