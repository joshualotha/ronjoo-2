<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTeamMemberRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'              => 'sometimes|string|max:255',
            'role'              => 'sometimes|string|max:100',
            'experience'        => 'sometimes|integer|min:0|max:50',
            'languages'         => 'nullable|array',
            'languages.*'       => 'string|max:50',
            'specializations'   => 'nullable|array',
            'specializations.*' => 'string|max:100',
            'show_on_website'   => 'sometimes|boolean',
            'photo'             => 'nullable|string',
            'bio'               => 'nullable|string',
        ];
    }

    protected function prepareForValidation()
    {
        if ($this->has('showOnWebsite')) {
            $this->merge(['show_on_website' => $this->boolean('showOnWebsite')]);
        }
    }
}
