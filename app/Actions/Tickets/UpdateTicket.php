<?php

namespace App\Actions\Tickets;

use App\Enums\TicketPriority;
use App\Models\Ticket;
use Illuminate\Support\Facades\DB;

class UpdateTicket
{
    /** @param array<string, mixed> $attributes */
    public function handle(Ticket $ticket, array $attributes): Ticket
    {
        if (isset($attributes['priority'])) {
            $newPriority = TicketPriority::from($attributes['priority']);
            if ($newPriority !== $ticket->priority) {
                $attributes['sla_deadline'] = Ticket::calculateSLADeadline($newPriority);
            }
        }

        DB::transaction(function () use ($ticket, $attributes) {
            return $ticket->update($attributes);
        });

        return $ticket->fresh();
    }
}
