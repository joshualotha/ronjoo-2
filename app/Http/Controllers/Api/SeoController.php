<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\Safari;
use App\Models\Destination;
use App\Models\AddOn;
use App\Models\BlogPost;
use Illuminate\Http\Request;

class SeoController extends Controller
{
    public function robots()
    {
        // Get custom robots.txt from settings, or fallback to default
        $robotsContent = Setting::where('key', 'seo_robots_txt')->value('value');
        
        if (!$robotsContent) {
            $domain = config('app.url');
            $robotsContent = "User-agent: *\nDisallow:\n\nSitemap: {$domain}/sitemap.xml\n";
        }

        return response($robotsContent, 200)
            ->header('Content-Type', 'text/plain');
    }

    public function sitemap()
    {
        $domain = config('app.url');
        
        $urls = [];
        $yesterday = now()->subDay()->toAtomString();
        $urls[] = ['loc' => $domain, 'lastmod' => $yesterday, 'changefreq' => 'daily', 'priority' => '1.0'];
        $urls[] = ['loc' => $domain . '/safaris', 'lastmod' => $yesterday, 'changefreq' => 'daily', 'priority' => '0.9'];
        $urls[] = ['loc' => $domain . '/destinations', 'lastmod' => $yesterday, 'changefreq' => 'daily', 'priority' => '0.9'];
        $urls[] = ['loc' => $domain . '/add-ons', 'lastmod' => $yesterday, 'changefreq' => 'daily', 'priority' => '0.8'];
        $urls[] = ['loc' => $domain . '/blog', 'lastmod' => $yesterday, 'changefreq' => 'weekly', 'priority' => '0.8'];
        $urls[] = ['loc' => $domain . '/faqs', 'lastmod' => $yesterday, 'changefreq' => 'weekly', 'priority' => '0.5'];

        $safaris = Safari::published()->get();
        foreach($safaris as $safari) {
            $urls[] = [
                'loc' => $domain . '/safaris/' . $safari->slug,
                'lastmod' => $safari->updated_at->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => '0.8'
            ];
        }

        $destinations = Destination::all();
        foreach($destinations as $dest) {
            $urls[] = [
                'loc' => $domain . '/destinations/' . $dest->slug,
                'lastmod' => $dest->updated_at->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => '0.7'
            ];
        }

        $addons = AddOn::all();
        foreach($addons as $addon) {
            $urls[] = [
                'loc' => $domain . '/add-ons/' . $addon->slug,
                'lastmod' => $addon->updated_at->toAtomString(),
                'changefreq' => 'monthly',
                'priority' => '0.6'
            ];
        }

        $posts = BlogPost::where('status', 'published')->get();
        foreach($posts as $post) {
            $urls[] = [
                'loc' => $domain . '/blog/' . $post->slug,
                'lastmod' => $post->updated_at->toAtomString(),
                'changefreq' => 'monthly',
                'priority' => '0.7'
            ];
        }

        $xml = new \SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>');
        
        foreach ($urls as $urlDef) {
            $url = $xml->addChild('url');
            $url->addChild('loc', htmlspecialchars($urlDef['loc']));
            $url->addChild('lastmod', $urlDef['lastmod']);
            $url->addChild('changefreq', $urlDef['changefreq']);
            $url->addChild('priority', $urlDef['priority']);
        }

        return response($xml->asXML(), 200)
            ->header('Content-Type', 'text/xml');
    }
}
