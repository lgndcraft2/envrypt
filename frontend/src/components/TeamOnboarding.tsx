import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderProfileDropdown from './HeaderProfileDropdown';
import { useTeam } from '../contexts/TeamContext';
import type { Team } from '../contexts/TeamContext';

const TeamOnboarding: React.FC = () => {
    const navigate = useNavigate();
    const { teams, setActiveTeam, isLoading } = useTeam();

    const handleTeamSelect = (team: Team) => {
        setActiveTeam(team);
        navigate('/dashboard');
    };

    if (isLoading) return null; // Or a loader

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
                        <HeaderProfileDropdown />
                    </div>
                </nav>
            </div>
            <main className="relative flex-1 flex items-center justify-center pt-24 pb-12">
                <div className="binary-pattern pointer-events-none absolute inset-0 z-0 opacity-40"></div>
                <div className="relative z-10 w-full max-w-[1000px] px-4">
                    <div className="rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md p-8 md:p-16 glow-border text-center overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
                        <div className="mb-12">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                                {teams.length > 0 ? "Select Workspace" : <span>Welcome to <span className="text-primary text-glow">Envrypt</span></span>}
                            </h1>
                            <p className="text-white/60 text-lg max-w-xl mx-auto">
                                {teams.length > 0 
                                    ? "Access your secure team environment or establish a new node."
                                    : "Initialize your workspace. Secure collaboration begins with establishing your operational team environment."}
                            </p>
                        </div>

                        {teams.length > 0 && (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {teams.map(team => (
                                    <button
                                        key={team.id}
                                        onClick={() => handleTeamSelect(team)}
                                        className="group relative flex flex-col items-center p-6 rounded-2xl border border-white/10 bg-card-dark/40 transition-all hover:border-primary/40 hover:bg-card-dark/60 hover:scale-[1.02] cursor-pointer"
                                    >
                                        <div className="h-16 w-16 mb-4 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-2xl text-slate-400 group-hover:text-primary transition-colors">
                                            {team.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{team.name}</h3>
                                        <p className="text-xs text-slate-500 font-mono mb-4">{(team.role || 'MEMBER').toUpperCase()} Access</p>
                                        <div className="w-full mt-auto flex items-center justify-center py-2 bg-white/5 rounded-lg text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:bg-primary group-hover:text-black transition-all">
                                            Enter
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {teams.length > 0 && (
                             <div className="flex items-center gap-4 mb-8">
                                <div className="h-px bg-white/10 flex-1"></div>
                                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Or Initialize New Node</span>
                                <div className="h-px bg-white/10 flex-1"></div>
                            </div>
                        )}

                        <div className={`grid md:grid-cols-2 gap-8 ${teams.length > 0 ? 'max-w-3xl mx-auto' : ''}`}>
                            <div className="group relative flex flex-col items-center p-8 rounded-2xl border border-white/10 bg-card-dark/40 transition-all hover:border-primary/40 hover:bg-card-dark/60">
                                <div className="card-gradient absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none"></div>
                                <div className="relative mb-6">
                                    <div className="flex size-20 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 glow-shadow">
                                        <span className="material-symbols-outlined text-4xl">add_moderator</span>
                                    </div>
                                    <div className="absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold">
                                        <span className="material-symbols-outlined text-sm">shield</span>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold mb-3">Create Team</h3>
                                <p className="text-sm text-white/50 mb-8 leading-relaxed">
                                    Establish a new encrypted vault. You'll become the primary administrator and can define security protocols for your members.
                                </p>
                                <button onClick={() => navigate('/create-team')} className="mt-auto w-full h-14 rounded-xl bg-primary text-white font-bold transition-all hover:scale-[1.02] active:scale-[0.98] glow-shadow cursor-pointer">
                                    Initialize New Team
                                </button>
                            </div>
                            <div className="group relative flex flex-col items-center p-8 rounded-2xl border border-white/10 bg-card-dark/40 transition-all hover:border-primary/40 hover:bg-card-dark/60">
                                <div className="card-gradient absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none"></div>
                                <div className="relative mb-6">
                                    <div className="flex size-20 items-center justify-center rounded-2xl bg-white/5 text-white/70 border border-white/10">
                                        <span className="material-symbols-outlined text-4xl">hub</span>
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-white/10 border border-white/20 text-[10px] font-bold">
                                        <span className="material-symbols-outlined text-sm text-primary">key</span>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold mb-3">Join Team</h3>
                                <p className="text-sm text-white/50 mb-8 leading-relaxed">
                                    Connect to an existing secure node. You will need an authorized invitation code or access key provided by your administrator.
                                </p>
                                <button onClick={() => navigate('/join-team')} className="mt-auto w-full h-14 rounded-xl border border-white/20 bg-white/5 text-white font-bold transition-all hover:bg-white/10 hover:border-white/30 active:scale-[0.98] cursor-pointer">
                                    Enter Access Key
                                </button>
                            </div>
                        </div>
                        <div className="mt-12 flex flex-col items-center gap-4">
                            <div className="flex items-center gap-6 text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">
                                <span className="flex items-center gap-1.5"><span className="size-1 bg-primary rounded-full"></span> Zero-Trust Mesh</span>
                                <span className="flex items-center gap-1.5"><span className="size-1 bg-primary rounded-full"></span> PFS Enabled</span>
                                <span className="flex items-center gap-1.5"><span className="size-1 bg-primary rounded-full"></span> ISO-27001</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="mt-auto py-8">
                <div className="mx-auto max-w-[960px] px-4 text-center">
                    <p className="text-[10px] font-mono text-white/20 tracking-widest uppercase">
                        System Authorized: node_04.cryptx.local // handshake_success
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default TeamOnboarding;
