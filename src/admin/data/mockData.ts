// Admin Mock Data
export interface Booking {
  id: string;
  ref: string;
  guestName: string;
  email: string;
  whatsapp: string;
  country: string;
  safariName: string;
  departureDate: string;
  returnDate: string;
  pax: number;
  children: number;
  totalAmount: number;
  depositPaid: number;
  balanceDue: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'deposit-paid' | 'fully-paid';
  paymentStatus: 'pending' | 'deposit-paid' | 'fully-paid';
  groupType: 'private' | 'group';
  createdAt: string;
  guide?: string;
  notes: string[];
  accommodationTier: string;
}

export interface Enquiry {
  id: string;
  guestName: string;
  email: string;
  whatsapp: string;
  country: string;
  countryFlag: string;
  safariInterest: string;
  preferredDates: string;
  travelers: number;
  budget: string;
  message: string;
  status: 'new' | 'in-progress' | 'awaiting-guest' | 'converted' | 'archived';
  isRead: boolean;
  receivedAt: string;
  source: string;
  replies: { from: 'guest' | 'admin'; message: string; timestamp: string }[];
  tags: string[];
}

export interface Departure {
  id: string;
  safariName: string;
  startDate: string;
  endDate: string;
  totalSeats: number;
  bookedSeats: number;
  status: 'open' | 'full' | 'closed' | 'cancelled' | 'completed';
  revenue: number;
  projectedRevenue: number;
  guide?: string;
  guests: { name: string; country: string; bookingRef: string; amountPaid: number; balance: number }[];
  waitlist: { name: string; email: string; whatsapp: string; dateAdded: string }[];
}

export interface Safari {
  id: string;
  name: string;
  slug: string;
  type: string;
  duration: number;
  priceFrom: number;
  status: 'published' | 'draft';
  bookings: number;
  featured: boolean;
  maxGroupSize: number;
  difficulty: string;
  bestSeason: string[];
  shortDescription: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  publishedDate: string;
  status: 'published' | 'draft' | 'scheduled';
  views: number;
  featuredImage?: string;
}

export interface Review {
  id: string;
  guestName: string;
  country: string;
  countryFlag: string;
  rating: number;
  safariName: string;
  safariDate: string;
  submittedDate: string;
  status: 'pending' | 'published' | 'hidden' | 'featured';
  excerpt: string;
  fullText: string;
  categoryRatings: { guide: number; wildlife: number; accommodation: number; value: number };
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  experience: number;
  languages: string[];
  specializations: string[];
  showOnWebsite: boolean;
}

export interface Subscriber {
  id: string;
  email: string;
  name: string;
  country: string;
  source: string;
  dateSubscribed: string;
  status: 'active' | 'unsubscribed';
}

