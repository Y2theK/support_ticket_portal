import { Head, Link, router } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { TicketStatusBadge } from '@/components/ticket-status-badge';
import { TicketPriorityBadge } from '@/components/ticket-priority-badge';
import { SlaIndicator } from '@/components/sla-indicator';
import { TicketFilters } from '@/components/ticket-filters';
import { Pagination } from '@/components/ui/pagination';
import admin from '@/routes/admin';
import type {
    Organization,
    PaginatedResponse,
    Ticket,
    TicketPriority,
    TicketStatus,
} from '@/types';

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
        organization_id?: string;
    };
    organizations: Organization[];
};

export default function Index({
    tickets: paginated,
    filters,
    organizations,
}: PageProps) {
    const ticketList = paginated.data;

    function onFilterChange(key: keyof Filters, value: string) {
        const newFilters: Record<string, string | undefined> = {
            ...filters,
            [key]: value === 'all' ? undefined : value || undefined,
        };

        router.get(admin.tickets.index().url, newFilters, {
            preserveState: true,
            replace: true,
        });
    }

    function onClear() {
        router.get(
            admin.tickets.index().url,
            {},
            { preserveState: true, replace: true },
        );
    }

    function onPageChange(url: string) {
        router.get(url, { ...filters }, { preserveState: true, replace: true });
    }

    return (
        <>
            <Head title="All Tickets" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight">
                        All Tickets
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        View and manage all support tickets
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Tickets</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <TicketFilters
                            filters={{
                                search: filters.search ?? '',
                                status: (filters.status ?? '') as TicketStatus,
                                priority: (filters.priority ??
                                    '') as TicketPriority,
                                organization_id: filters.organization_id ?? '',
                            }}
                            onFilterChange={onFilterChange}
                            onClear={onClear}
                            showOrganization={true}
                            organizations={organizations}
                        />

                        {ticketList.length === 0 ? (
                            <p className="py-4 text-center text-sm text-muted-foreground">
                                No tickets found.
                            </p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Organization</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Priority</TableHead>
                                        <TableHead>Assignee</TableHead>
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
                                                    href={admin.tickets.show(
                                                        ticket.id,
                                                    )}
                                                    className="font-medium hover:underline"
                                                >
                                                    {ticket.title}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {ticket.organization?.name ??
                                                    'N/A'}
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
                                            <TableCell className="text-muted-foreground">
                                                {ticket.assignee?.name ?? (
                                                    <span className="text-amber-500 italic">
                                                        Unassigned
                                                    </span>
                                                )}
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
                                                    href={admin.tickets.show(
                                                        ticket.id,
                                                    )}
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
            title: 'Admin Dashboard',
            href: admin.dashboard(),
        },
        {
            title: 'All Tickets',
            href: admin.tickets.index(),
        },
    ],
};
