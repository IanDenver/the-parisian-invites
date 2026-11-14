import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dark, setDark] = useState(() => localStorage.getItem('adminTheme') === 'dark');
    const navigate = useNavigate();

    // Persist preference
    useEffect(() => {
        localStorage.setItem('adminTheme', dark ? 'dark' : 'light');
    }, [dark]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            console.log("Login successful:", data.user.email);
            navigate('/admin/dashboard');
        }
    };

    // ── Theme tokens ──────────────────────────────────────────
    const t = {
        page: dark ? '#0f0f0f' : '#ffffff',
        panelLeft: dark
            ? 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,100,130,0.2) 0%, transparent 50%), linear-gradient(135deg, #2a1218 0%, #3d1a24 60%, #5c1f32 100%)'
            : 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.18) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,182,193,0.4) 0%, transparent 50%), linear-gradient(135deg, #FFB6C1 0%, #ff8fa3 60%, #e05c7a 100%)',
        card: dark ? '#1a1a1a' : '#ffffff',
        heading: dark ? '#f5e0e4' : '#1f2937',
        subtext: dark ? '#9ca3af' : '#9ca3af',
        label: dark ? '#d1aab0' : '#6b7280',
        inputBg: dark ? '#262626' : '#f9fafb',
        inputBorder: dark ? '#3f2a2e' : '#e5e7eb',
        inputText: dark ? '#f3e8ea' : '#1f2937',
        inputPlaceholder: dark ? '#6b7280' : '#9ca3af',
        footerText: dark ? '#4b5563' : '#d1d5db',
        mobileTitle: dark ? '#f5e0e4' : '#1f2937',
        toggleBg: dark ? '#262626' : '#f3f4f6',
        toggleIcon: dark ? '#FFB6C1' : '#6b7280',
        errorBg: dark ? '#2d1515' : '#fef2f2',
        errorBorder: dark ? '#5c2222' : '#fecaca',
        errorText: dark ? '#f87171' : '#ef4444',
    };

    return (
        <div className="min-h-screen flex transition-colors duration-300" style={{ background: t.page }}>

            {/* ── Left Panel — Branding ── */}
            <div
                className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden transition-all duration-500"
                style={{ background: t.panelLeft }}
            >
                {/* Decorative blobs */}
                <div className="absolute top-[-60px] left-[-60px] w-64 h-64 rounded-full opacity-20"
                    style={{ background: 'rgba(255,255,255,0.4)' }} />
                <div className="absolute bottom-[-80px] right-[-40px] w-80 h-80 rounded-full opacity-10"
                    style={{ background: 'rgba(255,255,255,0.5)' }} />

                {/* Floating card ornament */}
                <div className="admin-float mb-10 relative z-10">
                    <div className="w-28 h-28 rounded-3xl backdrop-blur-sm flex items-center justify-center shadow-2xl border"
                        style={{ background: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.2)' }}>
                        <span className="text-white text-5xl select-none">✦</span>
                    </div>
                </div>

                <div className="relative z-10 text-center">
                    <h1 className="text-4xl font-serif font-bold text-white leading-tight tracking-wide drop-shadow">
                        The Parisian<br />Invites
                    </h1>
                    <p className="mt-4 text-sm tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.7)' }}>
                        Elegance in Every Detail
                    </p>
                    <div className="flex items-center gap-3 justify-center mt-6">
                        <span className="w-10 h-px" style={{ background: 'rgba(255,255,255,0.3)' }} />
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>✦</span>
                        <span className="w-10 h-px" style={{ background: 'rgba(255,255,255,0.3)' }} />
                    </div>
                </div>

                <div className="absolute bottom-6 text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    © {new Date().getFullYear()} The Parisian Invites
                </div>
            </div>

            {/* ── Right Panel — Form ── */}
            <div
                className="w-full lg:w-1/2 flex flex-col items-center justify-center px-8 py-12 relative transition-colors duration-300"
                style={{ background: t.card }}
            >
                {/* Dark mode toggle */}
                <button
                    onClick={() => setDark(!dark)}
                    aria-label="Toggle dark mode"
                    className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                    style={{ background: t.toggleBg, color: t.toggleIcon }}
                >
                    {dark ? (
                        /* Sun icon */
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
                            <path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                        </svg>
                    ) : (
                        /* Moon icon */
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                        </svg>
                    )}
                </button>

                {/* Mobile logo */}
                <div className="lg:hidden text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3"
                        style={{ background: 'linear-gradient(135deg, #FFB6C1, #ff8fa3)' }}>
                        <span className="text-white text-2xl">✦</span>
                    </div>
                    <h1 className="text-2xl font-serif font-bold" style={{ color: t.mobileTitle }}>The Parisian Invites</h1>
                </div>

                <div className="w-full max-w-sm admin-fade-in">

                    {/* Heading */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-serif font-semibold" style={{ color: t.heading }}>Welcome back</h2>
                        <p className="text-sm mt-1" style={{ color: t.subtext }}>Sign in to your admin portal</p>
                    </div>

                    {error && (
                        <div
                            className="mb-5 p-3 text-sm rounded-xl border flex items-start gap-2"
                            style={{ background: t.errorBg, borderColor: t.errorBorder, color: t.errorText }}
                        >
                            <span className="mt-0.5">⚠</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5 admin-fade-in-delay">

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: t.label }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="admin-input w-full px-4 py-3 border rounded-xl text-sm transition-all"
                                style={{
                                    background: t.inputBg,
                                    borderColor: t.inputBorder,
                                    color: t.inputText,
                                }}
                                placeholder="yourname@email.com"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: t.label }}>
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="admin-input w-full px-4 py-3 border rounded-xl text-sm transition-all"
                                style={{
                                    background: t.inputBg,
                                    borderColor: t.inputBorder,
                                    color: t.inputText,
                                }}
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="admin-btn w-full text-white py-3 px-4 rounded-xl font-semibold text-sm tracking-wide mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Signing In…
                                </span>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-center text-xs mt-10" style={{ color: t.footerText }}>
                        Restricted to authorized personnel only.
                    </p>
                </div>
            </div>
        </div>
    );
}