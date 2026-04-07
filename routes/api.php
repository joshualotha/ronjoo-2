<?php

use App\Http\Controllers\Api\{SafariController, DestinationController, AddOnController,
    FaqController, TravelGuideController, ReviewController, BlogPostController, DepartureController, SettingController};
use App\Http\Controllers\Api\Admin\{
    AdminAuthController, AdminDashboardController,
    AdminBookingController, AdminEnquiryController, AdminDepartureController,
    AdminSafariController, AdminDestinationController, AdminReviewController,
    AdminBlogPostController, AdminFaqController, AdminTravelGuideController,
    AdminTeamMemberController, AdminSubscriberController, AdminAddOnController,
    AdminGalleryImageController, AdminWildlifeController,
    AdminAccommodationController
};
use App\Http\Middleware\EnsureAdmin;

use App\Http\Controllers\Api\Admin\AdminWaitlistController;
use App\Http\Controllers\Api\Admin\AdminPromotionController;
use App\Http\Controllers\Api\Admin\AdminSeoMetadataController;
use App\Http\Controllers\Api\Admin\AdminEmailTemplateController;
use App\Http\Controllers\Api\Admin\AdminSettingController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\Admin\AdminNotificationController;
use App\Http\Controllers\Api\Admin\AdminUploadController;

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public API (Read-Only)
|--------------------------------------------------------------------------
*/

Route::get('/safaris',             [SafariController::class, 'index']);
Route::get('/safaris/{safari}',    [SafariController::class, 'show']);

Route::get('/destinations',                 [DestinationController::class, 'index']);
Route::get('/destinations/{destination}',   [DestinationController::class, 'show']);

Route::get('/add-ons',           [AddOnController::class, 'index']);
Route::get('/add-ons/{addOn}',   [AddOnController::class, 'show']);

Route::get('/faqs',              [FaqController::class, 'index']);

Route::get('/travel-guides',              [AdminTravelGuideController::class, 'index']);
Route::get('/travel-guides/{travelGuide}',[AdminTravelGuideController::class, 'show']);

Route::get('/reviews',           [ReviewController::class, 'index']);
Route::post('/reviews',          [ReviewController::class, 'store'])
    ->middleware('throttle:3,1');

Route::get('/blog-posts',           [BlogPostController::class, 'index']);
Route::get('/blog-posts/{blogPost}',[BlogPostController::class, 'show']);

Route::get('/departures',           [DepartureController::class, 'index']);
Route::get('/settings',             [SettingController::class, 'index']);
Route::get('/gallery-images',       [AdminGalleryImageController::class, 'index']);
Route::get('/team',                 [AdminTeamMemberController::class, 'index']);
Route::get('/wildlife',             [AdminWildlifeController::class, 'index']);
Route::get('/accommodations',       [AdminAccommodationController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Public Form Submissions (throttled)
|--------------------------------------------------------------------------
*/

Route::post('/enquiries', [AdminEnquiryController::class, 'store'])
    ->middleware('throttle:5,1');

Route::post('/subscribers', [AdminSubscriberController::class, 'store'])
    ->middleware('throttle:3,1');

/*
|--------------------------------------------------------------------------
| Admin Auth (No middleware — login endpoint)
|--------------------------------------------------------------------------
*/

Route::post('/kijani-desk/login', [AdminAuthController::class, 'login'])->middleware('throttle:5,1');

/*
|--------------------------------------------------------------------------
| Admin API (Authenticated + Admin Role)
|--------------------------------------------------------------------------
| This admin area uses cookie-based sessions for robust refresh/login behavior.
*/
Route::middleware(['auth:sanctum', EnsureAdmin::class])->prefix('kijani-desk')->group(function () {
    // Auth
    Route::post('/logout',  [AdminAuthController::class, 'logout']);
    Route::get('/me',       [AdminAuthController::class, 'me']);
    Route::patch('/profile', [AdminAuthController::class, 'updateProfile']);

    // Uploads
    Route::post('/upload', [AdminUploadController::class, 'store']);
    Route::delete('/upload', [AdminUploadController::class, 'destroy']);

    // Dashboard
    Route::get('/dashboard', [AdminDashboardController::class, 'index']);

    // Bookings
    Route::apiResource('bookings', AdminBookingController::class);

    // Enquiries
    Route::apiResource('enquiries', AdminEnquiryController::class);
    Route::post('/enquiries/{enquiry}/reply', [AdminEnquiryController::class, 'reply']);
    Route::post('/enquiries/{enquiry}/convert', [AdminEnquiryController::class, 'convertToBooking']);

    // Departures
    Route::apiResource('departures', AdminDepartureController::class);

    // Safaris — bind by id (model uses slug for public routes)
    Route::apiResource('safaris', AdminSafariController::class)
        ->scoped(['safari' => 'id']);

    // Destinations — bind by id
    Route::apiResource('destinations', AdminDestinationController::class)
        ->scoped(['destination' => 'id']);

    // Reviews
    Route::apiResource('reviews', AdminReviewController::class);
    Route::patch('/reviews/{review}/status', [AdminReviewController::class, 'updateStatus']);
    Route::patch('/reviews/{review}/response', [AdminReviewController::class, 'saveResponse']);

    // Blog Posts — bind by id
    Route::apiResource('blog-posts', AdminBlogPostController::class)
        ->scoped(['blog_post' => 'id']);

    // FAQs
    Route::apiResource('faqs', AdminFaqController::class);
    Route::post('/faq-categories', [AdminFaqController::class, 'storeCategory']);

    // Travel Guides — bind by id
    Route::apiResource('travel-guides', AdminTravelGuideController::class)
        ->scoped(['travel_guide' => 'id']);

    // Team Members
    Route::apiResource('team', AdminTeamMemberController::class)->parameters(['team' => 'teamMember']);

    // Subscribers
    Route::apiResource('subscribers', AdminSubscriberController::class)->except(['show']);

    // Add-Ons
    Route::apiResource('add-ons', AdminAddOnController::class)
        ->scoped(['add_on' => 'id']);

    // Gallery
    Route::apiResource('gallery-images', AdminGalleryImageController::class);

    // Admin Users, Settings, SEO, Email Templates, Promotions, Waitlists
    Route::apiResource('users', AdminUserController::class);
    Route::apiResource('settings', AdminSettingController::class);
    Route::apiResource('seo', AdminSeoMetadataController::class);
    Route::apiResource('email-templates', AdminEmailTemplateController::class);
    Route::apiResource('promotions', AdminPromotionController::class);
    Route::apiResource('waitlists', AdminWaitlistController::class);
    Route::apiResource('wildlife', AdminWildlifeController::class);
    Route::apiResource('accommodations', AdminAccommodationController::class);
    Route::get('/notifications', [AdminNotificationController::class, 'index']);
    Route::patch('/notifications/{notification}/read', [AdminNotificationController::class, 'read']);
    Route::patch('/notifications/read-all', [AdminNotificationController::class, 'readAll']);
});
