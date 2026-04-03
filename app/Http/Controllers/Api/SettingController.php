<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index(Request $request)
    {
        $query = Setting::query();

        if ($group = $request->query('group')) {
            $groups = collect(explode(',', (string) $group))
                ->map(fn ($g) => trim($g))
                ->filter()
                ->values()
                ->all();
            if (!empty($groups)) {
                $query->whereIn('group', $groups);
            }
        } else {
            $query->whereIn('group', ['general', 'social', 'homepage', 'integrations', 'maintenance']);
        }

        return response()->json(
            $query->orderBy('group')->orderBy('key')->get(['key', 'value', 'group'])
        );
    }
}
