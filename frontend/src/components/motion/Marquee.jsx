// pure-CSS infinite ticker — cheaper than animating this with JS on every frame
export default function Marquee({
    items = [],
    duration = 28,
    reverse = false,
    className = '',
    renderItem,
}) {
    if (!items.length) return null;

    // rendered twice so the -50% translate loops seamlessly
    const loop = [...items, ...items];

    return (
        <div
            className={`marquee-paused relative overflow-hidden ${className}`}
            style={{
                // a mask fades the edges over whatever is behind it — an opaque
                // gradient overlay would show as a solid block on the hero aurora
                maskImage:
                    'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                WebkitMaskImage:
                    'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            }}
        >
            <div
                className="flex w-max animate-marquee items-center gap-10"
                style={{
                    '--marquee-duration': `${duration}s`,
                    animationDirection: reverse ? 'reverse' : 'normal',
                }}
            >
                {loop.map((item, i) => (
                    <div key={i} className="shrink-0">
                        {renderItem ? (
                            renderItem(item, i)
                        ) : (
                            <span className="flex items-center gap-10 text-sm tracking-widest text-mist-500 uppercase">
                                {typeof item === 'string' ? item : item?.text}
                                <span className="text-glow-500">✦</span>
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
