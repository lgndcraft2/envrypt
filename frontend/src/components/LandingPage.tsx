import React from 'react';
import Navbar from './Navbar';

interface LandingPageProps {
    onNavigate: (page: 'landing' | 'auth', tab?: 'login' | 'signup') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-white selection:bg-primary/30 min-h-screen">
            <Navbar onNavigate={onNavigate} />

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
                                CRYPT-X
                            </h1>
                            <h2 className="mb-10 max-w-lg text-lg font-normal text-white/60 md:text-xl">
                                Let your partners know your secrets... <span className="text-white font-medium">safely.</span> High-performance, binary-grade encryption for modern communication.
                            </h2>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button className="flex h-14 min-w-[200px] cursor-pointer items-center justify-center rounded-xl bg-primary px-8 text-lg font-bold transition-all hover:scale-105 glow-shadow">
                                    Get Started
                                </button>
                                <button className="flex h-14 min-w-[200px] cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 text-lg font-bold backdrop-blur-sm transition-all hover:bg-white/10">
                                    View Docs
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
                                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary text-glow">Secure Foundation</div>
                                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Military Grade Infrastructure</h2>
                                    <p className="text-lg text-white/60 max-w-xl">
                                        Our platform is hosted on Tier-4 data centers with biometric access controls, TEMPEST-shielded hardware, and 24/7 armed monitoring. Your encrypted packets reside in a digital fortress.
                                    </p>
                                    <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-4">
                                        <div className="flex items-center gap-2 rounded-md border border-white/5 bg-white/5 px-3 py-1.5 text-xs font-mono text-white/40">
                                            <span className="size-1.5 rounded-full bg-primary"></span> DC-ZONE_ALPHA
                                        </div>
                                        <div className="flex items-center gap-2 rounded-md border border-white/5 bg-white/5 px-3 py-1.5 text-xs font-mono text-white/40">
                                            <span className="size-1.5 rounded-full bg-primary"></span> ISO-27001_COMPLIANT
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
                                <h2 className="text-3xl font-bold tracking-tight md:text-4xl leading-tight">Transmission Protocol:<br /><span className="text-primary">TLS 1.3 + AES-GCM</span></h2>
                                <p className="text-lg text-white/60">
                                    Beyond standard E2EE, we employ Perfect Forward Secrecy (PFS) via Elliptic Curve Diffie-Hellman (ECDHE). Every message exchange generates a unique session key that is instantly purged upon completion.
                                </p>
                                <ul className="flex flex-col gap-4">
                                    <li className="flex items-start gap-3 text-sm text-white/70">
                                        <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                                        <span>Zero-latency handshake for immediate secure tunneling.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-white/70">
                                        <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                                        <span>Quantum-resistant key encapsulation mechanisms (Ready).</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="relative rounded-2xl border border-white/5 bg-card-dark/80 p-8 backdrop-blur-sm overflow-hidden">
                                <div className="absolute inset-0 binary-pattern opacity-10"></div>
                                <div className="relative flex flex-col items-center gap-6">
                                    <div className="flex w-full items-center justify-between">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="size-12 rounded-lg border border-white/10 bg-black flex items-center justify-center">
                                                <span className="material-symbols-outlined text-white/40">terminal</span>
                                            </div>
                                            <span className="text-[10px] font-mono text-white/30 uppercase">Client A</span>
                                        </div>
                                        <div className="flex-1 px-4">
                                            <div className="relative h-[2px] w-full bg-gradient-to-r from-primary/0 via-primary to-primary/0">
                                                <div className="absolute -top-1 left-1/2 -translate-x-1/2 rounded-full bg-primary px-2 py-0.5 text-[8px] font-bold text-white uppercase">Encrypted</div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="size-12 rounded-lg border border-white/10 bg-black flex items-center justify-center">
                                                <span className="material-symbols-outlined text-white/40">terminal</span>
                                            </div>
                                            <span className="text-[10px] font-mono text-white/30 uppercase">Client B</span>
                                        </div>
                                    </div>
                                    <div className="w-full space-y-3 font-mono text-[10px]">
                                        <div className="flex justify-between text-primary/60 border-b border-primary/20 pb-1">
                                            <span>[SYSTEM LOG]</span>
                                            <span>SECURE_PIPE_OPEN</span>
                                        </div>
                                        <div className="text-white/40 break-all leading-tight">
                                            01001000 01100101 01101100 01101100 01101111 00101101 01010100 01001100 01010011 00101101 00110001 00101110 00110011
                                        </div>
                                        <div className="flex items-center gap-2 text-[#0bda5b]">
                                            <span className="material-symbols-outlined text-sm">verified</span>
                                            <span>HANDSHAKE VERIFIED: ECDHE_RSA_WITH_AES_256_GCM_SHA384</span>
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
                                <p className="text-sm font-medium text-white/50 uppercase tracking-wider">Secrets Shared</p>
                                <p className="text-3xl font-bold tracking-tight">1.2M+</p>
                                <p className="flex items-center gap-1 text-sm font-bold text-[#0bda5b]">
                                    <span className="material-symbols-outlined text-sm">trending_up</span> +12.4%
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-card-dark/50 p-8 backdrop-blur-sm">
                                <p className="text-sm font-medium text-white/50 uppercase tracking-wider">Active Nodes</p>
                                <p className="text-3xl font-bold tracking-tight">500K+</p>
                                <p className="flex items-center gap-1 text-sm font-bold text-[#0bda5b]">
                                    <span className="material-symbols-outlined text-sm">trending_up</span> +5.2%
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-card-dark/50 p-8 backdrop-blur-sm">
                                <p className="text-sm font-medium text-white/50 uppercase tracking-wider">Audits</p>
                                <p className="text-3xl font-bold tracking-tight">Real-Time</p>
                                <p className="flex items-center gap-1 text-sm font-bold text-primary">
                                    <span className="material-symbols-outlined text-sm">verified</span> Verified
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="relative z-10 px-4 py-20">
                    <div className="mx-auto max-w-[960px]">
                        <div className="mb-12 flex flex-col gap-4">
                            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">Engineered for Paranoia</h2>
                            <p className="max-w-2xl text-lg text-white/60 font-light">
                                Our zero-trust architecture ensures that your data remains yours alone. No backdoors, no logs, no compromises.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="group flex flex-col gap-6 rounded-2xl border border-white/5 bg-card-dark p-8 transition-all hover:border-primary/50">
                                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <span className="material-symbols-outlined">lock</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-xl font-bold">End-to-End Encryption</h3>
                                    <p className="text-sm leading-relaxed text-white/50">
                                        AES-256-GCM encryption happens directly in your browser. We never see your plaintext data.
                                    </p>
                                </div>
                            </div>
                            <div className="group flex flex-col gap-6 rounded-2xl border border-white/5 bg-card-dark p-8 transition-all hover:border-primary/50">
                                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <span className="material-symbols-outlined">auto_delete</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-xl font-bold">Self-Destructing</h3>
                                    <p className="text-sm leading-relaxed text-white/50">
                                        Links automatically vaporize after the first read or a set timer. Data is wiped from RAM instantly.
                                    </p>
                                </div>
                            </div>
                            <div className="group flex flex-col gap-6 rounded-2xl border border-white/5 bg-card-dark p-8 transition-all hover:border-primary/50">
                                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <span className="material-symbols-outlined">shield_with_heart</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-xl font-bold">Zero-Knowledge</h3>
                                    <p className="text-sm leading-relaxed text-white/50">
                                        We hold no keys. Even under subpoena, we cannot decrypt your secrets because we simply don't have access.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="relative z-10 px-4 py-20">
                    <div className="mx-auto max-w-[960px] overflow-hidden rounded-3xl border border-primary/20 bg-primary/5 p-8 md:p-16">
                        <div className="relative z-10 flex flex-col items-center gap-8 text-center">
                            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">Ready to secure your communication?</h2>
                            <p className="max-w-xl text-lg text-white/70">
                                Join the elite circle of users who trust CRYPT-X for their most sensitive operational intelligence.
                            </p>
                            <button className="h-14 rounded-xl bg-primary px-10 text-lg font-bold transition-all hover:scale-105 glow-shadow cursor-pointer">
                                Create Secure Account
                            </button>
                            <div className="flex gap-4 text-xs font-medium text-white/40 uppercase tracking-widest">
                                <span>No Credit Card Required</span>
                                <span>•</span>
                                <span>Open Source</span>
                                <span>•</span>
                                <span>GDPR Compliant</span>
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
                            <span className="text-sm font-bold tracking-widest text-white/50">CRYPT-X SECURE SYSTEM</span>
                        </div>
                        <div className="flex gap-8 text-xs font-medium text-white/40">
                            <a className="hover:text-primary" href="#">Privacy Policy</a>
                            <a className="hover:text-primary" href="#">Terms of Service</a>
                            <a className="hover:text-primary" href="#">Audit Log</a>
                            <a className="hover:text-primary" href="#">API</a>
                        </div>
                        <p className="text-xs text-white/20">© 2024 Crypt-X Protocol. All rights encrypted.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
