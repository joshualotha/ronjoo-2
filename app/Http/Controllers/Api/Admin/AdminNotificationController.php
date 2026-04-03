<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminNotification;

class AdminNotificationController extends Controller
{
    public function index()
    {
        $notifications = AdminNotification::query()
            ->orderByDesc('created_at')
            ->limit(25)
            ->get();

        return response()->json([
            'unreadCount' => AdminNotification::where('is_read', false)->count(),
            'notifications' => $notifications->map(fn (AdminNotification $n) => [
                'id' => $n->id,
                'type' => $n->type,
                'message' => $n->message,
                'isRead' => $n->is_read,
                'relatedId' => $n->related_id,
                'createdAt' => $n->created_at?->toIso8601String(),
            ]),
        ]);
    }

    public function read(AdminNotification $notification)
    {
        if (! $notification->is_read) {
            $notification->update(['is_read' => true]);
        }

        return response()->json(['ok' => true]);
    }

    public function readAll()
    {
        AdminNotification::where('is_read', false)->update(['is_read' => true]);
        return response()->json(['ok' => true]);
    }
}
