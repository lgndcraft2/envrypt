import React, { useState } from 'react';
import Navbar from './Navbar';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AuthPortal: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine active tab based on current URL path
    const activeTab = location.pathname === '/signup' ? 'signup' : 'login';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            navigate('/get-started');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });
            if (error) throw error;
            // For email confirmation flows, usually redirect to a "check email" page.
            // But if auto-confirm is on (dev), we can proceed or tell them to check email.
            // We'll redirect to /get-started assuming success/session creation.
            navigate('/get-started');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-dark font-display text-slate-100 min-h-screen relative overflow-x-hidden">
            <Navbar />

            <div className="absolute inset-0 z-0">
                <div className="tech-grid absolute inset-0 opacity-20"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>
            </div>

            <div className="relative z-10 flex min-h-screen items-center justify-center pt-24 pb-12 px-4">
                <div className="w-full max-w-md">
                    <div className="mb-8 flex justify-center">
                        <div className="flex rounded-lg bg-black/40 p-1 backdrop-blur-sm border border-white/5">
                            <button
                                onClick={() => navigate('/login')}
                                className={`rounded-md px-6 py-2 text-sm font-bold transition-all ${activeTab === 'login'
                                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                    : 'text-white/50 hover:text-white'
                                    } `}
                            >
                                Log In
                            </button>
                            <button
                                onClick={() => navigate('/signup')}
                                className={`rounded-md px-6 py-2 text-sm font-bold transition-all ${activeTab === 'signup'
                                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                    : 'text-white/50 hover:text-white'
                                    } `}
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden glow-border">
                        <div className="p-8">
                            <div className="mb-8 text-center">
                                <h1 className="text-2xl font-black uppercase tracking-wider text-white mb-2">Security Verification</h1>
                                <p className="text-slate-400 text-xs font-mono uppercase tracking-[0.2em]">Protocol: Auth-v2.0.4</p>
                            </div>

                            {error && (
                                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-xs font-bold text-center">
                                    {error}
                                </div>
                            )}

                            {activeTab === 'login' && (
                                <form className="space-y-5" onSubmit={handleLogin}>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Secure Email</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">alternate_email</span>
                                            <input
                                                className="w-full bg-slate-950 border-slate-800 rounded-lg pl-11 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary text-white transition-all outline-none"
                                                placeholder="agent@secure_secret.lab"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Access Cipher</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">lock</span>
                                            <input
                                                className="w-full bg-slate-950 border-slate-800 rounded-lg pl-11 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary text-white transition-all outline-none"
                                                placeholder="••••••••••••"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs py-1">
                                        <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-white">
                                            <input className="rounded border-slate-800 bg-slate-950 text-primary focus:ring-0 focus:ring-offset-0" type="checkbox" />
                                            Remember Module
                                        </label>
                                        <a className="text-primary hover:text-accent-blue font-bold" href="#">Lost Cipher?</a>
                                    </div>
                                    <button
                                        disabled={loading}
                                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <span className="material-symbols-outlined animate-spin">refresh</span>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-xl">key</span>
                                                AUTHENTICATE
                                            </>
                                        )}
                                    </button>
                                    {/* Google Auth & Separator Omitted for brevity if not configured yet, can re-add if needed */}
                                </form>
                            )}

                            {activeTab === 'signup' && (
                                <form className="space-y-5" onSubmit={handleSignup}>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Identity Name</label>
                                        <input
                                            className="w-full bg-slate-950 border-slate-800 rounded-lg px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary text-white outline-none"
                                            placeholder="John Doe"
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Secure Email</label>
                                        <input
                                            className="w-full bg-slate-950 border-slate-800 rounded-lg px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary text-white outline-none"
                                            placeholder="agent@secure_secret.lab"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">New Cipher</label>
                                        <input
                                            className="w-full bg-slate-950 border-slate-800 rounded-lg px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary text-white outline-none"
                                            placeholder="••••••••"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button
                                        disabled={loading}
                                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? "INITIALIZING..." : "INITIALIZE ACCOUNT"}
                                    </button>
                                </form>
                            )}
                        </div>
                        <div className="px-8 py-4 bg-slate-950/50 border-t border-slate-800 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="size-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-[10px] text-slate-500 font-mono">NODE_SECURE</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">ENCRYPTION: AES-256</span>
                        </div>
                    </div>
                    <div className="mt-8 text-center flex flex-col gap-2">
                        <p className="text-slate-500 text-xs tracking-widest uppercase">Securing your secrets since 2048</p>
                        <div className="flex justify-center gap-4 text-slate-600 text-[10px] font-bold">
                            <a className="hover:text-primary" href="#">TERMS</a>
                            <span className="opacity-20">•</span>
                            <a className="hover:text-primary" href="#">PRIVACY</a>
                            <span className="opacity-20">•</span>
                            <a className="hover:text-primary" href="#">AUDIT</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPortal;
