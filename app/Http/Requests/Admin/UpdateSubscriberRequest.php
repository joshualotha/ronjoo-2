<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSubscriberRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'email'   => 'sometimes|email|max:255|unique:subscribers,email,' . $this->route('subscriber'),
            'name'    => 'nullable|string|max:255',
            'country' => 'nullable|string|max:100',
            'source'  => 'nullable|string|max:50',
            'status'  => 'sometimes|in:active,unsubscribed',
        ];
    }
}
