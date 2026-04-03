<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Waitlist;
use App\Http\Resources\WaitlistResource;
use Illuminate\Http\Request;

class AdminWaitlistController extends Controller
{
    public function index()
    {
        return WaitlistResource::collection(Waitlist::query()->latest()->paginate(50));
    }

    public function show(Waitlist $waitlist)
    {
        return new WaitlistResource($waitlist);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'guest_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:30',
            'departure_id' => 'required|integer|exists:departures,id',
            'pax' => 'nullable|integer|min:1|max:20',
            'notes' => 'nullable|string|max:2000',
            'status' => 'nullable|in:waiting,notified,converted,cancelled',
        ]);
        $instance = Waitlist::create($data);
        return (new WaitlistResource($instance))->response()->setStatusCode(201);
    }

    public function update(Request $request, Waitlist $waitlist)
    {
        $data = $request->validate([
            'guest_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255',
            'phone' => 'nullable|string|max:30',
            'departure_id' => 'sometimes|integer|exists:departures,id',
            'pax' => 'sometimes|integer|min:1|max:20',
            'notes' => 'nullable|string|max:2000',
            'status' => 'sometimes|in:waiting,notified,converted,cancelled',
        ]);
        $waitlist->update($data);
        return new WaitlistResource($waitlist);
    }

    public function destroy(Waitlist $waitlist)
    {
        $waitlist->delete();
        return response()->json(null, 204);
    }
}
