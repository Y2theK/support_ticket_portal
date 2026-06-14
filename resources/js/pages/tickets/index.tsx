import { Head, Link, router } from '@inertiajs/react';
import { Eye, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { TicketFilters } from '@/components/ticket-filters';
import { TicketStatusBadge } from '@/components/ticket-status-badge';
import { TicketPriorityBadge } from '@/components/ticket-priority-badge';
import { SlaIndicator } from '@/components/sla-indicator';
import { dashboard } from '@/routes';
import tickets from '@/routes/tickets';
import type {
    PaginatedResponse,
    Ticket,
    TicketPriority,
    TicketStatus,
} from '@/types';
import { Pagination } from '@/components/ui/pagination';

type Filters = {
    search: string;
    status: string;
    priority: string;
    organization_id: string;
};

type PageProps = {
    tickets: PaginatedResponse<Ticket>;
    filters: {
        search?: string;
        status?: string;
        priority?: string;
    };
};

export default function Index({ tickets: paginated, filters }: PageProps) {
    const ticketList = paginated.data;

    function onFilterChange(key: keyof Filters, value: string) {
        const newFilters: Record<string, string | undefined> = {
            ...filters,
            [key]: value === 'all' ? undefined : value || undefined,
        };

        router.get(tickets.index().url, newFilters, {
            preserveState: true,
            replace: true,
        });
    }

    function onClear() {
        router.get(
            tickets.index().url,
            {},
            { preserveState: true, replace: true },
        );
    }

    function onPageChange(url: string) {
        router.get(url, { ...filters }, { preserveState: true, replace: true });
    }

    return (
        <>
            <Head title="My Tickets" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight">
                            My Tickets
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            View and manage your support tickets
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={tickets.create()}>
                            <Plus className="size-4" />
                            New Ticket
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">All Tickets</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <TicketFilters
                            filters={{
                                search: filters.search ?? '',
                                status: (filters.status ?? '') as TicketStatus,
                                priority: (filters.priority ??
                                    '') as TicketPriority,
                                organization_id: '',
                            }}
                            onFilterChange={onFilterChange}
                            onClear={onClear}
                        />
                        {ticketList.length === 0 ? (
                            <p className="px-6 pb-6 text-sm text-muted-foreground">
                                No tickets yet. Create your first ticket to get
                                started.
                            </p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Priority</TableHead>
                                        <TableHead>SLA State</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="w-12">
                                            Action
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ticketList.map((ticket) => (
                                        <TableRow key={ticket.id}>
                                            <TableCell>
                                                <Link
                                                    href={tickets.show(ticket)}
                                                    className="font-medium hover:underline"
                                                >
                                                    {ticket.title}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <TicketStatusBadge
                                                    status={ticket.status}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TicketPriorityBadge
                                                    priority={ticket.priority}
                                                />
                                            </TableCell>

                                            <TableCell>
                                                <SlaIndicator
                                                    state={ticket.sla_state}
                                                />
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {ticket.created_at}
                                            </TableCell>
                                            <TableCell>
                                                <Link
                                                    href={tickets.show(ticket)}
                                                    className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                                >
                                                    <Eye className="size-4" />
                                                    <span className="sr-only">
                                                        View ticket
                                                    </span>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                        {paginated.links && (
                            <Pagination
                                links={paginated.links}
                                meta={paginated.meta}
                                onPageChange={onPageChange}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'My Tickets',
            href: tickets.index(),
        },
    ],
};
