import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

interface AuthPortalProps {
    onNavigate: (page: 'landing' | 'auth', tab?: 'login' | 'signup') => void;
    initialTab?: 'login' | 'signup';
}

const AuthPortal: React.FC<AuthPortalProps> = ({ onNavigate, initialTab = 'login' }) => {
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);

    useEffect(() => {
        if (initialTab) {
            setActiveTab(initialTab);
        }
    }, [initialTab]);

    return (
        <div className="bg-background-dark font-display text-slate-100 min-h-screen relative overflow-x-hidden">
            <Navbar onNavigate={onNavigate} />
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 tech-grid"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-background-dark via-transparent to-primary/5"></div>
            </div>
            <div className="relative z-10 flex flex-col items-center w-full min-h-screen pt-24">

                <main className="flex-1 w-full flex items-center justify-center p-6">
                    <div className="w-full max-w-md">
                        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden glow-border">
                            <div className="p-2 border-b border-slate-800">
                                <div className="flex bg-slate-950/50 rounded-xl p-1">
                                    <button
                                        onClick={() => setActiveTab('login')}
                                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all shadow-lg ${activeTab === 'login' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('signup')}
                                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'signup' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        Signup
                                    </button>
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="mb-8 text-center">
                                    <h1 className="text-2xl font-black uppercase tracking-wider text-white mb-2">Security Verification</h1>
                                    <p className="text-slate-400 text-xs font-mono uppercase tracking-[0.2em]">Protocol: Auth-v2.0.4</p>
                                </div>

                                {activeTab === 'login' && (
                                    <form className="space-y-5">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Secure Email</label>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">alternate_email</span>
                                                <input className="w-full bg-slate-950 border-slate-800 rounded-lg pl-11 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary text-white transition-all outline-none" placeholder="agent@secure_secret.lab" type="email" />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Access Cipher</label>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">lock</span>
                                                <input className="w-full bg-slate-950 border-slate-800 rounded-lg pl-11 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary text-white transition-all outline-none" placeholder="••••••••••••" type="password" />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-xs py-1">
                                            <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-white">
                                                <input className="rounded border-slate-800 bg-slate-950 text-primary focus:ring-0 focus:ring-offset-0" type="checkbox" />
                                                Remember Module
                                            </label>
                                            <a className="text-primary hover:text-accent-blue font-bold" href="#">Lost Cipher?</a>
                                        </div>
                                        <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
                                            <span className="material-symbols-outlined text-xl">key</span>
                                            AUTHENTICATE
                                        </button>
                                        <div className="relative flex items-center gap-3 py-4">
                                            <div className="h-px bg-slate-800 flex-1"></div>
                                            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">OR</span>
                                            <div className="h-px bg-slate-800 flex-1"></div>
                                        </div>
                                        <button className="w-full bg-white text-slate-950 font-bold py-3 rounded-lg transition-all hover:bg-slate-100 flex items-center justify-center gap-3 cursor-pointer" type="button">
                                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"></path>
                                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"></path>
                                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor"></path>
                                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"></path>
                                            </svg>
                                            Log in with Google
                                        </button>
                                    </form>
                                )}

                                {activeTab === 'signup' && (
                                    <form className="space-y-5">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Identity Name</label>
                                            <input className="w-full bg-slate-950 border-slate-800 rounded-lg px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary text-white outline-none" placeholder="John Doe" type="text" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Secure Email</label>
                                            <input className="w-full bg-slate-950 border-slate-800 rounded-lg px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary text-white outline-none" placeholder="agent@secure_secret.lab" type="email" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">New Cipher</label>
                                                <input className="w-full bg-slate-950 border-slate-800 rounded-lg px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary text-white outline-none" placeholder="••••••••" type="password" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Confirm</label>
                                                <input className="w-full bg-slate-950 border-slate-800 rounded-lg px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary text-white outline-none" placeholder="••••••••" type="password" />
                                            </div>
                                        </div>
                                        <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg transition-all active:scale-95 cursor-pointer">INITIALIZE ACCOUNT</button>
                                        <button className="w-full bg-white text-slate-950 font-bold py-3 rounded-lg flex items-center justify-center gap-3 cursor-pointer" type="button">
                                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"></path>
                                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"></path>
                                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor"></path>
                                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"></path>
                                            </svg>
                                            Sign up with Google
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
                </main>
                <footer className="w-full max-w-[1200px] px-6 py-6 border-t border-slate-800/50 mt-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-lg">radio_button_checked</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">System Status: Global/Optimal</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">© 2024 SECURE_SECRET LABORATORIES | PORTAL ACCESS V2</p>
                </footer>
            </div>
        </div>
    );
};

export default AuthPortal;
