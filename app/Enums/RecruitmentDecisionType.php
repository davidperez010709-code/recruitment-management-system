<?php

namespace App\Enums;

enum RecruitmentDecisionType: string
{
    case SELECTED = 'SELECTED';
    case REJECTED = 'REJECTED';
    case RESERVED = 'RESERVED';
}
