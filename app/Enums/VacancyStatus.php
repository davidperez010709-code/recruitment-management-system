<?php

namespace App\Enums;

enum VacancyStatus: string
{
    case DRAFT = 'DRAFT';
    case PUBLISHED = 'PUBLISHED';
    case CLOSED = 'CLOSED';
    case CANCELLED = 'CANCELLED';
}
