<?php

namespace App\Enums;

enum InterviewStatus: string
{
    case SCHEDULED = 'SCHEDULED';
    case COMPLETED = 'COMPLETED';
    case CANCELLED = 'CANCELLED';
    case RESCHEDULED = 'RESCHEDULED';
}
