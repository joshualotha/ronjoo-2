<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class PrerenderMiddleware
{
    /**
     * The crawler user agents that we want to prerender for.
     */
    protected $crawlerUserAgents = [
        'googlebot',
        'yahoo',
        'bingbot',
        'yandex',
        'baiduspider',
        'facebookexternalhit',
        'twitterbot',
        'rogerbot',
        'linkedinbot',
        'embedly',
        'quora link preview',
        'showyoubot',
        'outbrain',
        'pinterest',
        'slackbot',
        'vkShare',
        'W3C_Validator',
        'redditbot',
        'applebot',
        'whatsapp',
        'flipboard',
        'tumblr',
        'bitlybot',
        'skypeuripreview',
        'nuzzel',
        'discordbot',
        'google page speed',
        'qwantify',
        'pinterestbot',
        'bitrix link preview',
        'xing-contenttabreceiver',
        'chrome-lighthouse',
        'telegrambot'
    ];

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if ($this->shouldShowPrerenderedPage($request)) {
            $prerenderUrl = rtrim(config('services.prerender.url', 'https://service.prerender.io'), '/') . '/' . $request->fullUrl();
            $prerenderToken = config('services.prerender.token', env('PRERENDER_TOKEN'));

            $headers = [];
            if ($prerenderToken) {
                $headers['X-Prerender-Token'] = $prerenderToken;
            }

            try {
                $response = Http::withHeaders($headers)
                    ->timeout(30)
                    ->get($prerenderUrl);

                if ($response->successful()) {
                    return response($response->body(), $response->status())
                        ->withHeaders($response->headers());
                }
            } catch (\Exception $e) {
                // If prerender fails, just fallback to normal SPA response
            }
        }

        return $next($request);
    }

    /**
     * Determine if we should show the prerendered page.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return bool
     */
    protected function shouldShowPrerenderedPage(Request $request)
    {
        $userAgent = strtolower($request->server('HTTP_USER_AGENT'));
        $bufferAgent = $request->server('HTTP_X_BUFFERBOT');

        if (!$userAgent) {
            return false;
        }

        // Always prerender if explicitly asked via _escaped_fragment_
        if ($request->query->has('_escaped_fragment_')) {
            return true;
        }

        if ($request->method() !== 'GET') {
            return false;
        }

        // Never prerender API routes or admin routes
        if ($request->is('api/*') || $request->is('kijani-desk/*')) {
            return false;
        }

        foreach ($this->crawlerUserAgents as $crawlerUserAgent) {
            if (Str::contains($userAgent, strtolower($crawlerUserAgent))) {
                return true;
            }
        }

        if ($bufferAgent) {
            return true;
        }

        return false;
    }
}
