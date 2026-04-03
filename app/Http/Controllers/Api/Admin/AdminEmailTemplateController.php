<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\EmailTemplate;
use App\Http\Resources\EmailTemplateResource;
use Illuminate\Http\Request;

class AdminEmailTemplateController extends Controller
{
    public function index()
    {
        return EmailTemplateResource::collection(EmailTemplate::latest()->paginate(50));
    }

    public function show(EmailTemplate $emailTemplate)
    {
        return new EmailTemplateResource($emailTemplate);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => 'required|string|max:100|unique:email_templates,type',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
            'variables' => 'nullable|array',
        ]);
        $instance = EmailTemplate::create($data);
        return (new EmailTemplateResource($instance))->response()->setStatusCode(201);
    }

    public function update(Request $request, EmailTemplate $emailTemplate)
    {
        $data = $request->validate([
            'type' => 'sometimes|string|max:100|unique:email_templates,type,' . $emailTemplate->id,
            'subject' => 'sometimes|string|max:255',
            'body' => 'sometimes|string',
            'variables' => 'nullable|array',
        ]);
        $emailTemplate->update($data);
        return new EmailTemplateResource($emailTemplate);
    }

    public function destroy(EmailTemplate $emailTemplate)
    {
        $emailTemplate->delete();
        return response()->json(null, 204);
    }
}
