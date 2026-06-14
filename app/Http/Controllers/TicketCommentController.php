<?php

namespace App\Http\Controllers;

use App\Actions\TicketComments\CreateTicketComment;
use App\Http\Requests\CommentRequest;
use App\Models\Comment;
use App\Models\Ticket;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class TicketCommentController extends Controller
{
    public function store(CommentRequest $request, Ticket $ticket, CreateTicketComment $action): RedirectResponse
    {
        $this->authorize('create', [Comment::class, $ticket]);

        $action->handle($ticket, $request->user(), $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Comment added.')]);

        return back();
    }
}
