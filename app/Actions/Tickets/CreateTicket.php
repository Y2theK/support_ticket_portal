<?php

namespace App\Actions\Tickets;

use App\Enums\TicketPriority;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CreateTicket
{
    /** @param array<string, mixed> $attributes */
    public function handle(User $user, array $attributes): Ticket
    {
        $ticket = DB::transaction(function () use ($user, $attributes) {
            return Ticket::create([
                ...$attributes,
                'organization_id' => $user->organization_id,
                'user_id' => $user->id,
                'sla_deadline' => Ticket::calculateSLADeadline($attributes['priority'] ?? TicketPriority::Normal),
            ]);
        });

        return $ticket;
    }
}
