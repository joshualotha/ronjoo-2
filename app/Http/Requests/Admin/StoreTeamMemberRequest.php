<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreTeamMemberRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'                => 'required|string|max:255',
            'role'                => 'required|string|max:100',
            'experience'          => 'required|integer|min:0|max:50',
            'languages'           => 'nullable|array',
            'languages.*'         => 'string|max:50',
            'specializations'     => 'nullable|array',
            'specializations.*'   => 'string|max:100',
            'show_on_website'     => 'boolean',
        ];
    }
}
