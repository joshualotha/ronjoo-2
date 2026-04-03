<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use App\Http\Requests\Admin\StoreDestinationRequest;
use App\Http\Requests\Admin\UpdateDestinationRequest;
use App\Http\Resources\DestinationResource;
use Illuminate\Support\Facades\DB;

class AdminDestinationController extends Controller
{
    public function index()
    {
        $destinations = Destination::orderBy('name')
            ->get();

        return DestinationResource::collection($destinations);
    }

    public function show(Destination $destination)
    {
        $destination->load(['accommodations', 'faqs']);
        return new DestinationResource($destination);
    }

    public function store(StoreDestinationRequest $request)
    {
        return DB::transaction(function () use ($request) {
            $data = $request->validated();

            // Extract nested relations
            $accommodations = $data['accommodations'] ?? [];
            $faqs           = $data['faqs'] ?? [];
            unset($data['accommodations'], $data['faqs']);

            // Store JSON arrays on model
            $data['quick_facts'] = $data['quick_facts'] ?? [];
            $data['wildlife']    = $data['wildlife'] ?? [];
            $data['experiences'] = $data['experiences'] ?? [];
            $data['gallery']     = $data['gallery'] ?? [];

            $data['hero_image']     = $data['hero_image'] ?? '';
            $data['portrait_image'] = $data['portrait_image'] ?? '';

            $destination = Destination::create($data);

            foreach ($accommodations as $acc) {
                $destination->accommodations()->create($acc);
            }

            foreach ($faqs as $faq) {
                $destination->faqs()->create($faq);
            }

            return (new DestinationResource($destination->load(['accommodations', 'faqs'])))
                ->response()
                ->setStatusCode(201);
        });
    }

    public function update(UpdateDestinationRequest $request, Destination $destination)
    {
        return DB::transaction(function () use ($request, $destination) {
            $data = $request->validated();

            $accommodations = $data['accommodations'] ?? null;
            $faqs           = $data['faqs'] ?? null;
            unset($data['accommodations'], $data['faqs']);

            $destination->update($data);

            if ($accommodations !== null) {
                $destination->accommodations()->delete();
                foreach ($accommodations as $acc) {
                    $destination->accommodations()->create($acc);
                }
            }

            if ($faqs !== null) {
                $destination->faqs()->delete();
                foreach ($faqs as $faq) {
                    $destination->faqs()->create($faq);
                }
            }

            return new DestinationResource($destination->load(['accommodations', 'faqs']));
        });
    }

    public function destroy(Destination $destination)
    {
        DB::transaction(function () use ($destination) {
            $destination->accommodations()->delete();
            $destination->faqs()->delete();
            $destination->delete();
        });

        return response()->json(null, 204);
    }
}
