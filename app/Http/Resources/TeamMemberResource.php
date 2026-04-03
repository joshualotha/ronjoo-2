<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeamMemberResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'name'            => $this->name,
            'role'            => $this->role,
            'experience'      => $this->experience,
            'languages'       => $this->languages,
            'specializations' => $this->specializations,
            'showOnWebsite'   => $this->show_on_website,
            'photo'           => $this->photo,
            'bio'             => $this->bio,
        ];
    }
}
