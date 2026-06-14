import { Head, Link } from '@inertiajs/react';
import { Tickets, ArrowRight, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TicketStatusBadge } from '@/components/ticket-status-badge';
import { TicketPriorityBadge } from '@/components/ticket-priority-badge';
import { SlaIndicator } from '@/components/sla-indicator';
import tickets from '@/routes/tickets';
import { dashboard } from '@/routes';
import type { Ticket } from '@/types';

type PageProps = {
    ticketCount: number;
    openTickets: number;
    inProgressTickets: number;
    resolvedOrClosedTickets: number;
    overdueTickets: number;
    recentTickets: Ticket[];
};

export default function Dashboard({
    ticketCount,
    openTickets,
    inProgressTickets,
    resolvedOrClosedTickets,
    overdueTickets,
    recentTickets,
}: PageProps) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-5">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Tickets
                            </CardTitle>
                            <Tickets className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {ticketCount}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Open
                            </CardTitle>
                            <Tickets className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {openTickets}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                In Progress
                            </CardTitle>
                            <Tickets className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {inProgressTickets}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Resolved / Closed
                            </CardTitle>
                            <Tickets className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {resolvedOrClosedTickets}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Overdue
                            </CardTitle>
                            <Clock className="size-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {overdueTickets}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base">
                            Recent Tickets
                        </CardTitle>
                        <Link
                            href={tickets.index()}
                            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            View all
                            <ArrowRight className="size-4" />
                        </Link>
                    </CardHeader>
                    <CardContent className="p-0">
                        {recentTickets.length === 0 ? (
                            <p className="px-6 pb-6 text-sm text-muted-foreground">
                                No tickets yet.
                            </p>
                        ) : (
                            <div className="divide-y">
                                {recentTickets.map((ticket) => (
                                    <Link
                                        key={ticket.id}
                                        href={tickets.show(ticket)}
                                        className="flex items-center gap-4 px-6 py-3 transition-colors hover:bg-muted/50"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">
                                                {ticket.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {ticket.created_at}
                                            </p>
                                        </div>
                                        <div className="flex shrink-0 items-center gap-2">
                                            <TicketStatusBadge
                                                status={ticket.status}
                                            />
                                            <TicketPriorityBadge
                                                priority={ticket.priority}
                                            />
                                            <SlaIndicator
                                                state={ticket.sla_state}
                                            />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
