import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [invitations, setInvitations] = useState([]);
    const [loadingInvites, setLoadingInvites] = useState(true);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        async function fetchInvitations() {
            const { data, error } = await supabase
                .from('invitations')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(6);
            if (!error && data) {
                setInvitations(data);
            }
            setLoadingInvites(false);
        }
        fetchInvitations();
    }, []);

    const services = [
        {
            icon: '✦',
            title: 'Wedding Invitations',
            desc: 'Timeless designs crafted for the most important day of your life. From classic elegance to modern romance.',
        },
        {
            icon: '◈',
            title: 'Event Stationery',
            desc: 'Birthdays, galas, soirées — every occasion deserves a first impression that sets the tone.',
        },
        {
            icon: '⊞',
            title: 'Bespoke Collections',
            desc: 'Fully custom suites designed around your vision, palette, and story. No two pieces alike.',
        },
    ];

    const testimonials = [
        {
            quote: 'The invitations were absolutely stunning. Every single guest commented on them before the wedding even began.',
            author: 'Isabelle M.',
            role: 'Bride, Paris 2024',
        },
        {
            quote: 'Working with The Parisian Invites felt like a true collaboration. They brought my vision to life perfectly.',
            author: 'Claire D.',
            role: 'Event Host, Lyon',
        },
        {
            quote: 'Exquisite quality, impeccable taste. I will never use another stationer.',
            author: 'Margaux L.',
            role: 'Bride, Provence 2025',
        },
    ];

    return (
        <div className="min-h-screen font-sans" style={{ background: '#fffaf9', color: '#1f2937' }}>

            {/* ── Navbar ── */}
            <header
                className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
                style={{
                    background: scrolled ? 'rgba(255,250,249,0.92)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(12px)' : 'none',
                    borderBottom: scrolled ? '1px solid #fce7ea' : '1px solid transparent',
                }}
            >
                <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
                    {/* Logo */}
                    <a href="#" className="flex items-center gap-2 group">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                            style={{ background: 'linear-gradient(135deg, #FFB6C1, #ff8fa3)' }}
                        >
                            <span className="text-white text-sm select-none">✦</span>
                        </div>
                        <span className="font-serif font-bold text-base tracking-wide" style={{ color: '#1f2937' }}>
                            The Parisian Invites
                        </span>
                    </a>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-7 text-sm font-medium" style={{ color: '#6b7280' }}>
                        <a href="#services" className="hover:text-pink-400 transition-colors">Services</a>
                        <a href="#portfolio" className="hover:text-pink-400 transition-colors">Portfolio</a>
                        <a href="#testimonials" className="hover:text-pink-400 transition-colors">Testimonials</a>
                        <a href="#contact" className="hover:text-pink-400 transition-colors">Contact</a>
                    </nav>

                    {/* CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        <a
                            href="https://www.facebook.com/parisianinvitations"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-semibold px-5 py-2.5 rounded-xl text-white transition-all hover:shadow-lg hover:-translate-y-0.5"
                            style={{ background: 'linear-gradient(135deg, #FFB6C1, #ff8fa3)' }}
                        >
                            Get in Touch
                        </a>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden p-2 rounded-lg"
                        style={{ color: '#6b7280' }}
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            {menuOpen
                                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            }
                        </svg>
                    </button>
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="md:hidden px-6 pb-5 pt-2 space-y-3 text-sm font-medium border-t"
                        style={{ background: 'rgba(255,250,249,0.98)', borderColor: '#fce7ea', color: '#6b7280' }}>
                        {['#services', '#portfolio', '#testimonials', '#contact'].map((href) => (
                            <a
                                key={href}
                                href={href}
                                onClick={() => setMenuOpen(false)}
                                className="block py-1.5 capitalize hover:text-pink-400 transition-colors"
                            >
                                {href.replace('#', '')}
                            </a>
                        ))}
                        <a
                            href="#contact"
                            className="inline-block mt-2 text-sm font-semibold px-5 py-2.5 rounded-xl text-white"
                            style={{ background: 'linear-gradient(135deg, #FFB6C1, #ff8fa3)' }}
                            onClick={() => setMenuOpen(false)}
                        >
                            Get in Touch
                        </a>
                    </div>
                )}
            </header>

            {/* ── Hero ── */}
            <section className="hero-bg relative min-h-screen flex items-center justify-center overflow-hidden">

                {/* Drifting orbs */}
                <div className="orb-a absolute top-[-80px] right-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(255,182,193,0.35), transparent 70%)' }} />
                <div className="orb-b absolute bottom-[-60px] left-[-80px] w-[420px] h-[420px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(255,143,163,0.25), transparent 70%)' }} />
                <div className="orb-c absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(255,214,221,0.2), transparent 70%)' }} />

                <div className="relative z-10 text-center px-6 max-w-3xl mx-auto admin-fade-in">
                    {/* Badge */}
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
                        style={{ background: '#fce7ea', color: '#e0607a' }}
                    >
                        <span>✦</span>
                        <span>Bespoke Invitation Design</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight tracking-tight mb-6"
                        style={{ color: '#1f2937' }}>
                        Elegance in<br />
                        <span style={{
                            background: 'linear-gradient(135deg, #FFB6C1, #e0607a)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Every Detail
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto" style={{ color: '#6b7280' }}>
                        Luxury stationery and invitation design for life's most beautiful moments.
                        Crafted with care, tailored to you.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="#portfolio"
                            className="px-8 py-3.5 rounded-xl text-white font-semibold text-sm tracking-wide transition-all hover:shadow-xl hover:-translate-y-0.5"
                            style={{ background: 'linear-gradient(135deg, #FFB6C1, #ff8fa3)' }}
                        >
                            View Portfolio
                        </a>
                        <a
                            href="#contact"
                            className="px-8 py-3.5 rounded-xl font-semibold text-sm tracking-wide border transition-all hover:-translate-y-0.5"
                            style={{ borderColor: '#ffc8d1', color: '#e0607a', background: 'transparent' }}
                        >
                            Start Your Project
                        </a>
                    </div>

                    {/* Scroll cue */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 admin-float">
                        <div className="w-6 h-9 rounded-full border-2 flex items-start justify-center pt-1.5" style={{ borderColor: '#ffc8d1' }}>
                            <div className="w-1 h-2.5 rounded-full" style={{ background: '#FFB6C1' }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Services ── */}
            <section id="services" className="py-24 px-6" style={{ background: '#ffffff' }}>
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#FFB6C1' }}>What We Offer</p>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold" style={{ color: '#1f2937' }}>
                            Crafted for Every Occasion
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {services.map((s) => (
                            <div
                                key={s.title}
                                className="p-8 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg group"
                                style={{ borderColor: '#fce7ea', background: '#fffaf9' }}
                            >
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                                    style={{ background: 'linear-gradient(135deg, #FFB6C1, #ff8fa3)' }}
                                >
                                    <span className="text-white text-xl">{s.icon}</span>
                                </div>
                                <h3 className="font-serif font-bold text-lg mb-3" style={{ color: '#1f2937' }}>{s.title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Portfolio ── */}
            <section id="portfolio" className="py-24 px-6" style={{ background: '#fff0f3' }}>
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#FFB6C1' }}>Our Work</p>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold" style={{ color: '#1f2937' }}>
                            A Glimpse of the Collection
                        </h2>
                    </div>

                    {/* Invitations grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {invitations.length > 0 ? (
                            invitations.map((inv) => {
                                const targetUrl = inv.invitation_link || inv.image_url;
                                return (
                                    <a
                                        key={inv.id}
                                        href={targetUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative aspect-[3/4] rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl block cursor-pointer"
                                        style={{ borderColor: '#ffc8d1' }}
                                    >
                                        <img
                                            src={inv.image_url}
                                            alt={inv.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div
                                            className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)' }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="min-w-0 pr-2">
                                                    <p className="text-white font-serif font-semibold text-sm truncate">{inv.title}</p>
                                                    <span className="text-xs text-white/90 mt-0.5 block">{inv.category}</span>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 text-white">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                );
                            })
                        ) : (
                            [...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="aspect-[3/4] rounded-2xl flex flex-col items-center justify-center border transition-all hover:-translate-y-1 hover:shadow-lg"
                                    style={{
                                        background: i % 2 === 0
                                            ? 'linear-gradient(135deg, #fff0f3, #fce7ea)'
                                            : 'linear-gradient(135deg, #fce7ea, #ffd6dd)',
                                        borderColor: '#ffc8d1',
                                    }}
                                >
                                    <span className="text-4xl mb-2" style={{ color: '#FFB6C1' }}>✦</span>
                                    <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#e0607a' }}>
                                        Coming Soon
                                    </p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* View full portfolio button */}
                    <div className="text-center mt-12">
                        <Link
                            to="/portfolio"
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm tracking-wide border transition-all hover:-translate-y-0.5 hover:shadow-lg"
                            style={{ borderColor: '#ffc8d1', color: '#e0607a', background: '#ffffff' }}
                        >
                            <span>View Full Portfolio</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section id="testimonials" className="py-24 px-6" style={{ background: '#ffffff' }}>
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#FFB6C1' }}>Kind Words</p>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold" style={{ color: '#1f2937' }}>
                            Beloved by Our Clients
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((t) => (
                            <div
                                key={t.author}
                                className="p-8 rounded-2xl border"
                                style={{ borderColor: '#fce7ea', background: '#fffaf9' }}
                            >
                                <p className="text-2xl mb-4" style={{ color: '#FFB6C1' }}>"</p>
                                <p className="text-sm leading-relaxed mb-6 italic" style={{ color: '#6b7280' }}>{t.quote}</p>
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                                        style={{ background: 'linear-gradient(135deg, #FFB6C1, #ff8fa3)' }}
                                    >
                                        {t.author[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold" style={{ color: '#1f2937' }}>{t.author}</p>
                                        <p className="text-xs" style={{ color: '#9ca3af' }}>{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Contact / CTA ── */}
            <section
                id="contact"
                className="py-24 px-6"
                style={{ background: 'linear-gradient(135deg, #FFB6C1 0%, #ff8fa3 60%, #e05c7a 100%)' }}
            >
                <div className="max-w-2xl mx-auto text-center">
                    <div className="admin-float inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
                        style={{ background: 'rgba(255,255,255,0.2)' }}>
                        <span className="text-white text-3xl">✦</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
                        Let's Create Something Beautiful
                    </h2>
                    <p className="text-white/80 text-base mb-10">
                        Every great invitation starts with a conversation. Tell us about your vision and we'll bring it to life.
                    </p>
                    <a
                        href="https://www.facebook.com/parisianinvitations"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-10 py-4 rounded-xl font-semibold text-sm tracking-wide transition-all hover:shadow-2xl hover:-translate-y-0.5"
                        style={{ background: '#ffffff', color: '#e0607a' }}
                    >
                        {/* Facebook icon */}
                        <svg className="w-5 h-5" fill="#e0607a" viewBox="0 0 24 24">
                            <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                        </svg>
                        Visit Us on Facebook
                    </a>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="py-8 px-6 text-center border-t" style={{ background: '#fffaf9', borderColor: '#fce7ea' }}>
                <div className="flex items-center justify-center gap-2 mb-2">
                    <div
                        className="w-6 h-6 rounded-md flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #FFB6C1, #ff8fa3)' }}
                    >
                        <span className="text-white text-xs">✦</span>
                    </div>
                    <span className="font-serif font-bold text-sm" style={{ color: '#1f2937' }}>The Parisian Invites</span>
                </div>
                <p className="text-xs" style={{ color: '#d1d5db' }}>
                    © {new Date().getFullYear()} The Parisian Invites. All rights reserved.
                </p>
            </footer>

        </div>
    );
}
