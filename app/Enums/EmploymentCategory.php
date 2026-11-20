<?php

namespace App\Enums;

enum EmploymentCategory: string
{
    case ACADEMIC = 'Academic';
    case ADMINISTRATIVE = 'Administrative';
    case TECHNICAL = 'Technical';
    case NON_ACADEMIC = 'Non-academic';
}
