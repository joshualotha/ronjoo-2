<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Departure;
use App\Models\Enquiry;
use App\Models\Review;
use App\Models\Safari;
use App\Models\Subscriber;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'stats' => [
                'totalBookings'     => Booking::count(),
                'confirmedBookings' => Booking::where('status', 'confirmed')->count(),
                'pendingBookings'   => Booking::where('status', 'pending')->count(),
                'totalRevenue'      => Booking::sum('total_amount'),
                'totalEnquiries'    => Enquiry::count(),
                'unreadEnquiries'   => Enquiry::unread()->count(),
                'totalSafaris'      => Safari::count(),
                'publishedSafaris'  => Safari::published()->count(),
                'upcomingDepartures'=> Departure::where('start_date', '>=', now())->where('status', 'open')->count(),
                'totalReviews'      => Review::count(),
                'avgRating'         => round(Review::avg('rating'), 1),
                'totalSubscribers'  => Subscriber::active()->count(),
            ],
            'recentBookings'  => Booking::latest()->take(5)->get()->map(fn ($b) => [
                'id'        => $b->id,
                'ref'       => $b->ref,
                'guestName' => $b->guest_name,
                'safariName'=> $b->safari_name,
                'status'    => $b->status,
                'total'     => $b->total_amount,
                'createdAt' => $b->created_at?->toIso8601String(),
            ]),
            'recentEnquiries' => Enquiry::latest()->take(5)->get()->map(fn ($e) => [
                'id'        => $e->id,
                'guestName' => $e->guest_name,
                'safari'    => $e->safari_interest,
                'status'    => $e->status,
                'isRead'    => $e->is_read,
                'createdAt' => $e->created_at?->toIso8601String(),
            ]),
        ]);
    }
}