export const mockBookings: Booking[] = [
  { id: '1', ref: 'RNJ-2026-001', guestName: 'John & Sarah Smith', email: 'john@example.com', whatsapp: '+44 7700 900000', country: 'United Kingdom', safariName: 'Great Migration Safari', departureDate: '2026-08-14', returnDate: '2026-08-22', pax: 2, children: 0, totalAmount: 6400, depositPaid: 1920, balanceDue: 4480, status: 'confirmed', paymentStatus: 'deposit-paid', groupType: 'private', createdAt: '2026-02-10', guide: 'Joseph Makacha', notes: ['Honeymoon couple, special dinner requested'], accommodationTier: 'Luxury' },
  { id: '2', ref: 'RNJ-2026-002', guestName: 'Emma Wilson', email: 'emma@example.com', whatsapp: '+1 555 0123', country: 'United States', safariName: 'Northern Circuit Classic', departureDate: '2026-07-05', returnDate: '2026-07-11', pax: 1, children: 0, totalAmount: 3200, depositPaid: 960, balanceDue: 2240, status: 'confirmed', paymentStatus: 'deposit-paid', groupType: 'group', createdAt: '2026-01-20', guide: 'Daniel Kimaro', notes: ['Solo traveler, photography enthusiast'], accommodationTier: 'Classic' },
  { id: '3', ref: 'RNJ-2026-003', guestName: 'Pierre & Marie Dupont', email: 'pierre@example.com', whatsapp: '+33 6 12 34 56 78', country: 'France', safariName: 'Kilimanjaro Lemosho Route', departureDate: '2026-09-01', returnDate: '2026-09-09', pax: 2, children: 0, totalAmount: 5800, depositPaid: 5800, balanceDue: 0, status: 'fully-paid', paymentStatus: 'fully-paid', groupType: 'group', createdAt: '2026-01-05', guide: 'Emmanuel Mollel', notes: ['Both experienced hikers'], accommodationTier: 'Standard' },
  { id: '4', ref: 'RNJ-2026-004', guestName: 'Müller Family', email: 'mueller@example.com', whatsapp: '+49 170 1234567', country: 'Germany', safariName: 'Family Safari Adventure', departureDate: '2026-12-20', returnDate: '2026-12-28', pax: 2, children: 2, totalAmount: 8900, depositPaid: 2670, balanceDue: 6230, status: 'confirmed', paymentStatus: 'deposit-paid', groupType: 'private', createdAt: '2026-03-01', notes: ['Children ages 8 and 12, need child seats'], accommodationTier: 'Luxury' },
  { id: '5', ref: 'RNJ-2026-005', guestName: 'Takeshi Yamamoto', email: 'takeshi@example.com', whatsapp: '+81 90 1234 5678', country: 'Japan', safariName: 'Photography Safari', departureDate: '2026-06-18', returnDate: '2026-06-25', pax: 1, children: 0, totalAmount: 4200, depositPaid: 0, balanceDue: 4200, status: 'pending', paymentStatus: 'pending', groupType: 'private', createdAt: '2026-03-05', notes: ['Professional photographer, needs extra vehicle space for equipment'], accommodationTier: 'Luxury' },
  { id: '6', ref: 'RNJ-2025-048', guestName: 'Oliver & Kate Brown', email: 'oliver@example.com', whatsapp: '+61 400 123 456', country: 'Australia', safariName: 'Serengeti & Zanzibar', departureDate: '2026-02-10', returnDate: '2026-02-20', pax: 2, children: 0, totalAmount: 7200, depositPaid: 7200, balanceDue: 0, status: 'completed', paymentStatus: 'fully-paid', groupType: 'private', createdAt: '2025-08-15', guide: 'Joseph Makacha', notes: [], accommodationTier: 'Luxury' },
  { id: '7', ref: 'RNJ-2026-006', guestName: 'Maria Santos', email: 'maria@example.com', whatsapp: '+55 11 91234 5678', country: 'Brazil', safariName: 'Great Migration Safari', departureDate: '2026-08-14', returnDate: '2026-08-22', pax: 1, children: 0, totalAmount: 3200, depositPaid: 960, balanceDue: 2240, status: 'confirmed', paymentStatus: 'deposit-paid', groupType: 'group', createdAt: '2026-02-28', notes: ['Speaks Portuguese and English'], accommodationTier: 'Classic' },
  { id: '8', ref: 'RNJ-2026-007', guestName: 'Hans & Greta Weber', email: 'hans@example.com', whatsapp: '+41 79 123 45 67', country: 'Switzerland', safariName: 'Northern Circuit Classic', departureDate: '2026-10-05', returnDate: '2026-10-12', pax: 2, children: 0, totalAmount: 6800, depositPaid: 0, balanceDue: 6800, status: 'pending', paymentStatus: 'pending', groupType: 'private', createdAt: '2026-03-08', notes: ['Want to add Zanzibar extension'], accommodationTier: 'Premium' },
];

