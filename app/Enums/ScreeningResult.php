<?php

namespace App\Enums;

enum ScreeningResult: string
{
    case QUALIFIED = 'QUALIFIED';
    case NOT_QUALIFIED = 'NOT_QUALIFIED';
    case PENDING = 'PENDING';
}
