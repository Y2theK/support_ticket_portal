import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TicketStatusBadge } from '@/components/ticket-status-badge';
import { TicketPriorityBadge } from '@/components/ticket-priority-badge';
import { SlaIndicator } from '@/components/sla-indicator';
import { CommentList } from '@/components/comment-list';
import { CommentForm } from '@/components/comment-form';
import { dashboard } from '@/routes';
import tickets from '@/routes/tickets';
import type { Ticket } from '@/types';

type PageProps = {
    ticket: Ticket;
};

export default function Show({ ticket }: PageProps) {
    return (
        <>
            <Head title={ticket.title} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={tickets.index()}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight">
                            {ticket.title}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Created {ticket.created_at}
                            {ticket.user && <> by {ticket.user.name}</>}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <TicketStatusBadge status={ticket.status} />
                    <TicketPriorityBadge priority={ticket.priority} />
                    <SlaIndicator state={ticket.sla_state} />
                    <span className="text-xs text-muted-foreground">
                        SLA deadline: {ticket.sla_deadline}
                    </span>
                </div>

                {ticket.description && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Description
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm whitespace-pre-wrap text-foreground">
                                {ticket.description}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Conversation
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CommentList comments={ticket.comments ?? []} />
                        <Separator className="my-6" />
                        <CommentForm
                            postUrl={tickets.comments.store(ticket).url}
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'My Tickets',
            href: tickets.index(),
        },
        {
            title: 'Ticket',
            href: tickets.show({ ticket: 0 }),
        },
    ],
};
