import React, { useMemo, useState, useEffect } from 'react';

/**
 * Animated 3D-style background: glowing gradient orbs with mouse parallax,
 * a perspective grid floor that pans infinitely, and twinkling stars.
 * Pure CSS animations — no runtime cost beyond compositing.
 */
const AnimatedBackground = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const stars = useMemo(
        () =>
            Array.from({ length: 40 }, (_, i) => ({
                id: i,
                top: `${(i * 37) % 90}%`,
                left: `${(i * 53) % 100}%`,
                delay: `${(i % 7) * 0.45}s`,
                size: i % 3 === 0 ? 'w-1 h-1' : i % 3 === 1 ? 'w-0.5 h-0.5' : 'w-1.5 h-1.5',
            })),
        []
    );

    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            setMousePos({ x, y });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="bg-scene" aria-hidden="true">
            <div
                className="bg-orb animate-float-slow"
                style={{
                    width: 420, height: 420, top: '-8%', left: '-6%',
                    background: 'rgba(79,124,255,0.35)',
                    transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)`,
                    transition: 'transform 0.3s ease-out'
                }}
            />
            <div
                className="bg-orb animate-float-slower"
                style={{
                    width: 380, height: 380, top: '5%', right: '-8%',
                    background: 'rgba(139,92,246,0.32)',
                    transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`,
                    transition: 'transform 0.3s ease-out'
                }}
            />
            <div
                className="bg-orb animate-float-slow"
                style={{
                    width: 300, height: 300, bottom: '8%', left: '30%',
                    background: 'rgba(34,211,238,0.22)',
                    animationDelay: '2s',
                    transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)`,
                    transition: 'transform 0.3s ease-out'
                }}
            />
            <div
                className="bg-orb animate-float-slower"
                style={{
                    width: 250, height: 250, top: '40%', right: '15%',
                    background: 'rgba(236,72,153,0.18)',
                    animationDelay: '4s',
                    transform: `translate(${mousePos.x * -12}px, ${mousePos.y * -12}px)`,
                    transition: 'transform 0.3s ease-out'
                }}
            />
            <div
                className="bg-orb animate-float-slow"
                style={{
                    width: 200, height: 200, bottom: '30%', left: '10%',
                    background: 'rgba(16,185,129,0.15)',
                    animationDelay: '1s',
                    transform: `translate(${mousePos.x * 8}px, ${mousePos.y * 8}px)`,
                    transition: 'transform 0.3s ease-out'
                }}
            />
            {stars.map((s) => (
                <span key={s.id} className={`bg-star ${s.size}`} style={{ top: s.top, left: s.left, animationDelay: s.delay }} />
            ))}
            <div className="bg-grid" />
            <div className="bg-vignette" />
        </div>
    );
};

export default AnimatedBackground;
