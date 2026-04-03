<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Enquiry;
use App\Http\Requests\Admin\StoreEnquiryRequest;
use App\Http\Requests\Admin\UpdateEnquiryRequest;
use App\Http\Resources\EnquiryResource;
use App\Models\AdminNotification;
use App\Models\EmailTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class AdminEnquiryController extends Controller
{
    public function index(Request $request)
    {
        $query = Enquiry::query()->orderByDesc('received_at');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('guest_name', 'like', "%{$search}%")
                  ->orWhere('safari_interest', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($tab = $request->input('tab')) {
            match ($tab) {
                'unread'    => $query->where('is_read', false),
                'replied'   => $query->whereRaw("JSON_LENGTH(replies) > 0")->where('status', '!=', 'converted'),
                'converted' => $query->where('status', 'converted'),
                'archived'  => $query->where('status', 'archived'),
                default     => null,
            };
        }

        return EnquiryResource::collection($query->paginate(50));
    }

    public function show(Enquiry $enquiry)
    {
        return new EnquiryResource($enquiry);
    }

    public function store(StoreEnquiryRequest $request)
    {
        $data = $request->validated();
        $data['is_read'] = false;
        $data['received_at'] = now();
        $data['replies'] = [];

        $enquiry = Enquiry::create($data);
        AdminNotification::create([
            'type' => 'enquiry',
            'message' => 'New enquiry from ' . $enquiry->guest_name . ' (' . ($enquiry->country ?: 'Unknown') . ')',
            'related_id' => $enquiry->id,
        ]);

        // Send email notifications (non-blocking — failures logged, not thrown)
        try {
            $adminEmail = config('mail.admin_to', env('ADMIN_NOTIFY_EMAIL', 'info@ronjoosafaris.co.tz'));
            Mail::to($adminEmail)->send(new \App\Mail\NewEnquiryAdminMail($enquiry));

            if (!empty($enquiry->email)) {
                Mail::to($enquiry->email)->send(new \App\Mail\EnquiryConfirmationMail($enquiry));
            }
        } catch (\Throwable $e) {
            \Log::warning('Enquiry email dispatch failed: ' . $e->getMessage());
        }

        return (new EnquiryResource($enquiry))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateEnquiryRequest $request, Enquiry $enquiry)
    {
        $enquiry->update($request->validated());
        return new EnquiryResource($enquiry);
    }

    public function destroy(Enquiry $enquiry)
    {
        $enquiry->delete();
        return response()->json(null, 204);
    }

    /**
     * Add a reply to an enquiry.
     */
    public function reply(Request $request, Enquiry $enquiry)
    {
        $request->validate([
            'message' => 'required|string|max:5000',
            'from'    => 'required|in:admin,guest',
        ]);

        $replies = $enquiry->replies ?? [];
        $replies[] = [
            'from'      => $request->input('from'),
            'message'   => $request->input('message'),
            'timestamp' => now()->toISOString(),
        ];

        $enquiry->update([
            'replies' => $replies,
            'status'  => $request->input('from') === 'admin' ? 'in-progress' : 'awaiting-guest',
            'is_read' => true,
        ]);

        if ($request->input('from') === 'admin' && ! empty($enquiry->email)) {
            $template = EmailTemplate::query()->where('type', 'enquiry-reply')->first();
            $subject = $template?->subject ?: ('Reply to your enquiry - ' . ($enquiry->safari_interest ?: 'Ronjoo Safaris'));
            $body = $template?->body ?: "{{message}}\n\nRegards,\nRonjoo Safaris Team";
            $compiledBody = strtr($body, [
                '{{name}}' => (string) $enquiry->guest_name,
                '{{country}}' => (string) ($enquiry->country ?: ''),
                '{{safari_interest}}' => (string) ($enquiry->safari_interest ?: ''),
                '{{message}}' => (string) $request->input('message'),
            ]);

            Mail::raw($compiledBody, function ($mail) use ($enquiry, $subject) {
                $mail->to($enquiry->email)->subject($subject);
            });
        }

        return new EnquiryResource($enquiry);
    }

    /**
     * Convert an enquiry into a booking record.
     */
    public function convertToBooking(Request $request, Enquiry $enquiry)
    {
        $payload = $request->validate([
            'ref' => 'nullable|string|max:20',
        ]);

        return DB::transaction(function () use ($enquiry, $payload) {
            // If already converted, don't duplicate.
            $existing = Booking::query()
                ->where('email', $enquiry->email)
                ->where('guest_name', $enquiry->guest_name)
                ->where('safari_name', $enquiry->safari_interest)
                ->orderByDesc('created_at')
                ->first();

            if ($existing) {
                $enquiry->update(['status' => 'converted', 'is_read' => true]);
                return response()->json([
                    'bookingId' => $existing->id,
                    'enquiry' => (new EnquiryResource($enquiry))->resolve(),
                ]);
            }

            $ref = $payload['ref'] ?? null;
            if (!$ref) {
                // Short, unique-enough reference; user can edit later in bookings UI.
                $ref = 'ENQ-' . $enquiry->id . '-' . now()->format('ymd');
            }

            $booking = Booking::create([
                'ref' => $ref,
                'guest_name' => $enquiry->guest_name,
                'email' => $enquiry->email,
                'whatsapp' => $enquiry->whatsapp,
                'country' => $enquiry->country,
                'safari_name' => $enquiry->safari_interest,
                'pax' => max(1, (int) ($enquiry->travelers ?? 1)),
                'children' => 0,
                'total_amount' => 0,
                'deposit_paid' => 0,
                'balance_due' => 0,
                'status' => 'pending',
                'payment_status' => 'pending',
                'group_type' => 'private',
                'notes' => array_values(array_filter([
                    'Converted from enquiry #' . $enquiry->id,
                    $enquiry->preferred_dates ? ('Preferred dates: ' . $enquiry->preferred_dates) : null,
                    $enquiry->budget ? ('Budget: ' . $enquiry->budget) : null,
                ])),
            ]);

            $enquiry->update(['status' => 'converted', 'is_read' => true]);
            AdminNotification::create([
                'type' => 'booking',
                'message' => 'New booking for ' . ($booking->safari_name ?: 'Safari Package'),
                'related_id' => $booking->id,
            ]);

            return response()->json([
                'bookingId' => $booking->id,
                'enquiry' => (new EnquiryResource($enquiry))->resolve(),
            ], 201);
        });
    }
}
