<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Safari;
use App\Models\ItineraryDay;
use App\Http\Requests\Admin\StoreSafariRequest;
use App\Http\Requests\Admin\UpdateSafariRequest;
use App\Http\Resources\SafariResource;
use Illuminate\Support\Facades\DB;

class AdminSafariController extends Controller
{
    public function index()
    {
        $safaris = Safari::withCount('bookings')
            ->orderBy('name')
            ->get();

        return SafariResource::collection($safaris);
    }

    public function show(Safari $safari)
    {
        $safari->load(['itineraryDays', 'accommodations', 'accommodationsList']);
        return new SafariResource($safari);
    }

    public function store(StoreSafariRequest $request)
    {
        return DB::transaction(function () use ($request) {
            $data = $request->validated();

            // Extract nested data
            $itinerary      = $data['itinerary'] ?? [];
            $priceTiers     = $data['price_tiers'] ?? [];
            $accommodations = $data['accommodations'] ?? [];
            unset($data['itinerary'], $data['price_tiers'], $data['accommodations']);

            // Map price_from → price (DB column is 'price')
            if (isset($data['price_from'])) {
                $data['price'] = $data['price_from'];
                unset($data['price_from']);
            }

            // Store JSON arrays directly on the model
            $data['highlights'] = $data['highlights'] ?? [];
            $data['inclusions'] = $data['inclusions'] ?? [];
            $data['exclusions'] = $data['exclusions'] ?? [];
            $data['price_tiers'] = $priceTiers;

            $safari = Safari::create($data);

            // Sync itinerary days
            foreach ($itinerary as $dayData) {
                if (isset($dayData['day_number'])) {
                    $dayData['day'] = $dayData['day_number'];
                    unset($dayData['day_number']);
                }
                $safari->itineraryDays()->create($dayData);
            }

            // Sync accommodations (legacy)
            foreach ($accommodations as $acc) {
                $safari->accommodations()->create($acc);
            }

            // Sync normalized accommodation_ids if provided
            if ($request->has('accommodation_ids')) {
                $this->syncAccommodationIds($safari, $request->input('accommodation_ids', []));
            }

            return (new SafariResource($safari->load(['itineraryDays', 'accommodations', 'accommodationsList'])))
                ->response()
                ->setStatusCode(201);
        });
    }

    public function update(UpdateSafariRequest $request, Safari $safari)
    {
        return DB::transaction(function () use ($request, $safari) {
            $data = $request->validated();

            // Map price_from → price (DB column is 'price')
            if (isset($data['price_from'])) {
                $data['price'] = $data['price_from'];
                unset($data['price_from']);
            }

            // Extract nested data
            $itinerary      = $data['itinerary'] ?? null;
            $accommodations = $data['accommodations'] ?? null;
            unset($data['itinerary'], $data['accommodations']);

            $safari->update($data);

            // Replace itinerary days if provided
            if ($itinerary !== null) {
                $safari->itineraryDays()->delete();
                foreach ($itinerary as $dayData) {
                    if (isset($dayData['day_number'])) {
                        $dayData['day'] = $dayData['day_number'];
                        unset($dayData['day_number']);
                    }
                    $safari->itineraryDays()->create($dayData);
                }
            }

            // Replace accommodations if provided (legacy)
            if ($accommodations !== null) {
                $safari->accommodations()->delete();
                foreach ($accommodations as $acc) {
                    $safari->accommodations()->create($acc);
                }
            }

            // Sync normalized accommodation_ids if provided
            if ($request->has('accommodation_ids')) {
                $this->syncAccommodationIds($safari, $request->input('accommodation_ids', []));
            }

            return new SafariResource($safari->load(['itineraryDays', 'accommodations', 'accommodationsList']));
        });
    }

    public function destroy(Safari $safari)
    {
        DB::transaction(function () use ($safari) {
            $safari->itineraryDays()->delete();
            $safari->accommodations()->delete();
            $safari->delete();
        });

        return response()->json(null, 204);
    }

    private function syncAccommodationIds(Safari $safari, array $entries): void
    {
        $syncData = [];
        foreach ($entries as $i => $entry) {
            $syncData[$entry['id']] = [
                'nights'     => $entry['nights'] ?? 1,
                'sort_order' => $entry['sort_order'] ?? $i,
            ];
        }
        $safari->accommodationsList()->sync($syncData);
    }
}
