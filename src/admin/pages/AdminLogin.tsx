import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const { login } = useAdmin();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      navigate('/kijani-desk');
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-warm-charcoal relative items-center justify-center overflow-hidden">
        {/* Faded wildlife SVG */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.05]" viewBox="0 0 800 800" fill="none">
          <path d="M400 100c-50 0-120 80-150 200s-20 250 50 300 180 60 250 0 100-180 80-300S450 100 400 100z" stroke="hsl(var(--warm-canvas))" strokeWidth="2" />
          <circle cx="300" cy="400" r="150" stroke="hsl(var(--warm-canvas))" strokeWidth="1" />
          <circle cx="500" cy="350" r="120" stroke="hsl(var(--warm-canvas))" strokeWidth="1" />
          <path d="M200 600c80-40 160 20 240-10s160-80 200-30" stroke="hsl(var(--warm-canvas))" strokeWidth="1.5" />
        </svg>
        <div className="relative z-10 text-center">
          <h1 className="font-display italic text-[48px] text-warm-canvas tracking-wide">Ronjoo Safaris</h1>
          <p className="font-sub font-normal text-[13px] text-gold uppercase tracking-[0.3em] mt-3">Safari Management Platform</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8" style={{ backgroundColor: '#F5EFE0' }}>
        <div className="w-full max-w-[400px]">
          <h2 className="font-display italic text-[36px] text-warm-charcoal mb-2">Welcome Back</h2>
          <p className="font-sub font-normal text-[14px] text-warm-charcoal mb-8">Sign in to your admin account.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@ronjoo.com"
                className={`w-full h-[48px] px-4 font-sub font-normal text-[14px] text-warm-charcoal bg-transparent border ${error ? 'border-terracotta' : 'border-[#E8E0D5]'} outline-none focus:border-terracotta transition-colors placeholder:text-[#B5A998]`}
                required
              />
            </div>
            <div>
              <label className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full h-[48px] px-4 pr-12 font-sub font-normal text-[14px] text-warm-charcoal bg-transparent border ${error ? 'border-terracotta' : 'border-[#E8E0D5]'} outline-none focus:border-terracotta transition-colors placeholder:text-[#B5A998]`}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-charcoal hover:text-warm-charcoal transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p className="font-sub font-normal text-[13px] text-terracotta">{error}</p>}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className={`w-4 h-4 border ${remember ? 'bg-terracotta border-terracotta' : 'border-[#E8E0D5]'} flex items-center justify-center transition-colors`} onClick={() => setRemember(!remember)}>
                  {remember && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#F5EFE0" strokeWidth="1.5" /></svg>}
                </div>
                <span className="font-sub font-normal text-[13px] text-warm-charcoal">Remember me</span>
              </label>
              <button type="button" className="font-sub font-normal text-[13px] text-terracotta hover:underline">Forgot password?</button>
            </div>

            <button type="submit" disabled={loading} className="w-full h-[48px] bg-terracotta text-warm-canvas font-sub font-normal text-[14px] uppercase tracking-[0.15em] hover:opacity-90 transition-opacity disabled: flex items-center justify-center gap-2">
              {loading && <Loader2 size={16} className="animate-spin" />}
              Sign In
            </button>
          </form>

          <p className="mt-8 font-sub font-normal text-[11px] text-warm-charcoal text-center">
            Demo: admin@ronjoo.com / admin1234
          </p>
        </div>
      </div>
    </div>
  );
}
