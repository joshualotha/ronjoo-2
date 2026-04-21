<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;
use App\Models\Safari;
use App\Models\Destination;
use App\Models\AddOn;
use App\Models\BlogPost;

class GenerateSitemap extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sitemap:generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate the XML sitemap for SEO';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Generating sitemap...');

        $sitemap = Sitemap::create();

        // High priority static routes
        $staticRoutes = [
            '/', '/safaris', '/departures', '/plan', '/destinations',
            '/about', '/contact', '/faq', '/gallery', '/add-ons',
            '/blog', '/reviews'
        ];

        foreach ($staticRoutes as $route) {
            $priority = $route === '/' ? 1.0 : 0.8;
            $sitemap->add(Url::create($route)
                ->setPriority($priority)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY));
        }

        // Safaris
        Safari::published()->get()->each(function (Safari $safari) use ($sitemap) {
            $sitemap->add(Url::create("/safaris/{$safari->slug}")
                ->setLastModificationDate($safari->updated_at)
                ->setPriority(0.9)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY));
                
            $sitemap->add(Url::create("/book/{$safari->slug}")
                ->setPriority(0.6));
        });

        // Destinations
        Destination::all()->each(function (Destination $destination) use ($sitemap) {
            $sitemap->add(Url::create("/destinations/{$destination->slug}")
                ->setLastModificationDate($destination->updated_at)
                ->setPriority(0.8));
        });

        // AddOns
        AddOn::all()->each(function (AddOn $addOn) use ($sitemap) {
            $sitemap->add(Url::create("/add-ons/{$addOn->slug}")
                ->setLastModificationDate($addOn->updated_at)
                ->setPriority(0.7));
        });

        // Blog Posts
        BlogPost::published()->get()->each(function (BlogPost $post) use ($sitemap) {
            $sitemap->add(Url::create("/blog/{$post->slug}")
                ->setLastModificationDate($post->updated_at)
                ->setPriority(0.7));
        });

        $sitemap->writeToFile(public_path('sitemap.xml'));

        $this->info('Sitemap generated successfully at public/sitemap.xml');
    }
}
