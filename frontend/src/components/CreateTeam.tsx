import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreateTeam: React.FC = () => {
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
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Secure Channel</span>
                        </div>
                        <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                            <div className="size-8 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-xs font-bold">JD</div>
                        </div>
                    </div>
                </nav>
            </div>
            <main className="relative flex-1 flex flex-col items-center justify-center pt-24 pb-12 px-4">
                <div className="binary-pattern pointer-events-none absolute inset-0 z-0 opacity-40"></div>
                <div className="relative z-10 w-full max-w-[500px]">
                    <div className="rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md p-8 md:p-12 glow-border text-center">
                        <div className="flex justify-center mb-8">
                            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 glow-shadow">
                                <span className="material-symbols-outlined text-3xl">shield_person</span>
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight mb-3">Name your Team</h1>
                        <p className="text-white/50 text-sm mb-10 leading-relaxed max-w-[320px] mx-auto">
                            This is the name your developers will see. You can change it later.
                        </p>
                        <div className="space-y-8">
                            <div className="text-left">
                                <label className="block text-[10px] font-bold text-primary tracking-[0.2em] mb-3 uppercase">Team Name</label>
                                <div className="focus-glow-border transition-all duration-300 rounded-xl">
                                    <input className="w-full h-14 px-5 bg-card-dark/60 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:ring-0 focus:border-primary/40 focus:outline-none transition-all" placeholder="e.g. Acme Corp Engineering" type="text" />
                                </div>
                            </div>
                            <button className="w-full h-14 rounded-xl bg-primary text-white font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] glow-shadow flex items-center justify-center gap-2 cursor-pointer">
                                Create & Continue <span className="material-symbols-outlined text-xl">arrow_right_alt</span>
                            </button>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-center">
                        <button onClick={() => navigate('/get-started')} className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors group cursor-pointer">
                            <span className="material-symbols-outlined text-lg transition-transform group-hover:-translate-x-1">west</span>
                            Back
                        </button>
                    </div>
                </div>
            </main>
            <footer className="py-8">
                <div className="mx-auto max-w-[960px] px-4 text-center">
                    <p className="text-[10px] font-mono text-white/20 tracking-widest uppercase">
                        System Status: Ready // Team_Initialization_Required
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default CreateTeam;
