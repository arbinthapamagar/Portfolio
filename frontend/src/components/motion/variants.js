// shared easing + variants so every section animates on the same rhythm
export const EASE = [0.22, 1, 0.36, 1];
export const EASE_SOFT = [0.16, 1, 0.3, 1];

export const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export const fadeIn = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.8, ease: EASE } },
};

export const scaleIn = {
    hidden: { opacity: 0, scale: 0.94 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

export const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
    hidden: {},
    show: { transition: { staggerChildren, delayChildren } },
});

export const directional = (direction = 'up', distance = 28) => {
    const axis = direction === 'left' || direction === 'right' ? 'x' : 'y';
    const sign = direction === 'right' || direction === 'down' ? -1 : 1;
    return {
        hidden: { opacity: 0, [axis]: distance * sign },
        show: { opacity: 1, [axis]: 0, transition: { duration: 0.7, ease: EASE } },
    };
};
