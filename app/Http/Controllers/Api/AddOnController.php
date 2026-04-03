<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AddOnResource;
use App\Models\AddOn;

class AddOnController extends Controller
{
    public function index()
    {
        return AddOnResource::collection(AddOn::orderBy('name')->get());
    }

    public function show(AddOn $addOn)
    {
        return new AddOnResource($addOn);
    }
}