export const mockEnquiries: Enquiry[] = [
  { id: '1', guestName: 'Alexandra Chen', email: 'alex.chen@example.com', whatsapp: '+1 415 555 0199', country: 'United States', countryFlag: '🇺🇸', safariInterest: 'Great Migration Safari', preferredDates: 'August 2026', travelers: 2, budget: '$5,000-7,000', message: 'Hi, my husband and I are planning our first trip to Africa and the Great Migration is our dream. We want to see the river crossings if possible. Can you help us plan the perfect itinerary?', status: 'new', isRead: false, receivedAt: '2026-03-09T08:30:00', source: 'Website Form', replies: [], tags: ['High Value'] },
  { id: '2', guestName: 'James Morrison', email: 'james.m@example.com', whatsapp: '+44 7911 123456', country: 'United Kingdom', countryFlag: '🇬🇧', safariInterest: 'Kilimanjaro Lemosho Route', preferredDates: 'September 2026', travelers: 4, budget: '$3,000-4,000 pp', message: 'Looking to climb Kili with 3 mates for my 40th birthday. We are all reasonably fit. Is September a good time? What is your success rate?', status: 'in-progress', isRead: true, receivedAt: '2026-03-08T14:15:00', source: 'WhatsApp', replies: [{ from: 'admin', message: 'Hi James! September is an excellent month for Kilimanjaro. Our 9-day Lemosho success rate is 87%. Let me put together a group quote for 4.', timestamp: '2026-03-08T16:00:00' }], tags: ['Group'] },
  { id: '3', guestName: 'Sophie Leclerc', email: 'sophie@example.com', whatsapp: '+33 6 98 76 54 32', country: 'France', countryFlag: '🇫🇷', safariInterest: 'Honeymoon Safari & Zanzibar', preferredDates: 'November 2026', travelers: 2, budget: '$8,000-12,000', message: 'Nous planifions notre lune de miel et adorerions combiner un safari avec la plage. Zanzibar semble parfait. Pouvez-vous créer un package romantique sur mesure?', status: 'new', isRead: false, receivedAt: '2026-03-09T06:45:00', source: 'Website Form', replies: [], tags: ['Honeymoon', 'High Value'] },
  { id: '4', guestName: 'David & Anne Thompson', email: 'thompson@example.com', whatsapp: '+61 412 345 678', country: 'Australia', countryFlag: '🇦🇺', safariInterest: 'Family Safari Adventure', preferredDates: 'December 2026 - January 2027', travelers: 4, budget: '$10,000-15,000', message: 'We have two children (ages 10 and 14) and want to give them an unforgettable Christmas holiday in Tanzania. Are your safaris suitable for kids? What accommodations do you recommend?', status: 'awaiting-guest', isRead: true, receivedAt: '2026-03-05T10:00:00', source: 'Website Form', replies: [{ from: 'admin', message: 'Absolutely! We specialize in family safaris. I have put together a custom itinerary with family-friendly lodges. Please review and let me know your thoughts.', timestamp: '2026-03-05T14:30:00' }, { from: 'guest', message: 'This looks wonderful! Can we add a day at Ngorongoro? Also, do any of the lodges have swimming pools?', timestamp: '2026-03-06T08:15:00' }, { from: 'admin', message: 'Yes! I have added an extra day at Ngorongoro and selected lodges with pools. Updated itinerary attached.', timestamp: '2026-03-06T11:00:00' }], tags: ['Family', 'High Value'] },
  { id: '5', guestName: 'Roberto Esposito', email: 'roberto@example.com', whatsapp: '+39 333 123 4567', country: 'Italy', countryFlag: '🇮🇹', safariInterest: 'Photography Safari', preferredDates: 'July 2026', travelers: 1, budget: '$4,000-5,000', message: 'I am a semi-professional wildlife photographer. Do you have specialized photography safaris with extra time at sightings and special vehicle setups?', status: 'in-progress', isRead: true, receivedAt: '2026-03-07T09:30:00', source: 'Instagram DM', replies: [{ from: 'admin', message: 'We do! Our Photography Safari includes a pop-top vehicle with beanbag mounts, and our guides understand photography timing.', timestamp: '2026-03-07T12:00:00' }], tags: ['Photography'] },
  { id: '6', guestName: 'Yuki Tanaka', email: 'yuki@example.com', whatsapp: '+81 80 1234 5678', country: 'Japan', countryFlag: '🇯🇵', safariInterest: 'Northern Circuit Classic', preferredDates: 'January 2027', travelers: 2, budget: '$6,000-8,000', message: 'We are interested in the calving season. Is January the right time? We would also like to visit a Maasai village. How long should we plan for?', status: 'new', isRead: false, receivedAt: '2026-03-09T02:15:00', source: 'Website Form', replies: [], tags: [] },
  { id: '7', guestName: 'Michael & Lisa Anderson', email: 'anderson@example.com', whatsapp: '+1 604 555 0123', country: 'Canada', countryFlag: '🇨🇦', safariInterest: 'Kilimanjaro + Safari Combo', preferredDates: 'October 2026', travelers: 2, budget: '$12,000-15,000', message: 'We want to do Kilimanjaro followed by a safari. What is the best combo package? We have about 2.5 weeks.', status: 'converted', isRead: true, receivedAt: '2026-02-20T15:00:00', source: 'Website Form', replies: [{ from: 'admin', message: 'The ultimate combo! 9 days Lemosho + 7 days Northern Circuit. I have created a custom package for you.', timestamp: '2026-02-20T18:00:00' }], tags: ['High Value', 'Converted'] },
  { id: '8', guestName: 'Anna Johansson', email: 'anna.j@example.com', whatsapp: '+46 70 123 45 67', country: 'Sweden', countryFlag: '🇸🇪', safariInterest: 'Southern Circuit Safari', preferredDates: 'June 2026', travelers: 1, budget: '$5,000-7,000', message: 'I have already done the Northern Circuit with another company. I want to explore Ruaha and Selous this time. Do you offer walking safaris?', status: 'in-progress', isRead: true, receivedAt: '2026-03-04T11:00:00', source: 'Email', replies: [{ from: 'admin', message: 'Wonderful choice! The Southern Circuit offers incredible walking safari experiences. Let me design a Ruaha + Nyerere itinerary with walking components.', timestamp: '2026-03-04T14:30:00' }], tags: ['Return Visitor'] },
];

