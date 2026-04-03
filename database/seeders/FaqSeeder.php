<?php

namespace Database\Seeders;

use App\Models\FaqCategory;
use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['slug' => 'planning', 'name' => 'Planning Your Safari', 'icon' => 'compass', 'teaser' => 'Choosing the right safari, season, and itinerary', 'sort_order' => 1],
            ['slug' => 'booking', 'name' => 'Booking & Payments', 'icon' => 'calendar', 'teaser' => 'Deposits, payment, cancellations, and confirmation', 'sort_order' => 2],
            ['slug' => 'health', 'name' => 'Health & Safety', 'icon' => 'shield', 'teaser' => 'Vaccinations, malaria, safety, and medical considerations', 'sort_order' => 3],
            ['slug' => 'on-safari', 'name' => 'What to Expect on Safari', 'icon' => 'binoculars', 'teaser' => 'Daily life, wildlife, comfort, and what surprises people', 'sort_order' => 4],
            ['slug' => 'kilimanjaro', 'name' => 'Kilimanjaro Questions', 'icon' => 'mountain', 'teaser' => 'Routes, altitude sickness, fitness requirements, and summit success', 'sort_order' => 5],
            ['slug' => 'zanzibar', 'name' => 'Zanzibar Questions', 'icon' => 'dhow', 'teaser' => 'Beaches, culture, activities, and getting there', 'sort_order' => 6],
            ['slug' => 'responsible', 'name' => 'Responsible Travel', 'icon' => 'leaf', 'teaser' => 'Conservation, community impact, and ethical choices', 'sort_order' => 7],
            ['slug' => 'ronjoo', 'name' => 'Working With Ronjoo', 'icon' => 'handshake', 'teaser' => 'Our team, our approach, and what sets us apart', 'sort_order' => 8],
        ];

        foreach ($categories as $cat) {
            FaqCategory::updateOrCreate(['slug' => $cat['slug']], $cat);
        }

        // Planning Your Safari FAQs
        $planning = FaqCategory::where('slug', 'planning')->first();
        $planningFaqs = [
            ['question' => 'When is the best time to visit Tanzania?', 'answer' => 'Tanzania is a year-round destination, but different seasons offer radically different experiences. **June–October** is the dry season, peak wildlife visibility, the Mara River crossings of the Great Migration, and clear golden-hour skies. **January–February** delivers the calving season in Ndutu. **March–May** is the long rains, lowest prices, lush landscapes. **November–December** is the short rains, excellent birding, baby animals, beautiful green scenery.', 'related_guide' => ['label' => 'Best Time to Visit Tanzania', 'href' => '/travel-resources/best-time-to-visit'], 'tags' => ['seasons', 'planning'], 'sort_order' => 1],
            ['question' => 'How far in advance should I book?', 'answer' => 'For peak season travel (July–October and January–February), we recommend booking **6–12 months in advance**. The best lodges and camps sell their peak dates first. For shoulder and low season, 3–6 months is typically sufficient.', 'tags' => ['booking', 'planning'], 'sort_order' => 2],
            ['question' => 'How long should my safari be?', 'answer' => 'The minimum meaningful safari is 4 nights. However, we recommend a **minimum of 6 nights** for first-time visitors to Tanzania. This allows for three parks, genuine wildlife encounters, and time to settle into the rhythm of the bush.', 'tags' => ['duration', 'planning'], 'sort_order' => 3],
            ['question' => 'What is the difference between a private safari and a group departure?', 'answer' => 'A **private safari** means the vehicle, guide, and itinerary are exclusively yours. A **group departure** means you book remaining seats on a pre-scheduled safari with other independent travelers, maximum 8 guests per vehicle. Both options use the same private Ronjoo guides and partner accommodations.', 'tags' => ['private', 'group'], 'sort_order' => 4],
            ['question' => 'Which parks should I include in my first safari?', 'answer' => 'For a first Tanzania safari: **Tarangire** (elephants, baobabs), **Ngorongoro Crater** (Big Five density, black rhino), and the **Serengeti** (open plains, big cats, migration). These three parks form the classic Tanzania safari.', 'related_safari' => ['label' => 'Northern Circuit Classic', 'href' => '/safaris/northern-circuit-classic'], 'tags' => ['parks', 'first-timer'], 'sort_order' => 5],
        ];

        foreach ($planningFaqs as $faq) {
            $faq['faq_category_id'] = $planning->id;
            Faq::updateOrCreate(
                ['faq_category_id' => $faq['faq_category_id'], 'question' => $faq['question']],
                $faq
            );
        }

        // Booking & Payments FAQs
        $booking = FaqCategory::where('slug', 'booking')->first();
        $bookingFaqs = [
            ['question' => 'How do I book a safari with Ronjoo?', 'answer' => 'Submit an enquiry through the booking form on any safari page or via WhatsApp. A safari specialist will respond within 4 hours. Your booking is confirmed on receipt of the 30% deposit. We do not charge booking fees.', 'tags' => ['booking'], 'sort_order' => 1],
            ['question' => 'How much deposit is required?', 'answer' => 'A **30% deposit** of the total safari cost is required to confirm your booking. Full payment is due 60 days before your departure date. For bookings made within 60 days, full payment is required at booking.', 'tags' => ['deposit', 'payment'], 'sort_order' => 2],
            ['question' => 'What payment methods do you accept?', 'answer' => 'We accept Visa, Mastercard, and American Express via Stripe. We also accept PayPal and international bank transfer (SWIFT). All prices are in USD. Card payments incur no additional surcharge.', 'tags' => ['payment'], 'sort_order' => 3],
            ['question' => 'What is your cancellation policy?', 'answer' => '**90+ days**: Full deposit refunded minus $150 processing fee. **60–89 days**: 50% deposit refunded. **30–59 days**: Deposit non-refundable. **Under 30 days**: 75% of total non-refundable. **Under 14 days**: 100% non-refundable. We strongly recommend comprehensive travel insurance.', 'tags' => ['cancellation'], 'sort_order' => 4],
        ];

        foreach ($bookingFaqs as $faq) {
            $faq['faq_category_id'] = $booking->id;
            Faq::updateOrCreate(
                ['faq_category_id' => $faq['faq_category_id'], 'question' => $faq['question']],
                $faq
            );
        }

        // Health & Safety FAQs
        $health = FaqCategory::where('slug', 'health')->first();
        $healthFaqs = [
            ['question' => 'Do I need malaria tablets for Tanzania?', 'answer' => 'Yes. Tanzania is a malaria-endemic country and antimalarial prophylaxis is strongly recommended. The most commonly prescribed options are Atovaquone-Proguanil (Malarone), Doxycycline, and Mefloquine. Consult your doctor at least 6 weeks before departure.', 'related_guide' => ['label' => 'Health & Vaccinations Tanzania', 'href' => '/travel-resources/health-vaccinations'], 'tags' => ['health', 'malaria'], 'sort_order' => 1],
            ['question' => 'What vaccinations do I need?', 'answer' => 'Recommended: **Hepatitis A and B**, **Typhoid**, updated **Tetanus-Diphtheria**. **Yellow Fever** vaccination is required if arriving from a yellow-fever endemic country. Consult a travel health specialist 6–8 weeks before departure.', 'tags' => ['health', 'vaccinations'], 'sort_order' => 2],
            ['question' => 'Is Tanzania safe for travelers?', 'answer' => 'Tanzania has one of the most stable political environments in East Africa and is consistently considered safe for tourists. Safari areas are managed and secure. You are accompanied by a Ronjoo guide during all safari activities.', 'tags' => ['safety'], 'sort_order' => 3],
        ];

        foreach ($healthFaqs as $faq) {
            $faq['faq_category_id'] = $health->id;
            Faq::updateOrCreate(
                ['faq_category_id' => $faq['faq_category_id'], 'question' => $faq['question']],
                $faq
            );
        }

        // What to Expect on Safari
        $onSafari = FaqCategory::where('slug', 'on-safari')->first();
        $onSafariFaqs = [
            ['question' => 'What does a typical safari day look like?', 'answer' => '**5:30–6:00am**: Wake-up call. **6:00–6:30am**: Morning game drive. **10:00–11:00am**: Hot breakfast. **11:00am–3:00pm**: Rest at camp. **3:30–4:00pm**: Afternoon game drive. **6:30–7:00pm**: Sundowner drinks and dinner.', 'tags' => ['daily-life'], 'sort_order' => 1],
            ['question' => 'How close will we get to the animals?', 'answer' => 'Closer than you expect. In Tanzania\'s national parks, wildlife has become habituated to safari vehicles over decades. Lions will sleep within 3 meters. Elephants will walk past your open door.', 'tags' => ['wildlife'], 'sort_order' => 2],
            ['question' => 'What are the lodges and camps like?', 'answer' => 'Our partner lodges range from classic tented camps (permanent canvas structures with en-suite bathrooms) to luxury lodges with private plunge pools. Luxury tented camps in Africa are not camping, they are among the finest accommodation experiences in the world.', 'tags' => ['accommodation'], 'sort_order' => 3],
        ];

        foreach ($onSafariFaqs as $faq) {
            $faq['faq_category_id'] = $onSafari->id;
            Faq::updateOrCreate(
                ['faq_category_id' => $faq['faq_category_id'], 'question' => $faq['question']],
                $faq
            );
        }

        // Kilimanjaro FAQs
        $kili = FaqCategory::where('slug', 'kilimanjaro')->first();
        $kiliFaqs = [
            ['question' => 'Which Kilimanjaro route is best?', 'answer' => 'The **Lemosho Route** is our top recommendation, highest summit success rates (85–90%), most varied scenery, and gradual acclimatization. The Machame Route is excellent for experienced trekkers. The Marangu Route has the lowest success rate.', 'related_safari' => ['label' => 'Kilimanjaro Lemosho Route', 'href' => '/safaris/kilimanjaro-lemosho'], 'tags' => ['routes'], 'sort_order' => 1],
            ['question' => 'What is the summit success rate?', 'answer' => 'On our 9-day Lemosho Route, Ronjoo\'s summit success rate is **87%**. The single most significant factor in summit success is route length, longer routes allow better acclimatization.', 'tags' => ['summit'], 'sort_order' => 2],
        ];

        foreach ($kiliFaqs as $faq) {
            $faq['faq_category_id'] = $kili->id;
            Faq::updateOrCreate(
                ['faq_category_id' => $faq['faq_category_id'], 'question' => $faq['question']],
                $faq
            );
        }

        // Zanzibar FAQs
        $zanzibar = FaqCategory::where('slug', 'zanzibar')->first();
        $zanzibarFaqs = [
            ['question' => 'Is Zanzibar worth including in a Tanzania safari?', 'answer' => 'Unequivocally yes. Tanzania is one of the only destinations on Earth where you can combine world-class wildlife safari and Indian Ocean beaches within a 25-minute flight. We recommend minimum 3 beach nights.', 'tags' => ['zanzibar'], 'sort_order' => 1],
            ['question' => 'What is the best beach area in Zanzibar?', 'answer' => '**Nungwi and Kendwa** (north): Best all-round beach. **Paje and Matemwe** (east): Excellent for kitesurfing. **Michamvi and Bwejuu** (southeast): Quieter, ideal for couples.', 'tags' => ['beaches'], 'sort_order' => 2],
        ];

        foreach ($zanzibarFaqs as $faq) {
            $faq['faq_category_id'] = $zanzibar->id;
            Faq::updateOrCreate(
                ['faq_category_id' => $faq['faq_category_id'], 'question' => $faq['question']],
                $faq
            );
        }

        // Responsible Travel
        $responsible = FaqCategory::where('slug', 'responsible')->first();
        Faq::updateOrCreate(
            ['faq_category_id' => $responsible->id, 'question' => 'How does safari tourism help conservation?'],
            ['faq_category_id' => $responsible->id, 'question' => 'How does safari tourism help conservation?', 'answer' => 'Well-managed wildlife tourism is the most powerful economic argument for protecting wild land. Tanzania\'s national park system is funded substantially by tourism revenues.', 'tags' => ['conservation'], 'sort_order' => 1]
        );

        // Working With Ronjoo
        $ronjoo = FaqCategory::where('slug', 'ronjoo')->first();
        $ronjooFaqs = [
            ['question' => 'How long has Ronjoo Safaris been operating?', 'answer' => 'Ronjoo Safaris has been operating from Arusha, Tanzania since 2010, over **18 years** of specialist Tanzania safari experience. Over 4,200 guests from 60+ countries, 4.9-star rating.', 'tags' => ['about'], 'sort_order' => 1],
            ['question' => 'Are your guides licensed?', 'answer' => 'All Ronjoo guides hold current Tanzania Wildlife Authority Professional Guiding Licences (Class A), the highest category. All complete Ronjoo\'s internal training program. Many have 15+ years of experience.', 'tags' => ['guides'], 'sort_order' => 2],
        ];

        foreach ($ronjooFaqs as $faq) {
            $faq['faq_category_id'] = $ronjoo->id;
            Faq::updateOrCreate(
                ['faq_category_id' => $faq['faq_category_id'], 'question' => $faq['question']],
                $faq
            );
        }
    }
}
