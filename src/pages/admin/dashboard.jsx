import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const CATEGORIES = ['Wedding', 'Birthday', 'Corporate', 'Bespoke', 'Other'];

// ── Upload Modal ─────────────────────────────────────────────────────────────
function UploadModal({ dark, t, onClose, onUploaded }) {
    const [file, setFile]           = useState(null);
    const [preview, setPreview]     = useState(null);
    const [title, setTitle]         = useState('');
    const [invitationLink, setInvitationLink] = useState('');
    const [category, setCategory]   = useState('Wedding');
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError]         = useState(null);
    const [dragOver, setDragOver]   = useState(false);
    const inputRef = useRef();

    const handleFile = (f) => {
        if (!f || !f.type.startsWith('image/')) return;
        setFile(f);
        setPreview(URL.createObjectURL(f));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        handleFile(e.dataTransfer.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) { setError('Please select an image.'); return; }
        if (!title.trim()) { setError('Please enter a title.'); return; }

        setUploading(true);
        setError(null);

        try {
            // 1. Upload image to Supabase Storage
            const ext      = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
            const { error: storageError } = await supabase.storage
                .from('invitations')
                .upload(fileName, file, { cacheControl: '3600', upsert: false });

            if (storageError) throw storageError;

            // 2. Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('invitations')
                .getPublicUrl(fileName);

            // 3. Save metadata to DB
            const { error: dbError } = await supabase
                .from('invitations')
                .insert({
                    title: title.trim(),
                    category,
                    description: description.trim(),
                    image_url: publicUrl,
                    invitation_link: invitationLink.trim() || null
                });

            if (dbError) throw dbError;

            onUploaded();
            onClose();
        } catch (err) {
            setError(err.message || 'Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const inputStyle = {
        background: t.inputBg,
        borderColor: t.inputBorder,
        color: t.inputText,
        width: '100%',
        padding: '0.625rem 0.875rem',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: '0.75rem',
        fontSize: '0.875rem',
        outline: 'none',
        transition: 'border-color 0.15s',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
            <div
                className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
                style={{ background: t.card, border: `1px solid ${t.cardBorder}` }}
            >
                {/* Modal header */}
                <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${t.divider}` }}>
                    <div>
                        <h3 className="font-serif font-semibold text-base" style={{ color: t.heading }}>Upload New Invitation</h3>
                        <p className="text-xs mt-0.5" style={{ color: t.subtext }}>Add a new design to your portfolio</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                        style={{ background: t.toggleBg, color: t.subtext }}
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">

                    {/* Error */}
                    {error && (
                        <div className="p-3 rounded-xl text-sm flex items-start gap-2"
                            style={{ background: t.errorBg, color: t.errorText, border: `1px solid ${t.errorBorder}` }}>
                            <span>⚠</span><span>{error}</span>
                        </div>
                    )}

                    {/* Drop zone */}
                    <div
                        onClick={() => inputRef.current.click()}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden"
                        style={{
                            borderColor: dragOver ? '#FFB6C1' : t.inputBorder,
                            background: dragOver ? (dark ? '#2d1a1d' : '#fff0f3') : t.inputBg,
                            minHeight: preview ? 'auto' : '160px',
                        }}
                    >
                        {preview ? (
                            <div className="relative w-full">
                                <img src={preview} alt="Preview" className="w-full max-h-56 object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                                    style={{ background: 'rgba(0,0,0,0.4)' }}>
                                    <p className="text-white text-sm font-medium">Click to change</p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                                    style={{ background: dark ? '#2d1a1d' : '#fff0f3' }}>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"
                                        style={{ color: '#FFB6C1' }}>
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium" style={{ color: t.heading }}>Drag & drop or click to upload</p>
                                <p className="text-xs mt-1" style={{ color: t.subtext }}>PNG, JPG, WEBP up to 10MB</p>
                            </div>
                        )}
                    </div>
                    <input ref={inputRef} type="file" accept="image/*" className="hidden"
                        onChange={(e) => handleFile(e.target.files[0])} />

                    {/* Title */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: t.label }}>
                            Title <span style={{ color: '#FFB6C1' }}>*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Garden Romance Suite"
                            style={inputStyle}
                            required
                        />
                    </div>

                    {/* Invitation Link */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: t.label }}>
                            Invitation Link / URL <span style={{ color: t.subtext }}>(e.g. Canva or live link)</span>
                        </label>
                        <input
                            type="url"
                            value={invitationLink}
                            onChange={(e) => setInvitationLink(e.target.value)}
                            placeholder="https://..."
                            style={inputStyle}
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: t.label }}>
                            Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            style={inputStyle}
                        >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: t.label }}>
                            Description <span style={{ color: t.subtext }}>(optional)</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Briefly describe this invitation design..."
                            rows={3}
                            style={{ ...inputStyle, resize: 'none' }}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all"
                            style={{ background: 'transparent', color: t.navItem, borderColor: t.cardBorder }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={uploading}
                            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
                            style={{ background: 'linear-gradient(135deg, #FFB6C1, #ff8fa3)' }}
                        >
                            {uploading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Uploading…
                                </span>
                            ) : 'Upload Invitation'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
    const navigate = useNavigate();
    const [dark, setDark]               = useState(() => localStorage.getItem('adminTheme') === 'dark');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showModal, setShowModal]     = useState(false);
    const [invitations, setInvitations] = useState([]);
    const [loadingInvites, setLoadingInvites] = useState(true);
    const [deleteId, setDeleteId]       = useState(null); // confirm delete

    useEffect(() => { localStorage.setItem('adminTheme', dark ? 'dark' : 'light'); }, [dark]);

    const fetchInvitations = async () => {
        setLoadingInvites(true);
        const { data, error } = await supabase
            .from('invitations')
            .select('*')
            .order('created_at', { ascending: false });
        if (!error) setInvitations(data || []);
        setLoadingInvites(false);
    };

    useEffect(() => { fetchInvitations(); }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    const handleDelete = async (id, imageUrl) => {
        // Extract filename from URL
        const fileName = imageUrl.split('/').pop();
        await supabase.storage.from('invitations').remove([fileName]);
        await supabase.from('invitations').delete().eq('id', id);
        setDeleteId(null);
        fetchInvitations();
    };

    // ── Theme tokens ──────────────────────────────────────────
    const t = {
        pageBg:        dark ? '#0f0f0f'  : '#fdf4f5',
        sidebar:       dark ? '#1a1a1a'  : '#ffffff',
        sidebarBorder: dark ? '#2a2a2a'  : '#fce7ea',
        topbar:        dark ? '#1a1a1a'  : '#ffffff',
        topbarBorder:  dark ? '#2a2a2a'  : '#fce7ea',
        card:          dark ? '#1f1f1f'  : '#ffffff',
        cardBorder:    dark ? '#2e2e2e'  : '#fce7ea',
        heading:       dark ? '#f5e0e4'  : '#1f2937',
        subtext:       dark ? '#9ca3af'  : '#9ca3af',
        navItem:       dark ? '#d1aab0'  : '#6b7280',
        navActive:     dark ? '#3d1f25'  : '#fff0f2',
        navActiveText: dark ? '#FFB6C1'  : '#e0607a',
        toggleBg:      dark ? '#262626'  : '#f3f4f6',
        toggleIcon:    dark ? '#FFB6C1'  : '#6b7280',
        logoutBg:      dark ? '#2d1a1d'  : '#fff0f2',
        logoutText:    dark ? '#FFB6C1'  : '#e0607a',
        logoutBorder:  dark ? '#5c2a30'  : '#ffc8d1',
        statIcon:      'linear-gradient(135deg, #FFB6C1, #ff8fa3)',
        statVal:       dark ? '#f5e0e4'  : '#1f2937',
        statLabel:     dark ? '#9ca3af'  : '#9ca3af',
        divider:       dark ? '#2a2a2a'  : '#f9e4e7',
        label:         dark ? '#d1aab0'  : '#6b7280',
        inputBg:       dark ? '#262626'  : '#f9fafb',
        inputBorder:   dark ? '#3f2a2e'  : '#e5e7eb',
        inputText:     dark ? '#f3e8ea'  : '#1f2937',
        errorBg:       dark ? '#2d1515'  : '#fef2f2',
        errorBorder:   dark ? '#5c2222'  : '#fecaca',
        errorText:     dark ? '#f87171'  : '#ef4444',
        catBadge:      dark ? '#2d1a1d'  : '#fff0f2',
        catText:       '#e0607a',
    };

    const stats = [
        { icon: '✦', label: 'Total Designs',  value: invitations.length },
        { icon: '◈', label: 'Collections',    value: [...new Set(invitations.map(i => i.category))].length || 0 },
        { icon: '⊞', label: 'Published',      value: invitations.length },
        { icon: '✉', label: 'Inquiries',      value: '—' },
    ];

    const navItems = [
        { icon: '◈', label: 'Dashboard',   active: true  },
        { icon: '✦', label: 'Invitations', active: false },
        { icon: '⊞', label: 'Collections', active: false },
        { icon: '⚙', label: 'Settings',    active: false },
    ];

    const SunIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/>
            <path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
    );
    const MoonIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
    );

    return (
        <div className="min-h-screen flex transition-colors duration-300" style={{ background: t.pageBg }}>

            {/* ── Sidebar ── */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-30 w-64 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
                style={{ background: t.sidebar, borderRight: `1px solid ${t.sidebarBorder}` }}
            >
                <div className="flex items-center gap-3 px-6 py-5" style={{ borderBottom: `1px solid ${t.divider}` }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #FFB6C1, #ff8fa3)' }}>
                        <span className="text-white text-lg select-none">✦</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold tracking-widest uppercase" style={{ color: t.navActiveText }}>The Parisian</p>
                        <p className="text-xs" style={{ color: t.subtext }}>Admin Portal</p>
                    </div>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map((item) => (
                        <button key={item.label}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left"
                            style={{ background: item.active ? t.navActive : 'transparent', color: item.active ? t.navActiveText : t.navItem }}>
                            <span className="text-base w-5 text-center">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="px-3 py-4" style={{ borderTop: `1px solid ${t.divider}` }}>
                    <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all duration-150"
                        style={{ background: t.logoutBg, color: t.logoutText, borderColor: t.logoutBorder }}>
                        <span className="text-base w-5 text-center">→</span>
                        Log Out
                    </button>
                </div>
            </aside>

            {sidebarOpen && <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

            {/* ── Main ── */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Topbar */}
                <header className="flex items-center justify-between px-6 py-4 sticky top-0 z-10"
                    style={{ background: t.topbar, borderBottom: `1px solid ${t.topbarBorder}` }}>
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden p-1.5 rounded-lg" style={{ color: t.navItem }}
                            onClick={() => setSidebarOpen(!sidebarOpen)}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-lg font-serif font-semibold" style={{ color: t.heading }}>Dashboard</h1>
                            <p className="text-xs" style={{ color: t.subtext }}>Welcome back, Admin</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setDark(!dark)} aria-label="Toggle dark mode"
                            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                            style={{ background: t.toggleBg, color: t.toggleIcon }}>
                            {dark ? <SunIcon /> : <MoonIcon />}
                        </button>
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #FFB6C1, #ff8fa3)' }}>A</div>
                    </div>
                </header>

                {/* Body */}
                <main className="flex-1 p-6 space-y-6">

                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((s) => (
                            <div key={s.label} className="rounded-2xl p-5 border transition-colors duration-300"
                                style={{ background: t.card, borderColor: t.cardBorder }}>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                                    style={{ background: t.statIcon }}>
                                    <span className="text-white text-lg">{s.icon}</span>
                                </div>
                                <p className="text-2xl font-serif font-bold" style={{ color: t.statVal }}>{s.value}</p>
                                <p className="text-xs mt-1 uppercase tracking-wider" style={{ color: t.statLabel }}>{s.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Portfolio card */}
                    <div className="rounded-2xl border transition-colors duration-300" style={{ background: t.card, borderColor: t.cardBorder }}>

                        {/* Card header */}
                        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${t.divider}` }}>
                            <h2 className="font-serif font-semibold text-lg" style={{ color: t.heading }}>Invitation Portfolio</h2>
                            <button
                                onClick={() => setShowModal(true)}
                                className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
                                style={{ background: 'linear-gradient(135deg, #FFB6C1, #ff8fa3)' }}
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                Upload New
                            </button>
                        </div>

                        <div className="p-6">
                            {loadingInvites ? (
                                /* Loading skeleton */
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="aspect-[3/4] rounded-2xl animate-pulse"
                                            style={{ background: dark ? '#2a2a2a' : '#f3f4f6' }} />
                                    ))}
                                </div>
                            ) : invitations.length === 0 ? (
                                /* Empty state */
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="admin-float w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                                        style={{ background: dark ? '#2d1a1d' : '#fff0f2' }}>
                                        <span className="text-3xl" style={{ color: '#FFB6C1' }}>✦</span>
                                    </div>
                                    <p className="font-serif text-base font-medium" style={{ color: t.heading }}>No designs yet</p>
                                    <p className="text-sm mt-1 mb-5" style={{ color: t.subtext }}>Upload your first invitation to get started.</p>
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl text-white"
                                        style={{ background: 'linear-gradient(135deg, #FFB6C1, #ff8fa3)' }}>
                                        + Upload First Design
                                    </button>
                                </div>
                            ) : (
                                /* Invitation grid */
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {invitations.map((inv) => (
                                        <div key={inv.id} className="group relative rounded-2xl overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-xl"
                                            style={{ borderColor: t.cardBorder }}>
                                            <img
                                                src={inv.image_url}
                                                alt={inv.title}
                                                className="w-full aspect-[3/4] object-cover"
                                            />
                                            {/* Overlay on hover */}
                                            <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)' }}>
                                                <p className="text-white text-sm font-semibold truncate">{inv.title}</p>
                                                <div className="flex items-center justify-between mt-1">
                                                    <span className="text-xs px-2 py-0.5 rounded-full text-white"
                                                        style={{ background: 'rgba(255,182,193,0.6)' }}>
                                                        {inv.category}
                                                    </span>
                                                    <div className="flex items-center gap-1.5">
                                                        {inv.invitation_link && (
                                                            <a
                                                                href={inv.invitation_link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="w-7 h-7 rounded-full flex items-center justify-center text-white transition-all hover:bg-white/30"
                                                                style={{ background: 'rgba(255,255,255,0.15)' }}
                                                                title="View Invitation Link"
                                                            >
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                                                </svg>
                                                            </a>
                                                        )}
                                                        <button
                                                            onClick={() => setDeleteId(inv.id)}
                                                            className="w-7 h-7 rounded-full flex items-center justify-center text-white transition-all hover:bg-red-500/80"
                                                            style={{ background: 'rgba(255,255,255,0.15)' }}
                                                            title="Delete"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* ── Upload Modal ── */}
            {showModal && (
                <UploadModal
                    dark={dark}
                    t={t}
                    onClose={() => setShowModal(false)}
                    onUploaded={fetchInvitations}
                />
            )}

            {/* ── Delete Confirm ── */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
                    <div className="w-full max-w-sm rounded-2xl p-6 shadow-2xl" style={{ background: t.card, border: `1px solid ${t.cardBorder}` }}>
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                            style={{ background: t.errorBg }}>
                            <svg className="w-6 h-6" fill="none" stroke={t.errorText} strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <h3 className="font-serif font-semibold text-center mb-1" style={{ color: t.heading }}>Delete Invitation?</h3>
                        <p className="text-sm text-center mb-6" style={{ color: t.subtext }}>This will permanently remove the image and its data.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)}
                                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border"
                                style={{ background: 'transparent', color: t.navItem, borderColor: t.cardBorder }}>
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    const inv = invitations.find(i => i.id === deleteId);
                                    if (inv) handleDelete(inv.id, inv.image_url);
                                }}
                                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
                                style={{ background: '#ef4444' }}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