export const mockDepartures: Departure[] = [
  { id: '1', safariName: 'Great Migration Safari', startDate: '2026-08-14', endDate: '2026-08-22', totalSeats: 8, bookedSeats: 5, status: 'open', revenue: 16000, projectedRevenue: 25600, guide: 'Joseph Makacha', guests: [{ name: 'John Smith', country: '🇬🇧', bookingRef: 'RNJ-2026-001', amountPaid: 1920, balance: 1280 }, { name: 'Emma Wilson', country: '🇺🇸', bookingRef: 'RNJ-2026-002', amountPaid: 960, balance: 2240 }, { name: 'Maria Santos', country: '🇧🇷', bookingRef: 'RNJ-2026-006', amountPaid: 960, balance: 2240 }], waitlist: [] },
  { id: '2', safariName: 'Northern Circuit Classic', startDate: '2026-07-05', endDate: '2026-07-11', totalSeats: 6, bookedSeats: 6, status: 'full', revenue: 19200, projectedRevenue: 19200, guide: 'Daniel Kimaro', guests: [], waitlist: [{ name: 'Tom Richards', email: 'tom@example.com', whatsapp: '+44 7700 900001', dateAdded: '2026-03-01' }] },
  { id: '3', safariName: 'Kilimanjaro Lemosho Route', startDate: '2026-09-01', endDate: '2026-09-09', totalSeats: 8, bookedSeats: 2, status: 'open', revenue: 5800, projectedRevenue: 23200, guide: 'Emmanuel Mollel', guests: [{ name: 'Pierre Dupont', country: '🇫🇷', bookingRef: 'RNJ-2026-003', amountPaid: 5800, balance: 0 }], waitlist: [] },
];

