<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Http\Requests\Admin\StoreBookingRequest;
use App\Http\Requests\Admin\UpdateBookingRequest;
use App\Http\Resources\BookingResource;
use App\Models\AdminNotification;
use Illuminate\Http\Request;

class AdminBookingController extends Controller
{
    public function index(Request $request)
    {
        $query = Booking::query()->orderByDesc('created_at');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('guest_name', 'like', "%{$search}%")
                  ->orWhere('ref', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($safari = $request->input('safari')) {
            $query->where('safari_name', $safari);
        }

        if ($type = $request->input('group_type')) {
            $query->where('group_type', $type);
        }

        return BookingResource::collection($query->paginate(50));
    }

    public function show(Booking $booking)
    {
        return new BookingResource($booking);
    }

    public function store(StoreBookingRequest $request)
    {
        $booking = Booking::create($request->validated());
        AdminNotification::create([
            'type' => 'booking',
            'message' => 'New booking for ' . ($booking->safari_name ?: 'Safari Package'),
            'related_id' => $booking->id,
        ]);
        return (new BookingResource($booking))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateBookingRequest $request, Booking $booking)
    {
        $booking->update($request->validated());
        return new BookingResource($booking);
    }

    public function destroy(Booking $booking)
    {
        $booking->delete();
        return response()->json(null, 204);
    }
}
