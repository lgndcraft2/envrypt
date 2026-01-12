import React from 'react';
import { useNavigate } from 'react-router-dom';

const JoinTeam: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-background-dark font-display text-white selection:bg-primary/30 min-h-screen flex flex-col">
            <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
                <nav className="flex h-16 w-full max-w-[960px] items-center justify-between rounded-xl border border-white/10 bg-black/40 px-8 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                        <div className="size-8 text-primary">
                            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold tracking-tighter"><span className="text-primary">Env</span>rypt</h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Session Encrypted</span>
                        </div>
                        <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                            <div className="size-8 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-xs font-bold text-white">JD</div>
                        </div>
                    </div>
                </nav>
            </div>
            <main className="relative flex-1 flex items-center justify-center pt-24 pb-12">
                <div className="binary-pattern pointer-events-none absolute inset-0 z-0 opacity-40"></div>
                <div className="relative z-10 w-full max-w-[480px] px-4">
                    <div className="rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md p-10 glow-border text-center overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
                        <div className="mb-8 flex justify-center">
                            <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 glow-shadow">
                                <span className="material-symbols-outlined text-3xl">hub</span>
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight mb-3">Enter Invite Code</h1>
                        <p className="text-white/60 text-sm mb-10 max-w-[320px] mx-auto">
                            Ask your administrator for the 8-character code to join your organization.
                        </p>
                        <div className="text-left mb-8">
                            <label className="block text-[10px] font-bold tracking-[0.2em] text-white/40 mb-3 uppercase">
                                Invitation Code
                            </label>
                            <div className="relative group">
                                <input className="w-full bg-[#0d1117] border border-white/10 rounded-xl h-16 px-6 font-mono text-xl tracking-[0.2em] text-primary placeholder:text-white/10 focus:ring-0 focus:outline-none input-glow-focus transition-all uppercase" maxLength={10} placeholder="TRX-88-YZ" type="text" />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-emerald-500 text-xl">check_circle</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <button className="w-full h-14 rounded-xl bg-primary text-white font-bold text-lg transition-all hover:scale-[1.01] active:scale-[0.98] glow-shadow flex items-center justify-center gap-2 group cursor-pointer">
                                Join Team
                                <span className="transition-transform group-hover:translate-x-1">→</span>
                            </button>
                            <button onClick={() => navigate('/get-started')} className="inline-block text-white/40 text-sm font-medium hover:text-white transition-colors cursor-pointer">
                                Back
                            </button>
                        </div>
                        <div className="mt-10 flex justify-center gap-4 border-t border-white/5 pt-8">
                            <div className="flex items-center gap-1.5">
                                <span className="size-1 bg-primary rounded-full"></span>
                                <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Auth_Handshake</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="size-1 bg-primary rounded-full"></span>
                                <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Node_Sync</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="py-8">
                <div className="mx-auto max-w-[960px] px-4 text-center">
                    <p className="text-[10px] font-mono text-white/20 tracking-widest uppercase">
                        System Authorized: node_04.cryptx.local // port_listening_2048
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default JoinTeam;