export const mockSafaris: Safari[] = [
  { id: '1', name: 'Great Migration Safari', slug: 'great-migration', type: 'Migration Safari', duration: 8, priceFrom: 3200, status: 'published', bookings: 23, featured: true, maxGroupSize: 8, difficulty: 'Easy', bestSeason: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct'], shortDescription: 'Witness the greatest wildlife spectacle on Earth, the Great Migration river crossings in the Serengeti.' },
  { id: '2', name: 'Northern Circuit Classic', slug: 'northern-circuit-classic', type: 'Wildlife Safari', duration: 7, priceFrom: 2800, status: 'published', bookings: 31, featured: true, maxGroupSize: 6, difficulty: 'Easy', bestSeason: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Jan', 'Feb'], shortDescription: 'The definitive Tanzania safari, Tarangire, Ngorongoro Crater, and the Serengeti in one iconic journey.' },
  { id: '3', name: 'Kilimanjaro Lemosho Route', slug: 'kilimanjaro-lemosho', type: 'Mountain Trek', duration: 9, priceFrom: 2900, status: 'published', bookings: 18, featured: true, maxGroupSize: 8, difficulty: 'Challenging', bestSeason: ['Jan', 'Feb', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'], shortDescription: 'The highest success rate route to the Roof of Africa, 9 days through 5 climate zones.' },
  { id: '4', name: 'Family Safari Adventure', slug: 'family-safari', type: 'Family Safari', duration: 7, priceFrom: 2600, status: 'published', bookings: 12, featured: false, maxGroupSize: 6, difficulty: 'Easy', bestSeason: ['Jun', 'Jul', 'Aug', 'Dec', 'Jan', 'Feb'], shortDescription: 'A safari designed for families, child-friendly lodges, shorter drives, and unforgettable wildlife encounters.' },
  { id: '5', name: 'Photography Safari', slug: 'photography-safari', type: 'Photography', duration: 10, priceFrom: 4200, status: 'published', bookings: 8, featured: false, maxGroupSize: 4, difficulty: 'Easy', bestSeason: ['Jun', 'Jul', 'Aug', 'Sep', 'Jan', 'Feb'], shortDescription: 'Specialist photography itinerary with expert guides, optimal positioning, and extended sighting time.' },
  { id: '6', name: 'Serengeti & Zanzibar', slug: 'serengeti-zanzibar', type: 'Beach Extension', duration: 10, priceFrom: 3600, status: 'published', bookings: 15, featured: true, maxGroupSize: 6, difficulty: 'Easy', bestSeason: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Dec', 'Jan', 'Feb'], shortDescription: 'The ultimate Tanzania experience, Serengeti wildlife followed by Zanzibar beaches.' },
  { id: '7', name: 'Southern Circuit Explorer', slug: 'southern-circuit', type: 'Wildlife Safari', duration: 8, priceFrom: 3800, status: 'draft', bookings: 3, featured: false, maxGroupSize: 4, difficulty: 'Moderate', bestSeason: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct'], shortDescription: 'Remote and exclusive, Ruaha and Nyerere for the ultimate wilderness experience.' },
];

export const mockBlogPosts: BlogPost[] = [
  { id: '1', title: 'The Complete Guide to the Great Migration', slug: 'great-migration-guide', category: 'Wildlife & Nature', author: 'Safari Team', publishedDate: '2026-02-15', status: 'published', views: 2340 },
  { id: '2', title: 'What to Pack for a Tanzania Safari', slug: 'safari-packing-guide', category: 'Safari Planning', author: 'Safari Team', publishedDate: '2026-01-20', status: 'published', views: 1870 },
  { id: '3', title: '5 Reasons to Choose the Lemosho Route', slug: 'lemosho-route-reasons', category: 'Kilimanjaro', author: 'Emmanuel Mollel', publishedDate: '2026-03-01', status: 'published', views: 960 },
  { id: '4', title: 'Stone Town: A Walking Guide', slug: 'stone-town-guide', category: 'Destination Guide', author: 'Safari Team', publishedDate: '', status: 'draft', views: 0 },
];

export const mockReviews: Review[] = [
  { id: '1', guestName: 'Sarah Mitchell', country: 'United States', countryFlag: '🇺🇸', rating: 5, safariName: 'Great Migration Safari', safariDate: '2025-08-15', submittedDate: '2025-08-28', status: 'featured', excerpt: 'Absolutely life-changing. Joseph was the most knowledgeable guide we have ever had.', fullText: 'Absolutely life-changing. Joseph was the most knowledgeable guide we have ever had. He spotted a leopard in a tree from 200 meters away. The camps were luxurious and the food was incredible. We saw the river crossing on day 3 and I still get chills thinking about it. Ronjoo handled every detail perfectly.', categoryRatings: { guide: 5, wildlife: 5, accommodation: 5, value: 5 } },
  { id: '2', guestName: 'Tom & Claire Evans', country: 'United Kingdom', countryFlag: '🇬🇧', rating: 5, safariName: 'Northern Circuit Classic', safariDate: '2025-10-05', submittedDate: '2025-10-18', status: 'published', excerpt: 'The Ngorongoro Crater was the highlight of our trip. Seeing a black rhino up close was extraordinary.', fullText: 'The Ngorongoro Crater was the highlight of our trip. Seeing a black rhino up close was extraordinary. Daniel our guide knew every animal by name. The lodges were far better than we expected. Worth every penny.', categoryRatings: { guide: 5, wildlife: 5, accommodation: 4, value: 5 } },
  { id: '3', guestName: 'Markus Bauer', country: 'Germany', countryFlag: '🇩🇪', rating: 4, safariName: 'Kilimanjaro Lemosho Route', safariDate: '2025-09-01', submittedDate: '2025-09-15', status: 'published', excerpt: 'Made it to the summit! The crew was incredible. Only wish we had one more acclimatization day.', fullText: 'Made it to the summit! The crew was incredible, from the guides to the porters to the cook. Summit night was the hardest thing I have ever done but the sunrise from Uhuru Peak made it all worth it. Only wish we had one more acclimatization day, but 87% success rate speaks for itself.', categoryRatings: { guide: 5, wildlife: 3, accommodation: 3, value: 4 } },
  { id: '4', guestName: 'Akiko Watanabe', country: 'Japan', countryFlag: '🇯🇵', rating: 5, safariName: 'Photography Safari', safariDate: '2025-07-10', submittedDate: '2025-07-25', status: 'pending', excerpt: 'As a photographer, this was the perfect safari. The guide understood lighting and positioning perfectly.', fullText: 'As a photographer, this was the perfect safari. The guide understood lighting and positioning perfectly. We spent 45 minutes with a cheetah family and he knew exactly when to reposition for the best backgrounds. The vehicle setup with beanbag mounts was excellent. I came home with portfolio-worthy images.', categoryRatings: { guide: 5, wildlife: 5, accommodation: 4, value: 5 } },
];

export const mockTeam: TeamMember[] = [
  { id: '1', name: 'Joseph Makacha', role: 'Senior Guide', experience: 18, languages: ['English', 'Swahili', 'German'], specializations: ['Serengeti', 'Ngorongoro', 'Photography'], showOnWebsite: true },
  { id: '2', name: 'Daniel Kimaro', role: 'Guide', experience: 12, languages: ['English', 'Swahili', 'French'], specializations: ['Serengeti', 'Tarangire', 'Birdwatching'], showOnWebsite: true },
  { id: '3', name: 'Emmanuel Mollel', role: 'Kilimanjaro Specialist', experience: 15, languages: ['English', 'Swahili'], specializations: ['Kilimanjaro', 'Lemosho', 'Machame'], showOnWebsite: true },
  { id: '4', name: 'Grace Njau', role: 'Operations Manager', experience: 10, languages: ['English', 'Swahili'], specializations: ['Operations', 'Logistics'], showOnWebsite: true },
  { id: '5', name: 'Peter Swai', role: 'Guide', experience: 8, languages: ['English', 'Swahili', 'Italian'], specializations: ['Southern Circuit', 'Walking Safaris'], showOnWebsite: true },
];

export const mockSubscribers: Subscriber[] = [
  { id: '1', email: 'john@example.com', name: 'John Smith', country: 'United Kingdom', source: 'Website', dateSubscribed: '2025-11-15', status: 'active' },
  { id: '2', email: 'sarah@example.com', name: 'Sarah Mitchell', country: 'United States', source: 'Booking', dateSubscribed: '2025-08-28', status: 'active' },
  { id: '3', email: 'marco@example.com', name: 'Marco Rossi', country: 'Italy', source: 'Website', dateSubscribed: '2026-01-10', status: 'active' },
  { id: '4', email: 'anna@example.com', name: 'Anna Johansson', country: 'Sweden', source: 'Website', dateSubscribed: '2026-02-20', status: 'active' },
  { id: '5', email: 'chen@example.com', name: 'Wei Chen', country: 'China', source: 'Import', dateSubscribed: '2025-06-01', status: 'unsubscribed' },
];

export const mockActivityFeed = [
  { id: '1', type: 'booking' as const, icon: '🟢', description: 'New booking received, Hans & Greta Weber, Northern Circuit Classic, Oct 2026, $6,800', timestamp: '5 min ago' },
  { id: '2', type: 'enquiry' as const, icon: '🔵', description: 'New enquiry from Alexandra Chen (US), Great Migration Safari, Aug 2026', timestamp: '30 min ago' },
  { id: '3', type: 'enquiry' as const, icon: '🔵', description: 'New enquiry from Sophie Leclerc (FR), Honeymoon Safari & Zanzibar', timestamp: '2 hours ago' },
  { id: '4', type: 'review' as const, icon: '⭐', description: 'New review submitted, Akiko Watanabe, Photography Safari, 5 stars', timestamp: '3 hours ago' },
  { id: '5', type: 'payment' as const, icon: '💰', description: 'Full payment received, Pierre & Marie Dupont, Kilimanjaro Lemosho, $2,900', timestamp: '5 hours ago' },
  { id: '6', type: 'newsletter' as const, icon: '📧', description: 'Newsletter subscriber: Anna Johansson (Sweden) via website', timestamp: '8 hours ago' },
  { id: '7', type: 'booking' as const, icon: '🟢', description: 'New booking received, Takeshi Yamamoto, Photography Safari, Jun 2026, $4,200', timestamp: '1 day ago' },
  { id: '8', type: 'edit' as const, icon: '✏️', description: 'Safari updated: "Great Migration Safari", pricing updated by Admin', timestamp: '1 day ago' },
  { id: '9', type: 'departure' as const, icon: '🚐', description: 'Departure "Northern Circuit Classic, Jul 5" is now FULL (6/6 seats)', timestamp: '2 days ago' },
  { id: '10', type: 'booking' as const, icon: '🟢', description: 'Booking confirmed, Maria Santos, Great Migration Safari, Aug 2026', timestamp: '2 days ago' },
];
