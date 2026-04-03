<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    public function index()
    {
        return UserResource::collection(User::latest()->paginate(50));
    }

    public function show(User $user)
    {
        return new UserResource($user);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'role' => ['required', Rule::in(['super-admin', 'content-editor'])],
            'password' => ['required', 'string', 'min:8'],
        ]);

        $data['password'] = Hash::make($data['password']);
        $instance = User::create($data);
        return (new UserResource($instance))->response()->setStatusCode(201);
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'role' => ['sometimes', Rule::in(['super-admin', 'content-editor'])],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        if (! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);
        return new UserResource($user);
    }

    public function destroy(User $user)
    {
        if ((int) request()->user()->id === (int) $user->id) {
            return response()->json(['message' => 'Cannot delete your own account.'], 403);
        }

        $user->delete();
        return response()->json(null, 204);
    }
}
