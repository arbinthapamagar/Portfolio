import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

/**
 * Ambient node mesh — the section's moving backdrop.
 *
 * Deliberately abstract: it is a graph of drifting points, not a chart, so it
 * makes no claim about anything. Nodes lean toward the pointer, and lines fade
 * in as pairs come close.
 *
 * Costs are kept honest: one canvas, DPR-aware, the loop stops whenever the
 * section is off screen, and reduced-motion visitors get a single static frame.
 */
const CREAM = [223, 199, 155];
const BERRY = [139, 124, 232];

export default function NodeField({ className = '', density = 13000, linkDistance = 158 }) {
    const canvasRef = useRef(null);
    const still = useReducedMotion();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return undefined;
        const ctx = canvas.getContext('2d');

        let width = 0;
        let height = 0;
        let nodes = [];
        let frame = 0;
        let running = false;
        const pointer = { x: -9999, y: -9999 };

        const build = () => {
            const rect = canvas.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = rect.width;
            height = rect.height;
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const count = Math.max(24, Math.min(110, Math.round((width * height) / density)));
            nodes = Array.from({ length: count }, () => {
                const x = Math.random() * width;
                const y = Math.random() * height;
                return {
                    x,
                    y,
                    hx: x,
                    hy: y,
                    vx: (Math.random() - 0.5) * 0.22,
                    vy: (Math.random() - 0.5) * 0.22,
                    r: 0.9 + Math.random() * 1.5,
                    warm: Math.random() > 0.45,
                };
            });
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            for (const node of nodes) {
                node.x += node.vx;
                node.y += node.vy;

                // lean toward the pointer, then drift back on its own
                const dx = pointer.x - node.x;
                const dy = pointer.y - node.y;
                const dist = Math.hypot(dx, dy);
                if (dist < 180 && dist > 0.5) {
                    const pull = (1 - dist / 180) * 0.035;
                    node.vx += (dx / dist) * pull;
                    node.vy += (dy / dist) * pull;
                }

                // a weak pull home, or the pointer slowly drags the whole field
                // into whichever corner it last visited
                node.vx += (node.hx - node.x) * 0.0006;
                node.vy += (node.hy - node.y) * 0.0006;

                // friction keeps the pointer nudge from turning into a stampede
                node.vx *= 0.99;
                node.vy *= 0.99;
                const speed = Math.hypot(node.vx, node.vy);
                if (speed < 0.06) {
                    node.vx += (Math.random() - 0.5) * 0.03;
                    node.vy += (Math.random() - 0.5) * 0.03;
                }

                if (node.x < 0 || node.x > width) node.vx *= -1;
                if (node.y < 0 || node.y > height) node.vy *= -1;
                node.x = Math.max(0, Math.min(width, node.x));
                node.y = Math.max(0, Math.min(height, node.y));
            }

            for (let i = 0; i < nodes.length; i += 1) {
                for (let j = i + 1; j < nodes.length; j += 1) {
                    const a = nodes[i];
                    const b = nodes[j];
                    const dist = Math.hypot(a.x - b.x, a.y - b.y);
                    if (dist > linkDistance) continue;
                    const strength = (1 - dist / linkDistance) * 0.5;
                    const [r, g, bl] = a.warm ? CREAM : BERRY;
                    ctx.strokeStyle = `rgba(${r},${g},${bl},${strength * 0.85})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }

            for (const node of nodes) {
                const [r, g, b] = node.warm ? CREAM : BERRY;
                ctx.fillStyle = `rgba(${r},${g},${b},0.9)`;
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
                ctx.fill();
            }
        };

        const loop = () => {
            draw();
            frame = requestAnimationFrame(loop);
        };

        const start = () => {
            if (running || still) return;
            running = true;
            frame = requestAnimationFrame(loop);
        };
        const stop = () => {
            running = false;
            cancelAnimationFrame(frame);
        };

        build();
        draw();

        // only animate while the section is actually on screen
        const observer = new IntersectionObserver(
            ([entry]) => (entry.isIntersecting ? start() : stop()),
            { rootMargin: '120px' }
        );
        observer.observe(canvas);

        const onResize = () => {
            build();
            draw();
        };
        const onPointerMove = (event) => {
            const rect = canvas.getBoundingClientRect();
            pointer.x = event.clientX - rect.left;
            pointer.y = event.clientY - rect.top;
        };
        const onPointerLeave = () => {
            pointer.x = -9999;
            pointer.y = -9999;
        };

        window.addEventListener('resize', onResize);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerleave', onPointerLeave);

        return () => {
            stop();
            observer.disconnect();
            window.removeEventListener('resize', onResize);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerleave', onPointerLeave);
        };
    }, [density, linkDistance, still]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
        />
    );
}
