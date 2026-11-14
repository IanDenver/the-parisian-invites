import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function ProtectedRoute({ children }) {
    const [session, setSession] = useState(undefined); // undefined = still checking

    useEffect(() => {
        // Check current session on mount
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        // Listen for auth state changes (logout, token refresh, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Still loading — show a minimal pink spinner
    if (session === undefined) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: '#fffaf9' }}>
                <div className="flex flex-col items-center gap-4">
                    <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center animate-pulse"
                        style={{ background: 'linear-gradient(135deg, #FFB6C1, #ff8fa3)' }}
                    >
                        <span className="text-white text-xl">✦</span>
                    </div>
                    <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#FFB6C1' }}>
                        Verifying session…
                    </p>
                </div>
            </div>
        );
    }

    // No session → redirect to login
    if (!session) {
        return <Navigate to="/admin/login" replace />;
    }

    // Authenticated → render the protected page
    return children;
}
