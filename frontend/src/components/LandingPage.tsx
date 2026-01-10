import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-white selection:bg-primary/30 min-h-screen">
            <Navbar />

            <main className="relative pt-32">
                <div className="binary-pattern pointer-events-none absolute inset-0 z-0 opacity-40"></div>
                <section className="relative z-10 px-4 py-10 @container">
                    <div className="mx-auto max-w-[960px]">
                        <div className="flex min-h-[520px] flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-card-dark to-black border border-white/5 p-8 text-center" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(19, 127, 236, 0.15) 0%, transparent 70%)' }}>
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-bold tracking-widest text-primary uppercase">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                Security Protocol Active
                            </div>
                            <h1 className="mb-4 text-5xl font-black leading-tight tracking-[-0.04em] md:text-7xl">
                                <span className="text-primary">Env</span>rypt
                            </h1>
                            <h2 className="mb-10 max-w-lg text-lg font-normal text-white/60 md:text-xl">
                                Secure Secrets Management for Teams. <span className="text-white font-medium">Stop pasting API keys.</span> Shared encryption for modern development teams.
                            </h2>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button onClick={() => navigate('/signup')} className="flex h-14 min-w-[200px] cursor-pointer items-center justify-center rounded-xl bg-primary px-8 text-lg font-bold transition-all hover:scale-105 glow-shadow">
                                    Get Started
                                </button>
                                <button className="flex h-14 min-w-[200px] cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 text-lg font-bold backdrop-blur-sm transition-all hover:bg-white/10">
                                    View Architecture
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="relative z-10 px-4 py-12">
                    <div className="mx-auto max-w-[960px]">
                        <div className="group relative overflow-hidden rounded-3xl border border-primary/20 bg-card-dark/40 p-1 md:p-1.5 glow-border">
                            <div className="relative flex flex-col md:flex-row items-center gap-10 rounded-[calc(1.5rem-2px)] bg-black/80 px-8 py-12 md:px-16 overflow-hidden">
                                <div className="relative flex shrink-0 items-center justify-center">
                                    <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full"></div>
                                    <div className="relative z-10 flex size-32 items-center justify-center rounded-full border-2 border-primary/30 bg-black/50 text-primary">
                                        <span className="material-symbols-outlined text-6xl">shield_person</span>
                                        <div className="absolute inset-0 animate-pulse rounded-full border border-primary/40 scale-125"></div>
                                        <div className="absolute inset-0 animate-ping rounded-full border border-primary/20 scale-150 opacity-20"></div>
                                    </div>
                                    <div className="absolute top-0 right-0 flex size-10 items-center justify-center rounded-lg border border-primary/40 bg-black text-primary glow-shadow">
                                        <span className="material-symbols-outlined text-xl">dns</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 text-center md:text-left">
                                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary text-glow">Hybrid Architecture</div>
                                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Segregated Security Model</h2>
                                    <p className="text-lg text-white/60 max-w-xl">
                                        We use a <strong>Hybrid Model</strong> to protect your secrets. Only the <strong>Backend (FastAPI)</strong> holds the decryption keys in memory. The <strong>Database (Supabase)</strong> only ever sees "gibberish" (ciphertext). An attacker must compromise both systems simultaneously to steal anything.
                                    </p>
                                    <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-4">
                                        <div className="flex items-center gap-2 rounded-md border border-white/5 bg-white/5 px-3 py-1.5 text-xs font-mono text-white/40">
                                            <span className="size-1.5 rounded-full bg-primary"></span> FASTAPI_ENCRYPTION_BRAIN
                                        </div>
                                        <div className="flex items-center gap-2 rounded-md border border-white/5 bg-white/5 px-3 py-1.5 text-xs font-mono text-white/40">
                                            <span className="size-1.5 rounded-full bg-primary"></span> SUPABASE_AUTH_STORE
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="relative z-10 px-4 py-12">
                    <div className="mx-auto max-w-[960px]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div className="flex flex-col gap-6">
                                <div className="inline-flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <span className="material-symbols-outlined text-3xl">hub</span>
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight md:text-4xl leading-tight">The Workflow:<br /><span className="text-primary">Write &rarr; Encrypt &rarr; Store</span></h2>
                                <p className="text-lg text-white/60">
                                    When you send a key, FastAPI encrypts it instantly. The database never sees the plaintext. When an authorized user requests it, we decrypt it on-demand for a brief window.
                                </p>
                                <ul className="flex flex-col gap-4">
                                    <li className="flex items-start gap-3 text-sm text-white/70">
                                        <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                                        <span><strong>Write:</strong> User sends key &rarr; FastAPI Encrypts &rarr; DB Stores Ciphertext.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-white/70">
                                        <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                                        <span><strong>Read:</strong> Authorized User requests &rarr; FastAPI Decrypts &rarr; User sees key.</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="relative rounded-2xl border border-white/5 bg-card-dark/80 p-8 backdrop-blur-sm overflow-hidden">
                                <div className="absolute inset-0 binary-pattern opacity-10"></div>
                                <div className="relative flex flex-col items-center gap-6">
                                    <div className="flex w-full items-center justify-between">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="size-12 rounded-lg border border-white/10 bg-black flex items-center justify-center">
                                                <span className="material-symbols-outlined text-white/40">person</span>
                                            </div>
                                            <span className="text-[10px] font-mono text-white/30 uppercase">User</span>
                                        </div>
                                        <div className="flex-1 px-4">
                                            <div className="relative h-[2px] w-full bg-gradient-to-r from-primary/0 via-primary to-primary/0">
                                                <div className="absolute -top-1 left-1/2 -translate-x-1/2 rounded-full bg-primary px-2 py-0.5 text-[8px] font-bold text-white uppercase">AES-256</div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="size-12 rounded-lg border border-white/10 bg-black flex items-center justify-center">
                                                <span className="material-symbols-outlined text-white/40">database</span>
                                            </div>
                                            <span className="text-[10px] font-mono text-white/30 uppercase">DB Store</span>
                                        </div>
                                    </div>
                                    <div className="w-full space-y-3 font-mono text-[10px]">
                                        <div className="flex justify-between text-primary/60 border-b border-primary/20 pb-1">
                                            <span>[SYSTEM PROCESS]</span>
                                            <span>ENCRYPTION_LOG</span>
                                        </div>
                                        <div className="text-white/40 break-all leading-tight">
                                            KEY: "sk_live_..." &rarr; ENCRYPTED: "0x7f3a2b..."
                                        </div>
                                        <div className="flex items-center gap-2 text-[#0bda5b]">
                                            <span className="material-symbols-outlined text-sm">verified</span>
                                            <span>STORED AS CIPHERTEXT</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="relative z-10 px-4 py-12">
                    <div className="mx-auto max-w-[960px]">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-card-dark/50 p-8 backdrop-blur-sm">
                                <p className="text-sm font-medium text-white/50 uppercase tracking-wider">Audit Logs</p>
                                <p className="text-3xl font-bold tracking-tight">100%</p>
                                <p className="flex items-center gap-1 text-sm font-bold text-[#0bda5b]">
                                    <span className="material-symbols-outlined text-sm">visibility</span> Tracked
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-card-dark/50 p-8 backdrop-blur-sm">
                                <p className="text-sm font-medium text-white/50 uppercase tracking-wider">Ephemeral Views</p>
                                <p className="text-3xl font-bold tracking-tight">30s</p>
                                <p className="flex items-center gap-1 text-sm font-bold text-[#0bda5b]">
                                    <span className="material-symbols-outlined text-sm">timer</span> Window
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-card-dark/50 p-8 backdrop-blur-sm">
                                <p className="text-sm font-medium text-white/50 uppercase tracking-wider">Encryption</p>
                                <p className="text-3xl font-bold tracking-tight">AES-256</p>
                                <p className="flex items-center gap-1 text-sm font-bold text-primary">
                                    <span className="material-symbols-outlined text-sm">lock</span> Standard
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="relative z-10 px-4 py-20">
                    <div className="mx-auto max-w-[960px]">
                        <div className="mb-12 flex flex-col gap-4">
                            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">Engineered for Security</h2>
                            <p className="max-w-2xl text-lg text-white/60 font-light">
                                Features built specifically for development teams who care about operational security.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="group flex flex-col gap-6 rounded-2xl border border-white/5 bg-card-dark p-8 transition-all hover:border-primary/50">
                                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <span className="material-symbols-outlined">history_edu</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-xl font-bold">Audit Logs</h3>
                                    <p className="text-sm leading-relaxed text-white/50">
                                        Every time a key is revealed, we log exactly who viewed it and when. Catch potential leaks instantly.
                                    </p>
                                </div>
                            </div>
                            <div className="group flex flex-col gap-6 rounded-2xl border border-white/5 bg-card-dark p-8 transition-all hover:border-primary/50">
                                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <span className="material-symbols-outlined">timer</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-xl font-bold">Ephemeral Viewing</h3>
                                    <p className="text-sm leading-relaxed text-white/50">
                                        Keys are only decrypted on-demand and shown for a short window (e.g., 30 seconds) before disappearing.
                                    </p>
                                </div>
                            </div>
                            <div className="group flex flex-col gap-6 rounded-2xl border border-white/5 bg-card-dark p-8 transition-all hover:border-primary/50">
                                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <span className="material-symbols-outlined">shield_lock</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-xl font-bold">Segregated Security</h3>
                                    <p className="text-sm leading-relaxed text-white/50">
                                        Database sees data. Backend holds keys. Separation of concerns prevents single-point compromise.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="relative z-10 px-4 py-20">
                    <div className="mx-auto max-w-[960px] overflow-hidden rounded-3xl border border-primary/20 bg-primary/5 p-8 md:p-16">
                        <div className="relative z-10 flex flex-col items-center gap-8 text-center">
                            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">Ready to secure your team's secrets?</h2>
                            <p className="max-w-xl text-lg text-white/70">
                                Create an account and start managing your API keys securely today.
                            </p>
                            <button onClick={() => navigate('/signup')} className="h-14 rounded-xl bg-primary px-10 text-lg font-bold transition-all hover:scale-105 glow-shadow cursor-pointer">
                                Create Secure Account
                            </button>
                            <div className="flex gap-4 text-xs font-medium text-white/40 uppercase tracking-widest">
                                <span>No Credit Card Required</span>
                                <span>•</span>
                                <span>Open Source</span>
                                <span>•</span>
                                <span>Team Ready</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="border-t border-white/5 bg-black py-12">
                <div className="mx-auto max-w-[960px] px-4">
                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                        <div className="flex items-center gap-2">
                            <div className="size-6 text-primary">
                                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
                                </svg>
                            </div>
                            <span className="text-sm font-bold tracking-widest text-white/50">ENVRYPT SECURE SYSTEM</span>
                        </div>
                        <div className="flex gap-8 text-xs font-medium text-white/40">
                            <a className="hover:text-primary" href="#">Privacy Policy</a>
                            <a className="hover:text-primary" href="#">Terms of Service</a>
                            <a className="hover:text-primary" href="#">Audit Log</a>
                            <a className="hover:text-primary" href="#">API</a>
                        </div>
                        <p className="text-xs text-white/20">© 2026 Envrypt. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

