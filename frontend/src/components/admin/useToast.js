import { useCallback, useRef, useState } from 'react';

export default function useToast() {
    const [toast, setToast] = useState(null);
    const timer = useRef(null);

    const push = useCallback((message, type = 'success') => {
        clearTimeout(timer.current);
        setToast({ message, type });
        timer.current = setTimeout(() => setToast(null), 3800);
    }, []);

    return { toast, push };
}
