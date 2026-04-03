<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use App\Http\Requests\Admin\StoreTeamMemberRequest;
use App\Http\Requests\Admin\UpdateTeamMemberRequest;
use App\Http\Resources\TeamMemberResource;

class AdminTeamMemberController extends Controller
{
    public function index()
    {
        return TeamMemberResource::collection(TeamMember::orderBy('name')->get());
    }

    public function show(TeamMember $teamMember)
    {
        return new TeamMemberResource($teamMember);
    }

    public function store(StoreTeamMemberRequest $request)
    {
        $member = TeamMember::create($request->validated());
        return (new TeamMemberResource($member))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateTeamMemberRequest $request, TeamMember $teamMember)
    {
        $teamMember->update($request->validated());
        return new TeamMemberResource($teamMember);
    }

    public function destroy(TeamMember $teamMember)
    {
        $teamMember->delete();
        return response()->json(null, 204);
    }
}
