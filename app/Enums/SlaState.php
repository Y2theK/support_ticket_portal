<?php

namespace App\Enums;

enum SlaState: string
{
    case OnTrack = 'on_track';
    case DueSoon = 'due_soon';
    case Overdue = 'overdue';
}
