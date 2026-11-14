import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const categories = ['All', 'Wedding', 'Birthday', 'Corporate', 'Bespoke', 'Other'];

export default function Portfolio() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchInvitations() {
            setLoading(true);
            const { data, error } = await supabase
                .from('invitations')
                .select('*')
                .order('created_at', { ascending: false });
            if (!error && data) {
                setInvitations(data);
            }
            setLoading(false);
        }
        fetchInvitations();
    }, []);

    const filteredInvitations = selectedCategory === 'All'
        ? invitations
        : invitations.filter(inv => inv.category?.toLowerCase() === selectedCategory.toLowerCase());
    return (
        <div className="min-h-screen font-sans" style={{ background: '#fffaf9', color: '#1f2937' }}>

            {/* ── Navbar ── */}
            <header
                className="sticky top-0 z-50 border-b"
                style={{ background: 'rgba(255,250,249,0.95)', backdropFilter: 'blur(12px)', borderColor: '#fce7ea' }}
            >
                <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                            style={{ background: 'linear-gradient(135deg, #FFB6C1, #ff8fa3)' }}
                        >
                            <span className="text-white text-sm select-none">✦</span>
                        </div>
                        <span className="font-serif font-bold text-base tracking-wide" style={{ color: '#1f2937' }}>
                            The Parisian Invites
                        </span>
                    </Link>

                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-pink-400"
                        style={{ color: '#6b7280' }}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Home
                    </Link>
                </div>
            </header>

            {/* ── Hero banner ── */}
            <section
                className="py-20 px-6 text-center relative overflow-hidden"
                style={{ background: 'linear-gradient(160deg, #fff0f3 0%, #fff8f9 50%, #fdf4f5 100%)' }}
            >
                <div className="absolute top-[-60px] right-[-80px] w-80 h-80 rounded-full opacity-20 pointer-events-none"
                    style={{ background: 'radial-gradient(circle, #FFB6C1, transparent)' }} />
                <div className="absolute bottom-[-40px] left-[-60px] w-64 h-64 rounded-full opacity-15 pointer-events-none"
                    style={{ background: 'radial-gradient(circle, #ff8fa3, transparent)' }} />

                <div className="relative z-10 max-w-2xl mx-auto">
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-5"
                        style={{ background: '#fce7ea', color: '#e0607a' }}
                    >
                        <span>✦</span>
                        <span>Our Collection</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-4" style={{ color: '#1f2937' }}>
                        Full Portfolio
                    </h1>
                    <p className="text-base md:text-lg leading-relaxed" style={{ color: '#9ca3af' }}>
                        A curated selection of our most beloved invitation designs — each one a labour of love.
                    </p>
                </div>
            </section>

            {/* ── Filter tabs ── */}
            <div className="sticky top-16 z-40 border-b" style={{ background: 'rgba(255,250,249,0.95)', backdropFilter: 'blur(12px)', borderColor: '#fce7ea' }}>
                <div className="max-w-6xl mx-auto px-6 flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
                    {categories.map((cat) => {
                        const isActive = selectedCategory === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all"
                                style={
                                    isActive
                                        ? { background: 'linear-gradient(135deg, #FFB6C1, #ff8fa3)', color: '#fff' }
                                        : { background: '#fce7ea', color: '#e0607a' }
                                }
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Grid ── */}
            <main className="max-w-6xl mx-auto px-6 py-14">
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] rounded-2xl animate-pulse bg-pink-50/60" />
                        ))}
                    </div>
                ) : filteredInvitations.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                        {filteredInvitations.map((inv) => {
                            const targetUrl = inv.invitation_link || inv.image_url;
                            return (
                                <a
                                    key={inv.id}
                                    href={targetUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-white block cursor-pointer"
                                    style={{ borderColor: '#ffc8d1' }}
                                >
                                    <div className="aspect-[3/4] overflow-hidden relative">
                                        <img
                                            src={inv.image_url}
                                            alt={inv.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div
                                            className="absolute inset-0 flex items-end justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)' }}
                                        >
                                            <span
                                                className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full text-white"
                                                style={{ background: '#FFB6C1' }}
                                            >
                                                {inv.category}
                                            </span>
                                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-4 py-3 border-t flex items-center justify-between" style={{ background: '#fff', borderColor: '#fce7ea' }}>
                                        <div className="min-w-0 pr-2">
                                            <p className="font-serif font-semibold text-sm truncate" style={{ color: '#1f2937' }}>{inv.title}</p>
                                            <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{inv.category}</p>
                                        </div>
                                        <span className="text-xs font-semibold" style={{ color: '#e0607a' }}>Open ↗</span>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: '#fff0f3' }}>
                            <span className="text-2xl" style={{ color: '#FFB6C1' }}>✦</span>
                        </div>
                        <p className="font-serif font-medium text-lg" style={{ color: '#1f2937' }}>No designs found</p>
                        <p className="text-xs mt-1 text-gray-400">There are no designs currently uploaded under this category.</p>
                    </div>
                )}

                {/* Facebook CTA */}
                <div
                    className="mt-16 rounded-2xl p-10 text-center border"
                    style={{ background: 'linear-gradient(135deg, #fff0f3, #fce7ea)', borderColor: '#ffc8d1' }}
                >
                    <div className="admin-float inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
                        style={{ background: 'linear-gradient(135deg, #FFB6C1, #ff8fa3)' }}>
                        <span className="text-white text-2xl">✦</span>
                    </div>
                    <h3 className="text-2xl font-serif font-bold mb-3" style={{ color: '#1f2937' }}>
                        See More of Our Work
                    </h3>
                    <p className="text-sm mb-7" style={{ color: '#9ca3af' }}>
                        Follow us on Facebook for the latest designs, behind-the-scenes, and client stories.
                    </p>
                    <a
                        href="https://www.facebook.com/parisianinvitations"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl font-semibold text-sm text-white transition-all hover:shadow-xl hover:-translate-y-0.5"
                        style={{ background: 'linear-gradient(135deg, #FFB6C1, #ff8fa3)' }}
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                        </svg>
                        Visit Us on Facebook
                    </a>
                </div>
            </main>

            {/* ── Footer ── */}
            <footer className="py-8 px-6 text-center border-t" style={{ background: '#fffaf9', borderColor: '#fce7ea' }}>
                <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #FFB6C1, #ff8fa3)' }}>
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
