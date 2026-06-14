<?php

namespace App\Models;

use App\Enums\SlaState;
use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use Database\Factories\TicketFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property-read TicketStatus $status
 * @property-read TicketPriority $priority
 * @property-read Carbon $sla_deadline
 * @property-read Carbon $created_at
 */
class Ticket extends Model
{
    /** @use HasFactory<TicketFactory> */
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'user_id',
        'title',
        'description',
        'status',
        'priority',
        'assigned_to',
        'sla_deadline',
    ];

    protected function casts(): array
    {
        return [
            'status' => TicketStatus::class,
            'priority' => TicketPriority::class,
            'sla_deadline' => 'datetime',
        ];
    }

    /** @return BelongsTo<Organization, $this> */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<User, $this> */
    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /** @return HasMany<Comment, $this> */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public static function calculateSLADeadline(TicketPriority|string $priority): Carbon
    {
        if (is_string($priority)) {
            $priority = TicketPriority::from($priority);
        }

        return match ($priority) {
            TicketPriority::Low => Carbon::now()->addHours(72), // 3 days
            TicketPriority::Normal => Carbon::now()->addHours(24), // 1 day
            TicketPriority::High => Carbon::now()->addHours(8), // 8 hours
            TicketPriority::Critical => Carbon::now()->addHours(2), // 2 hours
        };
    }

    public function slaState(): SlaState
    {
        $THREADHOLD = 0.25;
        $deadline = $this->sla_deadline;
        $created = $this->created_at;
        $now = Carbon::now();

        if ($now >= $deadline) {
            return SlaState::Overdue;
        }

        $total = $deadline->diffInSeconds($created);
        $remaining = $deadline->diffInSeconds($now);
        $ratio = $remaining / $total;

        // if deadline is less than 25% from now, we will show due soon
        if ($ratio <= $THREADHOLD) {
            return SlaState::DueSoon;
        }

        return SlaState::OnTrack;
    }

    public function isOverdue(): bool
    {
        return $this->slaState() === SlaState::Overdue;
    }

    public function isDueSoon(): bool
    {
        return $this->slaState() === SlaState::DueSoon;
    }

    public function isOnTrack(): bool
    {
        return $this->slaState() === SlaState::OnTrack;
    }

    /**
     * @param  array<string, mixed>  $filters
     * @param  Builder<Ticket>  $query
     * @return Builder<Ticket>
     */
    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['search'] ?? null, fn ($q, $s) => $q->where('title', 'like', "%{$s}%"))
            ->when($filters['status'] ?? null, fn ($q, $s) => $q->where('status', $s))
            ->when($filters['priority'] ?? null, fn ($q, $p) => $q->where('priority', $p))
            ->when($filters['organization_id'] ?? null, fn ($q, $id) => $q->where('organization_id', $id));
    }

    /**
     * @param  Builder<Ticket>  $query
     * @return Builder<Ticket>
     */
    public function scopeForOrganization(Builder $query, Organization $organization): Builder
    {
        return $query->where('organization_id', $organization->id);
    }
}
