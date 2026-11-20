<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\DatabaseMessage;
use Illuminate\Notifications\Notification;

class RecruitmentUpdateNotification extends Notification
{
    use Queueable;

    public function __construct(
        public readonly string $title,
        public readonly string $message,
        public readonly string $url,
    ) {}

    /** @return list<string> */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): DatabaseMessage
    {
        return new DatabaseMessage([
            'title' => $this->title,
            'message' => $this->message,
            'url' => $this->url,
        ]);
    }
}
