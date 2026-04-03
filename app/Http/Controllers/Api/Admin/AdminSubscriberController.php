<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscriber;
use App\Http\Requests\Admin\StoreSubscriberRequest;
use App\Http\Requests\Admin\UpdateSubscriberRequest;
use App\Http\Resources\SubscriberResource;
use Illuminate\Http\Request;

class AdminSubscriberController extends Controller
{
    public function index(Request $request)
    {
        $query = Subscriber::query()->orderByDesc('date_subscribed');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('email', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%");
            });
        }

        return SubscriberResource::collection($query->get());
    }

    public function store(StoreSubscriberRequest $request)
    {
        $data = $request->validated();
        $data['date_subscribed'] = now()->toDateString();
        $data['status'] = $data['status'] ?? 'active';

        $subscriber = Subscriber::create($data);
        return (new SubscriberResource($subscriber))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateSubscriberRequest $request, Subscriber $subscriber)
    {
        $subscriber->update($request->validated());
        return new SubscriberResource($subscriber);
    }

    public function destroy(Subscriber $subscriber)
    {
        $subscriber->delete();
        return response()->json(null, 204);
    }
}
