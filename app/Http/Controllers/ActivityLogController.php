<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()?->can('view activity logs'), 403);

        return Inertia::render('admin/activity-logs/index', [
            'logs' => ActivityLog::query()
                ->with('user:id,name,email')
                ->when($request->filled('action'), fn ($query) => $query->where('action', $request->string('action')->value()))
                ->latest()
                ->paginate(30)
                ->withQueryString()
                ->through(fn (ActivityLog $log) => [
                    'id' => $log->id,
                    'action' => $log->action,
                    'description' => $log->description,
                    'subject_type' => $log->subject_type,
                    'subject_id' => $log->subject_id,
                    'ip_address' => $log->ip_address,
                    'created_at' => $log->created_at,
                    'user' => $log->user ? ['name' => $log->user->name, 'email' => $log->user->email] : null,
                ]),
        ]);
    }
}
