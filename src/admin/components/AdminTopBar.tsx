import { useEffect, useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Search, Bell, ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { notificationsApi } from '../../services/adminApi';

interface AdminTopBarProps {
  title: string;
}

export default function AdminTopBar({ title }: AdminTopBarProps) {
  const { user, notificationCount, logout, setNotificationCount } = useAdmin();
  const [searchFocused, setSearchFocused] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const fetchNotifications = async () => {
    const res = await notificationsApi.list();
    setNotifications(Array.isArray(res.notifications) ? res.notifications : []);
    setNotificationCount(Number(res.unreadCount || 0));
  };

  useEffect(() => {
    fetchNotifications().catch(() => undefined);
    const timer = setInterval(() => {
      fetchNotifications().catch(() => undefined);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const handleMarkAllRead = async () => {
    await notificationsApi.readAll();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setNotificationCount(0);
  };

  const handleMarkRead = async (id: number | string) => {
    setNotifications((prev) =>
      prev.map((n) => (String(n.id) === String(id) ? { ...n, isRead: true } : n))
    );
    setNotificationCount(Math.max(0, notificationCount - 1));
    await notificationsApi.read(id);
  };

  return (
    <header className="h-16 bg-[#FFFFFF] border-b border-[#E8E0D5] flex items-center justify-between px-8 sticky top-0 z-40">
      <h1 className="font-display italic text-[24px] text-warm-charcoal">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className={`relative transition-all duration-200 ${searchFocused ? 'w-[400px]' : 'w-[280px]'}`}>
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-charcoal" />
          <input
            type="text"
            placeholder="Search bookings, guests, safaris..."
            className="w-full h-9 pl-9 pr-4 font-sub font-normal text-[13px] text-warm-charcoal bg-transparent border border-[#E8E0D5] outline-none focus:border-terracotta transition-colors placeholder:text-[#B5A998]"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
            className="relative p-2 text-warm-charcoal hover:text-warm-charcoal transition-colors"
          >
            <Bell size={18} />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-terracotta rounded-full" />
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-[360px] bg-[#FFFFFF] border border-[#E8E0D5] shadow-lg z-50">
              <div className="p-4 border-b border-[#E8E0D5] flex items-center justify-between">
                <span className="font-sub font-normal text-[14px] text-warm-charcoal">Notifications</span>
                <button onClick={handleMarkAllRead} className="font-sub font-normal text-[11px] text-terracotta">Mark all read</button>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} onClick={() => { if (!n.isRead) handleMarkRead(n.id).catch(() => undefined); }} className={`px-4 py-3 hover:bg-[#FBF8F3] border-b border-[#E8E0D5]/50 cursor-pointer ${!n.isRead ? 'bg-[#FBF8F3]' : ''}`}>
                    <p className="font-sub font-normal text-[13px] text-warm-charcoal">{n.message}</p>
                    <p className="font-sub font-normal text-[11px] text-warm-charcoal mt-1">
                      {new Date(n.createdAt).toLocaleString('en-GB')}
                    </p>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div className="px-4 py-3 font-sub font-normal text-[13px] text-warm-charcoal">No notifications yet.</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
            className="flex items-center gap-2 text-warm-charcoal hover:text-warm-charcoal transition-colors"
          >
            <div className="w-8 h-8 bg-terracotta/10 flex items-center justify-center font-sub text-[12px] text-terracotta">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <ChevronDown size={14} />
          </button>
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-[180px] bg-[#FFFFFF] border border-[#E8E0D5] shadow-lg z-50">
              <Link to="/kijani-desk/profile" className="w-full px-4 py-2.5 flex items-center gap-2 font-sub font-normal text-[13px] text-warm-charcoal hover:bg-[#FBF8F3] transition-colors">
                <User size={14} /> Profile
              </Link>
              <Link to="/kijani-desk/settings" className="w-full px-4 py-2.5 flex items-center gap-2 font-sub font-normal text-[13px] text-warm-charcoal hover:bg-[#FBF8F3] transition-colors">
                <Settings size={14} /> Settings
              </Link>
              <div className="h-px bg-[#E8E0D5]" />
              <button onClick={logout} className="w-full px-4 py-2.5 flex items-center gap-2 font-sub font-normal text-[13px] text-terracotta hover:bg-[#FBF8F3] transition-colors">
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
