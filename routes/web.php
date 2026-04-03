<?php

use Illuminate\Support\Facades\Route;

    use App\Http\Controllers\Api\SeoController;

    Route::get('/robots.txt', [SeoController::class, 'robots']);
    Route::get('/sitemap.xml', [SeoController::class, 'sitemap']);
    
    /*

|--------------------------------------------------------------------------
| SPA Catch-All
|--------------------------------------------------------------------------
| The React SPA is the UI for this application. In production, Vite builds
| to /dist and we serve that index.html. During development, the SPA runs
| on the Vite dev server (port 8080) and only the API is served by Laravel.
|
*/

Route::get('/{any?}', function () {
    $distPath = public_path('build/index.html');

    if (file_exists($distPath)) {
        return response()->file($distPath, [
            'Content-Type' => 'text/html',
        ]);
    }

    // Fallback: If no build exists, show a helpful message
    return response(
        '<h1>SPA Not Built</h1><p>Run <code>npm run build</code> first, then refresh.</p>',
        200,
        ['Content-Type' => 'text/html']
    );
})->where('any', '^(?!api|sanctum|_debugbar).*$');
