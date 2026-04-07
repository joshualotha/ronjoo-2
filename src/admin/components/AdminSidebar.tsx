import { Link, useLocation } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import {
  LayoutDashboard, Calendar, MessageSquare, Users, Clock,
  Compass, MapPin, BookOpen, Shield, HelpCircle, Image, Star,
  Mail, Tag, Search, Lock, Settings, LogOut, DollarSign, PawPrint, Building2
} from 'lucide-react';

const navGroups = [
  {
    label: 'OVERVIEW',
    items: [
      { title: 'Dashboard', path: '/kijani-desk', icon: LayoutDashboard },
    ],
  },
  {
    label: 'BOOKINGS & ENQUIRIES',
    items: [
      { title: 'All Bookings', path: '/kijani-desk/bookings', icon: Calendar },
      { title: 'Enquiries', path: '/kijani-desk/enquiries', icon: MessageSquare, badge: 3 },
      { title: 'Group Departures', path: '/kijani-desk/departures', icon: Users },
      { title: 'Waiting Lists', path: '/kijani-desk/waitlists', icon: Clock },
    ],
  },
  {
    label: 'CONTENT',
    items: [
      { title: 'Safaris', path: '/kijani-desk/safaris', icon: Compass },
      { title: 'Destinations', path: '/kijani-desk/destinations', icon: MapPin },
      { title: 'Wildlife', path: '/kijani-desk/wildlife', icon: PawPrint },
      { title: 'Accommodations', path: '/kijani-desk/accommodations', icon: Building2 },
      { title: 'Add-Ons', path: '/kijani-desk/add-ons', icon: Tag },
      { title: 'Blog & Guides', path: '/kijani-desk/blog', icon: BookOpen },
      { title: 'FAQs', path: '/kijani-desk/faqs', icon: HelpCircle },
      { title: 'Gallery', path: '/kijani-desk/gallery', icon: Image },
      { title: 'Reviews', path: '/kijani-desk/reviews', icon: Star },
    ],
  },
  {
    label: 'MARKETING',
    items: [
      { title: 'Newsletter', path: '/kijani-desk/newsletter', icon: Mail },
      { title: 'Promotions', path: '/kijani-desk/promotions', icon: Tag },
      { title: 'SEO Manager', path: '/kijani-desk/seo', icon: Search },
    ],
  },
  {
    label: 'SETTINGS',
    items: [
      { title: 'Team & Guides', path: '/kijani-desk/team', icon: Users },
      { title: 'Email Templates', path: '/kijani-desk/email-templates', icon: Mail },
      { title: 'Pricing & Currency', path: '/kijani-desk/pricing', icon: DollarSign },
      { title: 'Admin Users', path: '/kijani-desk/users', icon: Lock },
      { title: 'Site Settings', path: '/kijani-desk/settings', icon: Settings },
    ],
  },
];

export default function AdminSidebar() {
  const location = useLocation();
  const { user, logout } = useAdmin();

  const isActive = (path: string) => {
    if (path === '/kijani-desk') return location.pathname === '/kijani-desk';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-warm-charcoal flex flex-col z-50 overflow-y-auto">
      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
        <Link to="/kijani-desk" className="block">
          <h1 className="font-display italic text-[20px] text-warm-canvas">Ronjoo Safaris</h1>
          <p className="font-sub font-normal text-[10px] text-gold uppercase tracking-[0.25em] mt-0.5">Admin Panel</p>
        </Link>
      </div>
      <div className="mx-5 h-px bg-gold/20" />

      {/* Navigation */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {navGroups.map(group => (
          <div key={group.label}>
            <p className="font-sub font-normal text-[10px] text-gold uppercase tracking-[0.25em] mx-5 mt-6 mb-2">{group.label}</p>
            {group.items.map(item => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-5 py-2.5 mx-2 transition-colors relative ${
                    active
                      ? 'bg-terracotta/[0.12] text-warm-canvas'
                      : 'text-warm-canvas/90 hover:bg-warm-canvas/[0.06] hover:text-warm-canvas/90'
                  }`}
                >
                  {active && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-terracotta" />}
                  <item.icon size={16} className={active ? 'text-terracotta' : 'text-warm-canvas/80'} />
                  <span className="font-sub font-normal text-[13px] flex-1">{item.title}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="bg-terracotta text-warm-canvas font-sub font-normal text-[10px] px-1.5 py-0.5 min-w-[18px] text-center">{item.badge}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom user section */}
      <div className="mt-auto">
        <div className="mx-5 h-px bg-gold/20" />
        <div className="px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-terracotta/20 flex items-center justify-center font-sub text-[12px] text-warm-canvas">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sub font-normal text-[13px] text-warm-canvas truncate">{user?.name || 'Admin'}</p>
              <p className="font-sub font-normal text-[10px] text-gold uppercase tracking-[0.15em]">
                {user?.role === 'super-admin' ? 'Super Admin' : 'Content Editor'}
              </p>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 mt-3 font-sub font-normal text-[11px] text-warm-canvas/80 hover:text-warm-canvas/80 transition-colors">
            <LogOut size={12} />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
