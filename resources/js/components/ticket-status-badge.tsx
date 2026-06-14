import type { TicketStatus } from '@/types';
import { cn } from '@/lib/utils';

const statusConfig: Record<TicketStatus, { label: string; className: string }> =
    {
        open: {
            label: 'Open',
            className:
                'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-transparent',
        },
        in_progress: {
            label: 'In Progress',
            className:
                'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border-transparent',
        },
        resolved: {
            label: 'Resolved',
            className:
                'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-transparent',
        },
        closed: {
            label: 'Closed',
            className:
                'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300 border-transparent',
        },
    };

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
    const config = statusConfig[status];

    return (
        <span
            className={cn(
                'inline-flex w-fit shrink-0 items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap',
                config.className,
            )}
        >
            {config.label}
        </span>
    );
}
