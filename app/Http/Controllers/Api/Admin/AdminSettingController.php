<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Http\Resources\SettingResource;
use Illuminate\Http\Request;

class AdminSettingController extends Controller
{
    public function index(Request $request)
    {
        $query = Setting::query()
            ->orderBy('group')
            ->orderBy('key');

        if ($group = $request->query('group')) {
            $groups = collect(explode(',', (string) $group))
                ->map(fn ($g) => trim($g))
                ->filter()
                ->values()
                ->all();
            if (!empty($groups)) {
                $query->whereIn('group', $groups);
            }
        }

        return SettingResource::collection($query->paginate(100));
    }

    public function show(Setting $setting)
    {
        return new SettingResource($setting);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'key'   => 'required|string|max:255|unique:settings,key',
            'value' => 'nullable|string',
            'group' => 'nullable|string|max:255',
        ]);

        $instance = Setting::create([
            'key' => trim((string) $data['key']),
            'value' => $data['value'] ?? null,
            'group' => isset($data['group']) ? trim((string) $data['group']) : null,
        ]);

        return (new SettingResource($instance))
            ->response()
            ->setStatusCode(201);
    }

    public function update(Request $request, Setting $setting)
    {
        $data = $request->validate([
            'key' => 'sometimes|string|max:255|unique:settings,key,' . $setting->id,
            'value' => 'nullable|string',
            'group' => 'nullable|string|max:255',
        ]);

        $setting->update([
            'key' => array_key_exists('key', $data) ? trim((string) $data['key']) : $setting->key,
            'value' => $data['value'] ?? null,
            'group' => array_key_exists('group', $data) ? (trim((string) $data['group']) ?: null) : $setting->group,
        ]);
        return new SettingResource($setting);
    }

    public function destroy(Setting $setting)
    {
        $setting->delete();
        return response()->json(null, 204);
    }
}
