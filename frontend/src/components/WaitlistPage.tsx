import React, { useState } from 'react';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';

const WaitlistPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [teamSize, setTeamSize] = useState('');
    const [currentTool, setCurrentTool] = useState('');
    const [otherTool, setOtherTool] = useState('');
    const [referral, setReferral] = useState('');
    
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        try {
            await api.post('/waitlist', { 
                email,
                team_size: teamSize,
                current_tool: currentTool,
                current_tool_other: otherTool,
                referral_source: referral
            });
            setStatus('success');
            setMessage("You've been added to the waitlist! We'll be in touch soon.");
            setEmail('');
            setTeamSize('');
            setCurrentTool('');
            setOtherTool('');
            setReferral('');
        } catch (err: any) {
            console.error(err);
            setStatus('error');
            setMessage(err.message || "Failed to join waitlist. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0f14] flex flex-col font-sans text-slate-300 selection:bg-teal-500/30">
            <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden pt-32 pb-20">
                {/* Background Glows (Binary Pattern logic can be added if needed, sticking to current look) */}
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />

                <div className="mx-auto max-w-[640px] w-full relative z-10">
                    <div className="rounded-3xl bg-gradient-to-br from-[#161b22] to-black border border-[#1c2127] p-8 md:p-12 shadow-2xl relative overflow-hidden animate-fade-in-up">
                        <div className="absolute -top-24 -left-24 size-48 bg-teal-500/10 blur-[100px]"></div>
                        
                        <header className="text-center mb-10">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1 text-[10px] font-bold tracking-widest text-teal-400 uppercase">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                                </span>
                                Secure Access Portal
                            </div>
                            <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl text-white">Join the Envrypt Waitlist</h1>
                            <p className="text-slate-400 font-light text-lg">Early access for high-security teams.</p>
                        </header>

                        {status === 'success' ? (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 flex flex-col items-center space-y-4 animate-in zoom-in-95 duration-300">
                                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                    <span className="material-symbols-outlined text-3xl">check_circle</span>
                                </div>
                                <h3 className="text-xl font-bold text-white">You're on the list!</h3>
                                <p className="text-slate-400 text-center">{message}</p>
                                <button 
                                    onClick={() => setStatus('idle')}
                                    className="text-sm text-green-400 hover:text-green-300 mt-2 font-medium"
                                >
                                    Register another email
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Email</label>
                                    <input 
                                        className="w-full rounded-xl border border-[#1c2127] bg-[#0d1218] px-4 py-3.5 text-white placeholder:text-slate-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all outline-none" 
                                        id="email" 
                                        placeholder="name@example.com" 
                                        required 
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={status === 'loading'}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Team Size</label>
                                    <div className="relative">
                                    <select 
                                        className="w-full rounded-xl border border-[#1c2127] bg-[#0d1218] px-4 py-3.5 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all appearance-none outline-none" 
                                        value={teamSize}
                                        onChange={(e) => setTeamSize(e.target.value)}
                                        disabled={status === 'loading'}
                                    >
                                        <option className="bg-[#0d1218] text-slate-500" disabled value="">Select team size</option>
                                        <option className="bg-[#0d1218]" value="1-10">1-10 members</option>
                                        <option className="bg-[#0d1218]" value="11-50">11-50 members</option>
                                        <option className="bg-[#0d1218]" value="51+">50+ members</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                        <span className="material-symbols-outlined text-sm">expand_more</span>
                                    </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">What are you currently using for secrets?</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {[
                                            { id: 'env', label: '.env Files' },
                                            { id: 'github', label: 'GitHub Secrets' },
                                            { id: 'nothing', label: 'Nothing' },
                                            { id: 'other', label: 'Other' },
                                        ].map((tool) => (
                                            <label 
                                                key={tool.id}
                                                className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-all group ${currentTool === tool.id ? 'border-teal-500 bg-teal-500/5' : 'border-[#1c2127] bg-[#0d1218] hover:bg-[#111820]'}`}
                                            >
                                                <input 
                                                    className="appearance-none w-4 h-4 rounded-full border border-slate-600 checked:border-teal-500 checked:bg-teal-500 transition-all" 
                                                    name="secrets-tool" 
                                                    type="radio" 
                                                    value={tool.id}
                                                    checked={currentTool === tool.id}
                                                    onChange={(e) => setCurrentTool(e.target.value)}
                                                    disabled={status === 'loading'}
                                                />
                                                <span className={`text-sm font-medium transition-colors ${currentTool === tool.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>
                                                    {tool.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    {currentTool === 'other' && (
                                        <div className="pt-2 animate-in fade-in slide-in-from-top-2">
                                            <input 
                                                className="w-full rounded-xl border border-[#1c2127] bg-[#0d1218] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all outline-none" 
                                                placeholder="Please specify tool..." 
                                                type="text"
                                                value={otherTool}
                                                onChange={(e) => setOtherTool(e.target.value)}
                                                disabled={status === 'loading'}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Where did you hear about Envrypt? (Optional)</label>
                                    <textarea 
                                        className="w-full h-24 rounded-xl border border-[#1c2127] bg-[#0d1218] px-4 py-3.5 text-white placeholder:text-slate-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all resize-none outline-none" 
                                        placeholder="e.g. Twitter, Colleague, Hacker News..."
                                        value={referral}
                                        onChange={(e) => setReferral(e.target.value)}
                                        disabled={status === 'loading'}
                                    />
                                </div>
                                
                                {status === 'error' && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
                                        {message}
                                    </div>
                                )}

                                <button 
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full flex h-14 items-center justify-center gap-2 rounded-xl bg-teal-500 text-[#0a0f14] text-lg font-bold transition-all hover:bg-teal-400 hover:scale-[1.01] active:scale-[0.98] shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {status === 'loading' ? (
                                        <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                    ) : (
                                        <>
                                            Join Waitlist
                                            <span className="material-symbols-outlined font-bold">arrow_forward</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </main>
             <footer className="border-t border-[#1c2127] bg-black py-12 relative z-10 w-full">
                <div className="mx-auto max-w-[960px] px-4">
                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                        <div className="flex items-center gap-2">
                             <div className="size-6 text-teal-500">
                                <span className="material-symbols-outlined">lock</span>
                            </div>
                            <span className="text-sm font-bold tracking-widest text-slate-400 uppercase">Envrypt Secure Protocol</span>
                        </div>
                        <div className="flex gap-8 text-xs font-medium text-slate-500">
                            <Link to="/privacy" className="hover:text-teal-500 transition-colors">Privacy Policy</Link>
                            <Link to="/terms" className="hover:text-teal-500 transition-colors">Terms of Service</Link>
                        </div>
                        <p className="text-xs text-slate-600">© {new Date().getFullYear()} Envrypt. All rights encrypted.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default WaitlistPage;
