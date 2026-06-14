<?php

namespace App\Policies;

use App\Models\Ticket;
use App\Models\User;

class TicketPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Ticket $ticket): bool
    {
        if ($user->isAgent()) {
            return true;
        }

        return $user->organization_id === $ticket->organization_id;
    }

    public function create(User $user): bool
    {
        return $user->isClient();
    }

    public function update(User $user, Ticket $ticket): bool
    {
        return $user->isAgent();
    }

    public function assign(User $user, Ticket $ticket): bool
    {
        return $user->isAgent();
    }
}
