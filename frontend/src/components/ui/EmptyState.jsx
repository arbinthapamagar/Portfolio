import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'Nothing here yet', hint }) {
    return (
        <div className="glass flex flex-col items-center gap-3 rounded-2xl px-6 py-14 text-center">
            <Inbox className="h-8 w-8 text-mist-600" />
            <p className="font-display text-lg text-mist-300">{title}</p>
            {hint && <p className="max-w-sm text-sm text-mist-600">{hint}</p>}
        </div>
    );
}
