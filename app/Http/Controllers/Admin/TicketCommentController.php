<?php

namespace App\Http\Controllers\Admin;

use App\Actions\TicketComments\CreateTicketComment;
use App\Http\Controllers\Controller;
use App\Http\Requests\CommentRequest;
use App\Models\Comment;
use App\Models\Ticket;
use Illuminate\Http\RedirectResponse;

class TicketCommentController extends Controller
{
    public function store(CommentRequest $request, Ticket $ticket, CreateTicketComment $action): RedirectResponse
    {
        $this->authorize('create', [Comment::class, $ticket]);

        $action->handle($ticket, $request->user(), $request->validated());

        return back();
    }
}
