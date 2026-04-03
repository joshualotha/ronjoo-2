<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Departure;
use App\Http\Requests\Admin\StoreDepartureRequest;
use App\Http\Requests\Admin\UpdateDepartureRequest;
use App\Http\Resources\DepartureResource;
use Illuminate\Http\Request;

class AdminDepartureController extends Controller
{
    public function index(Request $request)
    {
        $query = Departure::query()->orderBy('start_date');

        if ($filter = $request->input('filter')) {
            match ($filter) {
                'upcoming' => $query->where('status', '!=', 'completed'),
                'past'     => $query->where('status', 'completed'),
                default    => null,
            };
        }

        return DepartureResource::collection($query->paginate(50));
    }

    public function show(Departure $departure)
    {
        return new DepartureResource($departure);
    }

    public function store(StoreDepartureRequest $request)
    {
        $departure = Departure::create($request->validated());
        return (new DepartureResource($departure))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateDepartureRequest $request, Departure $departure)
    {
        $departure->update($request->validated());
        return new DepartureResource($departure);
    }

    public function destroy(Departure $departure)
    {
        $departure->delete();
        return response()->json(null, 204);
    }
}
