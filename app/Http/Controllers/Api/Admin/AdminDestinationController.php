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
        $destination->load(['accommodations', 'accommodationsList', 'faqs', 'wildlifeAnimals']);
        return new DestinationResource($destination);
    }

    public function store(StoreDestinationRequest $request)
    {
        return DB::transaction(function () use ($request) {
            $data = $request->validated();

            // Extract nested relations
            $accommodations      = $data['accommodations'] ?? [];
            $faqs                = $data['faqs'] ?? [];
            $wildlifeEntries     = $data['wildlife_ids'] ?? [];
            $accommodationIds    = $data['accommodation_ids'] ?? null;
            unset($data['accommodations'], $data['faqs'], $data['wildlife_ids'], $data['accommodation_ids']);

            // Store JSON arrays on model
            $data['quick_facts'] = $data['quick_facts'] ?? [];
            $data['wildlife']    = $data['wildlife'] ?? [];   // Keep legacy JSON for now
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

            // Sync wildlife via pivot
            if (!empty($wildlifeEntries)) {
                $this->syncWildlife($destination, $wildlifeEntries);
            }

            // Sync normalized accommodation_ids if provided
            if ($accommodationIds !== null) {
                $this->syncAccommodations($destination, $accommodationIds);
            }

            return (new DestinationResource($destination->load(['accommodations', 'accommodationsList', 'faqs', 'wildlifeAnimals'])))
                ->response()
                ->setStatusCode(201);
        });
    }

    public function update(UpdateDestinationRequest $request, Destination $destination)
    {
        return DB::transaction(function () use ($request, $destination) {
            $data = $request->validated();

            $accommodations      = $data['accommodations'] ?? null;
            $faqs                = $data['faqs'] ?? null;
            $wildlifeEntries     = $data['wildlife_ids'] ?? null;
            $accommodationIds    = $data['accommodation_ids'] ?? null;
            unset($data['accommodations'], $data['faqs'], $data['wildlife_ids'], $data['accommodation_ids']);

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

            // Sync wildlife via pivot
            if ($wildlifeEntries !== null) {
                $this->syncWildlife($destination, $wildlifeEntries);
            }

            // Sync normalized accommodation_ids if provided
            if ($accommodationIds !== null) {
                $this->syncAccommodations($destination, $accommodationIds);
            }

            return new DestinationResource($destination->load(['accommodations', 'accommodationsList', 'faqs', 'wildlifeAnimals']));
        });
    }

    public function destroy(Destination $destination)
    {
        DB::transaction(function () use ($destination) {
            $destination->wildlifeAnimals()->detach();
            $destination->accommodationsList()->detach();
            $destination->accommodations()->delete();
            $destination->faqs()->delete();
            $destination->delete();
        });

        return response()->json(null, 204);
    }

    /**
     * Sync wildlife relationships from an array of entries.
     * Each entry: { id: int, likelihood?: string, custom_fact?: string, sort_order?: int }
     */
    private function syncWildlife(Destination $destination, array $entries): void
    {
        $syncData = [];
        foreach ($entries as $i => $entry) {
            $wildlifeId = is_array($entry) ? ($entry['id'] ?? null) : $entry;
            if (!$wildlifeId) continue;

            $syncData[$wildlifeId] = [
                'likelihood'  => is_array($entry) ? ($entry['likelihood'] ?? 'Common') : 'Common',
                'custom_fact' => is_array($entry) ? ($entry['custom_fact'] ?? null) : null,
                'sort_order'  => is_array($entry) ? ($entry['sort_order'] ?? $i) : $i,
            ];
        }

        $destination->wildlifeAnimals()->sync($syncData);
    }

    private function syncAccommodations(Destination $destination, array $entries): void
    {
        $syncData = [];
        foreach ($entries as $i => $entry) {
            $accId = is_array($entry) ? ($entry['id'] ?? null) : $entry;
            if (!$accId) continue;
            $syncData[$accId] = [
                'sort_order' => is_array($entry) ? ($entry['sort_order'] ?? $i) : $i,
            ];
        }
        $destination->accommodationsList()->sync($syncData);
    }
}
