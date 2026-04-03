<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreSubscriberRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'email'   => 'required|email|max:255|unique:subscribers,email',
            'name'    => 'nullable|string|max:255',
            'country' => 'nullable|string|max:100',
            'source'  => 'nullable|string|max:50',
            'status'  => 'in:active,unsubscribed',
        ];
    }
}
