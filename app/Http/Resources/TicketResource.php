<?php

namespace App\Http\Resources;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Ticket */
class TicketResource extends JsonResource
{
    /** @return array<string, mixed>  */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'priority' => $this->priority,
            'sla_state' => $this->slaState(),
            'sla_deadline' => $this->sla_deadline->format('M j, g:i A'),
            'assigned_to' => $this->whenLoaded('assignee', $this->assigned_to),
            'organization' => $this->whenLoaded('organization', fn () => [
                'id' => $this->organization->id,
                'name' => $this->organization->name,
            ]),
            'user' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ]),
            'assignee' => $this->whenLoaded('assignee', fn () => $this->assignee ? [
                'id' => $this->assignee->id,
                'name' => $this->assignee->name,
            ] : null),
            'comments' => $this->whenLoaded('comments', fn () => CommentResource::collection($this->comments)),
            'created_at' => $this->created_at->format('M j, g:i A'),
        ];
    }
}
