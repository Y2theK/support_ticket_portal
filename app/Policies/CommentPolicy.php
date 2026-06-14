<?php

namespace App\Policies;

use App\Models\Ticket;
use App\Models\User;

class CommentPolicy
{
    public function viewAny(User $user, Ticket $ticket): bool
    {
        if ($user->isAgent()) {
            return true;
        }

        return $user->organization_id === $ticket->organization_id;
    }

    public function create(User $user, Ticket $ticket): bool
    {
        if ($user->isAgent()) {
            return true;
        }

        return $user->organization_id === $ticket->organization_id;
    }
}
