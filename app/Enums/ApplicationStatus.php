<?php

namespace App\Enums;

enum ApplicationStatus: string
{
    case SUBMITTED = 'SUBMITTED';
    case UNDER_REVIEW = 'UNDER_REVIEW';
    case SHORTLISTED = 'SHORTLISTED';
    case INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED';
    case INTERVIEW_COMPLETED = 'INTERVIEW_COMPLETED';
    case SELECTED = 'SELECTED';
    case REJECTED = 'REJECTED';
    case RESERVED = 'RESERVED';
}
