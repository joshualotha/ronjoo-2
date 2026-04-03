<?php

namespace Database\Seeders;

use App\Models\TeamMember;
use Illuminate\Database\Seeder;

class TeamMemberSeeder extends Seeder
{
    public function run(): void
    {
        $members = [
            [
                'name'            => 'Joseph Makacha',
                'role'            => 'Senior Guide',
                'experience'      => '18 years',
                'languages'       => ['English', 'Swahili', 'German'],
                'specializations' => ['Serengeti', 'Ngorongoro', 'Photography'],
                'show_on_website' => true,
                'bio'             => 'Joseph has been guiding in the Serengeti since 2008. He can identify over 400 bird species by call and knows individual lion pride histories spanning three generations. His photography instincts make him the first choice for photography safari clients.',
            ],
            [
                'name'            => 'Daniel Kimaro',
                'role'            => 'Guide',
                'experience'      => '12 years',
                'languages'       => ['English', 'Swahili', 'French'],
                'specializations' => ['Serengeti', 'Tarangire', 'Birdwatching'],
                'show_on_website' => true,
                'bio'             => 'Daniel grew up near Tarangire National Park and has an extraordinary knowledge of elephant behavior. He is our top-rated guide for birdwatching enthusiasts and French-speaking guests.',
            ],
            [
                'name'            => 'Emmanuel Mollel',
                'role'            => 'Kilimanjaro Specialist',
                'experience'      => '15 years',
                'languages'       => ['English', 'Swahili'],
                'specializations' => ['Kilimanjaro', 'Lemosho', 'Machame'],
                'show_on_website' => true,
                'bio'             => 'Emmanuel has summited Kilimanjaro over 200 times via every route. His calm leadership on summit night has guided hundreds of clients to Uhuru Peak. He is certified in high-altitude medicine.',
            ],
            [
                'name'            => 'Grace Njau',
                'role'            => 'Operations Manager',
                'experience'      => '10 years',
                'languages'       => ['English', 'Swahili'],
                'specializations' => ['Operations', 'Logistics'],
                'show_on_website' => true,
                'bio'             => 'Grace ensures every safari runs flawlessly behind the scenes. From lodge confirmations to vehicle maintenance schedules, she is the operational backbone of Ronjoo Safaris.',
            ],
            [
                'name'            => 'Peter Swai',
                'role'            => 'Guide',
                'experience'      => '8 years',
                'languages'       => ['English', 'Swahili', 'Italian'],
                'specializations' => ['Southern Circuit', 'Walking Safaris'],
                'show_on_website' => true,
                'bio'             => 'Peter specializes in the remote Southern Circuit, Ruaha and Nyerere. His walking safari skills are exceptional, trained by some of the finest walking guides in East Africa.',
            ],
        ];

        foreach ($members as $member) {
            TeamMember::updateOrCreate(['name' => $member['name']], $member);
        }
    }
}
