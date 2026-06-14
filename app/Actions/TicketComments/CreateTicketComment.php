<?php

namespace App\Actions\TicketComments;

use App\Models\Comment;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CreateTicketComment
{
    /** @param array<string, mixed> $attributes */
    public function handle(Ticket $ticket, User $user, array $attributes): Comment
    {
        return DB::transaction(function () use ($ticket, $user, $attributes) {
            return Comment::create([
                ...$attributes,
                'ticket_id' => $ticket->id,
                'user_id' => $user->id,
            ]);
        });
    }
}
