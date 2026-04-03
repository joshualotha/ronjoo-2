import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowRight, Plus, Compass, BookOpen, Mail, Calendar } from 'lucide-react';
import AdminTopBar from '../components/AdminTopBar';
import { getDashboard, bookingsApi, enquiriesApi, departuresApi, safarisApi } from '../../services/adminApi';
import { useAdmin } from '../context/AdminContext';

const statusColors: Record<string, string> = {
  confirmed: 'bg-sage text-warm-canvas',
  pending: 'bg-gold text-warm-canvas',
  cancelled: 'bg-terracotta text-warm-canvas',
  completed: 'bg-warm-charcoal text-warm-canvas',
  'deposit-paid': 'bg-warm-charcoal text-warm-canvas',
  'fully-paid': 'bg-sage text-warm-canvas',
};

const statusLabels: Record<string, string> = {
  confirmed: 'Confirmed',
  pending: 'Pending',
  cancelled: 'Cancelled',
  completed: 'Completed',
  'deposit-paid': 'Deposit Paid',
  'fully-paid': 'Fully Paid',
};

export default function AdminDashboard() {
  const { token } = useAdmin();
  const enabled = !!token;

  const { data: dashboard } = useQuery({ queryKey: ['dashboard'], queryFn: getDashboard, enabled });
  const { data: allBookings } = useQuery({ queryKey: ['bookings'], queryFn: () => bookingsApi.list(), enabled });
  const { data: allDepartures } = useQuery({ queryKey: ['departures'], queryFn: () => departuresApi.list(), enabled });
  const { data: allEnquiries } = useQuery({ queryKey: ['enquiries'], queryFn: () => enquiriesApi.list(), enabled });
  const { data: allSafaris } = useQuery({ queryKey: ['safaris'], queryFn: () => safarisApi.list(), enabled });

  const stats = dashboard?.stats;
  // Get paginated data or raw array
  let bookings = Array.isArray(allBookings) ? allBookings : ((allBookings as any)?.data ?? []);
  if (!Array.isArray(bookings)) bookings = [];
  let departures = Array.isArray(allDepartures) ? allDepartures : ((allDepartures as any)?.data ?? []);
  if (!Array.isArray(departures)) departures = [];
  let enquiries = Array.isArray(allEnquiries) ? allEnquiries : ((allEnquiries as any)?.data ?? []);
  if (!Array.isArray(enquiries)) enquiries = [];
  let safaris = Array.isArray(allSafaris) ? allSafaris : ((allSafaris as any)?.data ?? []);
  if (!Array.isArray(safaris)) safaris = [];

  const recentBookings = bookings.slice(0, 8);
  const upcomingDepartures = departures.filter((d: any) => d.status !== 'completed');
  const newEnquiries = enquiries.filter((e: any) => !e.isRead || e.status === 'new').slice(0, 4);
  const topSafaris = [...safaris].sort((a: any, b: any) => (b.bookingsCount || 0) - (a.bookingsCount || 0)).slice(0, 5);

  const revenueData = [32, 28, 45, 38, 52, 41, 48, 55, 42, 38, 44, 48];
  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const maxRevenue = Math.max(...revenueData);

  const kpiCards = [
    { label: 'Total Revenue This Month', value: stats ? `$${(stats.totalRevenue || 0).toLocaleString()}` : '—', trend: '+12%', up: true, sparkline: true },
    { label: 'New Bookings This Month', value: stats?.totalBookings?.toString() || '—', trend: '+8%', up: true },
    { label: 'Pending Enquiries', value: stats?.unreadEnquiries?.toString() || '—', trend: '', up: false, highlight: true, cta: 'View All →', ctaLink: '/kijani-desk/enquiries' },
    { label: 'Safari Seats Available', value: upcomingDepartures.reduce((sum: number, d: any) => sum + (d.totalSeats || 0) - (d.bookedSeats || 0), 0).toString(), trend: '', up: false },
    { label: 'Newsletter Subscribers', value: stats?.totalSubscribers?.toString() || '—', trend: '+12 this week', up: true },
  ];

  return (
    <div>
      <AdminTopBar title="Dashboard" />
      <div className="p-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {kpiCards.map((kpi, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#FFFFFF] border border-[#E8E0D5] p-6"
            >
              <p className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.1em] mb-2">{kpi.label}</p>
              <p className={`font-display italic text-[42px] leading-none ${kpi.highlight ? 'text-terracotta' : 'text-warm-charcoal'}`}>{kpi.value}</p>
              {kpi.trend && (
                <div className="flex items-center gap-1 mt-2">
                  {kpi.up ? <TrendingUp size={12} className="text-sage" /> : <TrendingDown size={12} className="text-terracotta" />}
                  <span className={`font-sub font-normal text-[11px] ${kpi.up ? 'text-sage' : 'text-terracotta'}`}>{kpi.trend}</span>
                </div>
              )}
              {kpi.cta && (
                <Link to={kpi.ctaLink!} className="font-sub font-normal text-[11px] text-terracotta mt-2 inline-block hover:underline">{kpi.cta}</Link>
              )}
              {kpi.sparkline && (
                <svg className="mt-3 w-full h-6" viewBox="0 0 100 24">
                  <polyline fill="none" stroke="hsl(var(--terracotta))" strokeWidth="1.5" points={revenueData.map((v, j) => `${(j / 11) * 100},${24 - (v / maxRevenue) * 22}`).join(' ')} />
                </svg>
              )}
            </motion.div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-[1fr_400px] gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Recent Bookings */}
            <div className="bg-[#FFFFFF] border border-[#E8E0D5]">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E0D5]">
                <h2 className="font-sub font-normal text-[16px] text-warm-charcoal">Recent Bookings</h2>
                <Link to="/kijani-desk/bookings" className="font-sub font-normal text-[12px] text-terracotta hover:underline flex items-center gap-1">View All <ArrowRight size={12} /></Link>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E8E0D5]">
                    {['Guest Name', 'Safari', 'Departure', 'Pax', 'Amount', 'Status'].map(h => (
                      <th key={h} className="text-left px-6 py-3 font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.1em]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b: any) => (
                    <tr key={b.id} className="border-b border-[#E8E0D5]/50 hover:bg-[#FBF8F3] cursor-pointer transition-colors">
                      <td className="px-6 py-3 font-sub font-normal text-[14px] text-warm-charcoal">{b.guestName}</td>
                      <td className="px-6 py-3 font-sub font-normal text-[13px] text-warm-charcoal">{b.safariName}</td>
                      <td className="px-6 py-3 font-sub font-normal text-[13px] text-warm-charcoal">{b.departureDate ? new Date(b.departureDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                      <td className="px-6 py-3 font-sub font-normal text-[13px] text-warm-charcoal">{(b.pax || 0) + (b.children || 0)}</td>
                      <td className="px-6 py-3 font-sub font-normal text-[13px] text-warm-charcoal">${(b.totalAmount || 0).toLocaleString()}</td>
                      <td className="px-6 py-3">
                        <span className={`inline-block px-2 py-0.5 font-sub font-normal text-[10px] uppercase tracking-[0.1em] ${statusColors[b.status] || 'bg-muted text-warm-charcoal'}`}>
                          {statusLabels[b.status] || b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Revenue Chart */}
            <div className="bg-[#FFFFFF] border border-[#E8E0D5] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-sub font-normal text-[16px] text-warm-charcoal">Revenue Overview</h2>
                <div className="flex gap-2">
                  {['Monthly', 'Weekly', 'Yearly'].map((t, i) => (
                    <button key={t} className={`px-3 py-1 font-sub font-normal text-[11px] uppercase tracking-[0.1em] border transition-colors ${i === 0 ? 'bg-warm-charcoal text-warm-canvas border-warm-charcoal' : 'border-[#E8E0D5] text-warm-charcoal hover:border-terracotta'}`}>{t}</button>
                  ))}
                </div>
              </div>
              <div className="flex items-end gap-3 h-[200px]">
                {revenueData.map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-terracotta/80 hover:bg-terracotta transition-colors cursor-pointer relative group" style={{ height: `${(val / maxRevenue) * 180}px` }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-warm-charcoal text-warm-canvas px-2 py-1 font-sub text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        ${val}k · {Math.round(val / 3.2)} bookings
                      </div>
                    </div>
                    <span className="font-sub font-normal text-[10px] text-warm-charcoal">{months[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Upcoming Departures */}
            <div className="bg-[#FFFFFF] border border-[#E8E0D5]">
              <div className="px-6 py-4 border-b border-[#E8E0D5]">
                <h2 className="font-sub font-normal text-[16px] text-warm-charcoal">Departures in Next 30 Days</h2>
              </div>
              <div className="divide-y divide-[#E8E0D5]/50">
                {upcomingDepartures.map((dep: any) => (
                  <div key={dep.id} className="px-6 py-4">
                    <p className="font-sub font-normal text-[14px] text-warm-charcoal">{dep.safariName}</p>
                    <p className="font-sub font-normal text-[13px] text-warm-charcoal mt-0.5">{dep.startDate ? new Date(dep.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : ''}, {dep.endDate ? new Date(dep.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-faded-sand">
                        <div className="h-full bg-terracotta transition-all" style={{ width: `${((dep.bookedSeats || 0) / (dep.totalSeats || 1)) * 100}%` }} />
                      </div>
                      <span className="font-sub font-normal text-[11px] text-warm-charcoal">{dep.bookedSeats || 0}/{dep.totalSeats || 0} seats</span>
                      <span className={`px-2 py-0.5 font-sub font-normal text-[10px] uppercase tracking-[0.1em] ${dep.status === 'full' ? 'bg-terracotta text-warm-canvas' : dep.status === 'open' ? 'bg-sage text-warm-canvas' : 'bg-muted text-warm-charcoal'}`}>{dep.status}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-3 border-t border-[#E8E0D5]">
                <Link to="/kijani-desk/departures" className="font-sub font-normal text-[12px] text-terracotta hover:underline">Manage Departures →</Link>
              </div>
            </div>

            {/* New Enquiries */}
            <div className="bg-[#FFFFFF] border border-[#E8E0D5]">
              <div className="px-6 py-4 border-b border-[#E8E0D5]">
                <h2 className="font-sub font-normal text-[16px] text-warm-charcoal">New Enquiries</h2>
              </div>
              <div className="divide-y divide-[#E8E0D5]/50">
                {newEnquiries.map((enq: any) => (
                  <div key={enq.id} className="px-6 py-3 hover:bg-[#FBF8F3] cursor-pointer transition-colors">
                    <div className="flex items-center gap-2">
                      <span>{enq.countryFlag}</span>
                      <span className="font-sub font-normal text-[13px] text-warm-charcoal">{enq.guestName}</span>
                      {!enq.isRead && <span className="w-2 h-2 bg-gold rounded-full" />}
                    </div>
                    <p className="font-sub font-normal text-[12px] text-terracotta mt-0.5">{enq.safariInterest}</p>
                    <p className="font-sub font-normal text-[11px] text-warm-charcoal mt-0.5">{enq.receivedAt ? new Date(enq.receivedAt).toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit' }) : ''} · {enq.source}</p>
                  </div>
                ))}
              </div>
              <div className="px-6 py-3 border-t border-[#E8E0D5]">
                <Link to="/kijani-desk/enquiries" className="font-sub font-normal text-[12px] text-terracotta hover:underline">View All Enquiries →</Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#FFFFFF] border border-[#E8E0D5] p-6">
              <h2 className="font-sub font-normal text-[16px] text-warm-charcoal mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: '+ New Booking', icon: Calendar, primary: true, link: '/kijani-desk/bookings' },
                  { label: '+ New Safari', icon: Compass, primary: false, link: '/kijani-desk/safaris' },
                  { label: '+ Blog Post', icon: BookOpen, primary: false, link: '/kijani-desk/blog' },
                  { label: 'Send Newsletter', icon: Mail, primary: false, link: '/kijani-desk/newsletter' },
                ].map((action, i) => (
                  <Link
                    key={i}
                    to={action.link}
                    className={`flex items-center gap-2 px-4 py-3 border font-sub font-normal text-[12px] transition-colors ${
                      action.primary
                        ? 'bg-terracotta border-terracotta text-warm-canvas hover:opacity-90'
                        : 'border-warm-charcoal text-warm-charcoal hover:bg-warm-charcoal hover:text-warm-canvas'
                    }`}
                  >
                    <action.icon size={14} />
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Top Safaris */}
            <div className="bg-[#FFFFFF] border border-[#E8E0D5] p-6">
              <h2 className="font-sub font-normal text-[16px] text-warm-charcoal mb-4">Best Performing Safaris</h2>
              <div className="space-y-3">
                {topSafaris.map((safari: any, i: number) => (
                  <div key={safari.id} className="flex items-center gap-3">
                    <span className="font-display italic text-[18px] text-gold w-6">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-sub font-normal text-[13px] text-warm-charcoal truncate">{safari.name}</p>
                      <p className="font-sub font-normal text-[11px] text-warm-charcoal">{safari.bookingsCount || 0} bookings · ${((safari.bookingsCount || 0) * (safari.priceFrom || safari.price || 0)).toLocaleString()}</p>
                    </div>
                    <div className="w-16 h-1.5 bg-faded-sand">
                      <div className="h-full bg-terracotta" style={{ width: `${topSafaris[0] ? ((safari.bookingsCount || 0) / ((topSafaris[0] as any).bookingsCount || 1)) * 100 : 0}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed, hardcoded placeholder until a real activity log is implemented */}
        <div className="bg-[#FFFFFF] border border-[#E8E0D5] mt-6">
          <div className="px-6 py-4 border-b border-[#E8E0D5]">
            <h2 className="font-sub font-normal text-[16px] text-warm-charcoal">Recent Activity</h2>
          </div>
          <div className="px-6 py-8 text-center">
            <p className="font-sub font-normal text-[13px] text-warm-charcoal">Activity feed will show recent changes across the system.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
