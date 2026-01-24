import React, { useState, useEffect } from 'react';
import HeaderProfileDropdown from './HeaderProfileDropdown';
import { useTeam } from '../contexts/TeamContext';
import { api } from '../lib/api';

interface Member {
    user_id: string;
    role: string;
    joined_at: string;
    email: string;
    name: string;
    avatar?: string;
}

const TeamSettings: React.FC = () => {
    const { activeTeam, refreshTeams } = useTeam();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'general' | 'members' | 'billing' | 'danger'>('general');

    const [members, setMembers] = useState<Member[]>([]);
    const [teamName, setTeamName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);

    const role = activeTeam?.role?.toUpperCase();
    const isAdmin = role === 'OWNER' || role === 'ADMIN';

    useEffect(() => {
        if (activeTeam) {
            setTeamName(activeTeam.name);
            fetchMembers();
        }
    }, [activeTeam]);

    const fetchMembers = async () => {
        if (!activeTeam) return;
        try {
            const data = await api.get<Member[]>(`/auth/teams/${activeTeam.id}/members`);
            setMembers(data);
        } catch (error) {
            console.error('Failed to fetch members:', error);
        }
    };

    const handleUpdateTeam = async () => {
        if (!activeTeam) return;
        setIsSaving(true);
        try {
            await api.put(`/auth/teams/${activeTeam.id}`, { name: teamName });
            await refreshTeams();
            // Optional: sleek notification instead of alert
            // alert('Team updated successfully');
        } catch (error) {
            alert('Failed to update team');
        } finally {
            setIsSaving(false);
        }
    };

    const handleRoleChange = (id: string, newRole: string) => {
        // Future implementation: API call to update role
        console.log("Change role", id, newRole);
    };

    const handleDeleteMember = async (id: string) => {
        if (!activeTeam) return;
        if (confirm('Are you sure you want to remove this member?')) {
            setDeletingMemberId(id);
             try {
                await api.delete(`/auth/teams/${activeTeam.id}/members/${id}`);
                setMembers(members.filter(m => m.user_id !== id));
            } catch (error) {
                alert('Failed to remove member');
            } finally {
                setDeletingMemberId(null);
            }
        }
    };

    const renderGeneral = () => (
        <div className="flex-1 overflow-y-auto p-12 max-w-4xl">
            <section className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                    <span className="h-1 w-1 bg-primary rounded-full"></span>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Team Identity</h3>
                </div>
                <div className="bg-[#111820]/40 border border-[#1c2127] rounded-lg p-8 space-y-8">
                    <div className="flex items-center gap-8">
                        <div className="relative group">
                            <div className="h-24 w-24 rounded bg-slate-800 border border-[#1c2127] flex items-center justify-center overflow-hidden relative">
                                <div className="h-12 w-12 rounded bg-primary/20 flex items-center justify-center font-bold text-2xl text-primary">
                                    {(teamName || 'T').substring(0, 2).toUpperCase()}
                                </div>
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                    <span className="material-symbols-outlined text-white">photo_camera</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Team Name</label>
                                <input 
                                    className="w-full bg-black/40 border border-[#1c2127] rounded text-sm py-2.5 px-4 text-slate-200 focus:ring-1 focus:ring-primary focus:border-primary placeholder-slate-700 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                                    type="text" 
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    disabled={!isAdmin}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Team ID (Read-only)</label>
                                <div className="font-mono text-xs text-slate-500 px-1">{activeTeam?.id}</div>
                            </div>
                        </div>
                    </div>
                    {isAdmin && (
                        <div className="pt-4 border-t border-[#1c2127]/50 flex justify-end">
                            <button 
                                onClick={handleUpdateTeam}
                                disabled={isSaving}
                                className="bg-primary hover:bg-blue-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-[10px] font-bold py-2 px-6 rounded uppercase tracking-widest transition-colors shadow-lg shadow-primary/10 flex items-center gap-2"
                            >
                                {isSaving ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin text-sm">donut_large</span>
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </section>
            <section className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                    <span className="h-1 w-1 bg-primary rounded-full"></span>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Team Invite Code</h3>
                </div>
                <div className="bg-[#111820]/40 border border-[#1c2127] rounded-lg p-8">
                    <p className="text-xs text-slate-400 mb-6 leading-relaxed max-w-lg">
                        Use this code to invite new operators to your high-security environment.
                        <span className="text-primary ml-1">Share this ID securely.</span>
                    </p>
                    <div className="flex items-stretch gap-4">
                        <div className="flex-1 bg-black p-6 rounded border border-primary/20 flex items-center justify-center font-mono text-xl font-bold text-primary tracking-[0.1em] glow-primary truncate" title={activeTeam?.id}>
                            {activeTeam?.id}
                        </div>
                        <div className="flex flex-col gap-2">
                            <button 
                                onClick={() => { navigator.clipboard.writeText(activeTeam?.id || ''); alert('Copied!'); }}
                                className="flex-1 px-4 bg-slate-800 hover:bg-slate-700 border border-[#1c2127] rounded flex items-center justify-center transition-colors group" 
                                title="Copy Code"
                            >
                                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">content_copy</span>
                            </button>
                            <button className="flex-1 px-4 bg-slate-800 hover:bg-slate-700 border border-[#1c2127] rounded flex items-center justify-center transition-colors group" title="Rotate Code">
                                <span className="material-symbols-outlined text-slate-400 group-hover:text-[#22c55e] transition-colors">sync</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );

    const renderBilling = () => (
        <div className="flex-1 overflow-y-auto p-12 max-w-4xl">
            <section className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                    <span className="h-1 w-1 bg-primary rounded-full"></span>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Current Plan</h3>
                </div>
                <div className="bg-[#111820]/40 border border-[#1c2127] rounded-lg p-8">
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <h4 className="text-2xl font-bold text-white mb-2">Pro Plan</h4>
                            <p className="text-slate-400 text-sm">$29/month per member, billed annually</p>
                        </div>
                        <span className="px-3 py-1 bg-primary/20 text-primary border border-primary/50 rounded text-[10px] font-bold uppercase tracking-widest">Active</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-4 bg-black/40 border border-[#1c2127] rounded">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Seats Used</div>
                            <div className="text-xl font-mono text-white">4 / 10</div>
                            <div className="w-full bg-slate-800 h-1 mt-3 rounded-full overflow-hidden">
                                <div className="bg-primary h-full w-[40%]"></div>
                            </div>
                        </div>
                        <div className="p-4 bg-black/40 border border-[#1c2127] rounded">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Storage</div>
                            <div className="text-xl font-mono text-white">45 GB / 100 GB</div>
                            <div className="w-full bg-slate-800 h-1 mt-3 rounded-full overflow-hidden">
                                <div className="bg-blue-400 h-full w-[45%]"></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button className="bg-white text-black hover:bg-slate-200 text-xs font-bold py-2 px-4 rounded uppercase tracking-widest transition-colors">Upgrade Plan</button>
                        <button className="text-slate-400 hover:text-white text-xs font-bold py-2 px-4 uppercase tracking-widest transition-colors">Manage Payment Method</button>
                    </div>
                </div>
            </section>
            <section>
                <div className="flex items-center gap-2 mb-6">
                    <span className="h-1 w-1 bg-primary rounded-full"></span>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Invoices</h3>
                </div>
                <div className="bg-[#111820]/40 border border-[#1c2127] rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-[#0d1218] border-b border-[#1c2127]">
                            <tr>
                                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-tighter">Date</th>
                                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-tighter">Amount</th>
                                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-tighter">Status</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1c2127]/50">
                            <tr>
                                <td className="px-6 py-4 font-mono text-slate-300">Oct 01, 2024</td>
                                <td className="px-6 py-4 font-mono text-white">$116.00</td>
                                <td className="px-6 py-4"><span className="text-[#22c55e] flex items-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span> Paid</span></td>
                                <td className="px-6 py-4 text-right"><button className="text-primary hover:text-blue-400 flex items-center gap-1 justify-end ml-auto"><span className="material-symbols-outlined text-sm">download</span> PDF</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );

    const renderDanger = () => (
        <div className="flex-1 overflow-y-auto p-12 max-w-4xl">
            <section>
                <div className="flex items-center gap-2 mb-6">
                    <span className="h-1 w-1 bg-[#ef4444] rounded-full"></span>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Danger Zone</h3>
                </div>
                <div className="border border-[#ef4444]/30 bg-[#ef4444]/5 rounded-lg p-8 flex items-center justify-between gap-12">
                    <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-100">Delete this Team</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Once you delete a team, there is no going back. All vaults, secrets, and audit logs associated with <span className="text-slate-300 font-bold">Acme Corp</span> will be permanently purged from the forensic ledger.
                        </p>
                    </div>
                    <button className="shrink-0 bg-[#ef4444]/10 hover:bg-[#ef4444] border border-[#ef4444]/50 text-[#ef4444] hover:text-white text-[10px] font-bold py-3 px-8 rounded uppercase tracking-widest transition-all duration-200">
                        Delete Team
                    </button>
                </div>
            </section>
        </div>
    );

    const renderMembersTable = () => (
        <div className="flex-1 overflow-auto bg-[#111820]/20 w-full">
            <table className="w-full border-collapse text-xs text-left">
                <thead className="sticky top-0 bg-[#0d1218] border-b border-[#1c2127] z-10">
                    <tr>
                        <th className="px-8 py-4 font-bold text-slate-500 uppercase tracking-tighter">Member</th>
                        <th className="px-8 py-4 font-bold text-slate-500 uppercase tracking-tighter w-48">Role</th>
                        <th className="px-8 py-4 font-bold text-slate-500 uppercase tracking-tighter w-40">Joined Date</th>
                        <th className="px-8 py-4 w-16"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#1c2127]/50">
                    {members.map(member => (
                        <tr key={member.user_id} className="hover:bg-primary/5 transition-colors group">
                            <td className="px-8 py-5">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg border border-[#1c2127] bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                                        {(member.name || member.email || 'U').substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-white tracking-tight">{member.name || 'Unknown'}</span>
                                            <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider border ${
                                                member.role === 'OWNER' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                                                member.role === 'ADMIN' ? 'bg-primary/10 text-primary border-primary/20' : 
                                                'bg-slate-800 text-slate-400 border-slate-700'
                                            }`}>
                                                {member.role}
                                            </span>
                                        </div>
                                        <span className="text-[11px] text-slate-500 font-mono">{member.email}</span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-5">
                                {isAdmin && member.role !== 'OWNER' ? (
                                    <div className="relative w-full max-w-[140px]">
                                        <select
                                            value={member.role}
                                            onChange={(e) => handleRoleChange(member.user_id, e.target.value)}
                                            className="w-full bg-slate-900 border border-[#1c2127] text-[10px] font-bold text-primary rounded px-2 py-1.5 appearance-none focus:ring-1 focus:ring-primary uppercase tracking-widest outline-none cursor-pointer"
                                        >
                                            <option value="ADMIN">Admin</option>
                                            <option value="MEMBER">Member</option>
                                            <option value="OBSERVER">Observer</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-sm pointer-events-none text-primary/50">expand_more</span>
                                    </div>
                                ) : (
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 py-1.5 border border-transparent">
                                        {member.role}
                                    </span>
                                )}
                            </td>
                            <td className="px-8 py-5 text-slate-400 font-mono">
                                {new Date(member.joined_at).toLocaleDateString()}
                            </td>
                            <td className="px-8 py-5 text-right">
                                {isAdmin && (
                                    <button
                                        onClick={() => handleDeleteMember(member.user_id)}
                                        disabled={deletingMemberId === member.user_id}
                                        className="text-slate-600 hover:text-[#ef4444] transition-colors disabled:opacity-50 disabled:cursor-wait"
                                    >
                                        {deletingMemberId === member.user_id ? (
                                            <span className="material-symbols-outlined text-lg animate-spin">refresh</span>
                                        ) : (
                                            <span className="material-symbols-outlined text-lg">delete</span>
                                        )}
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'general': return renderGeneral();
            case 'billing': return renderBilling();
            case 'danger': return renderDanger();
            case 'members': return (
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    {renderMembersTable()}
                </div>
            );
            default: return null;
        }
    };

    return (
        <div className="bg-background-dark font-display text-slate-300 overflow-hidden h-full w-full flex flex-col">
            {/* Sidebar removed */}

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[radial-gradient(circle_at_top_right,_#111820_0%,_#0a0f14_40%)]">
                <header className="h-20 border-b border-[#1c2127] flex items-center justify-between px-4 md:px-8 shrink-0 relative">
                    <div className="flex items-center gap-3">
                        <button
                            className="md:hidden text-slate-400 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-500 mb-0.5 font-mono">
                                <span>{activeTab === 'general' ? 'Acme Corp' : 'Settings'}</span>
                                <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                                <span className="text-primary font-bold">
                                    {activeTab === 'general' ? 'Settings' :
                                        activeTab === 'members' ? 'Team Members' :
                                            activeTab === 'billing' ? 'Billing' : 'Danger Zone'}
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight">
                                {activeTab === 'general' ? 'Team Management' :
                                    activeTab === 'members' ? `Team Members (${members.length}/10)` :
                                        activeTab === 'billing' ? 'Plan & Billing' : 'Danger Zone'}
                            </h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {activeTab === 'members' && isAdmin && (
                            <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded text-xs font-bold uppercase tracking-widest glow-primary transition-all">
                                <span className="material-symbols-outlined text-sm">person_add</span>
                                Invite New
                            </button>
                        )}
                        <HeaderProfileDropdown />
                    </div>
                </header>

                <div className="flex flex-1 overflow-hidden">
                    {/* Integrated Sidebar Navigation for Settings */}
                    <aside className="w-64 border-r border-[#1c2127]/50 p-6 space-y-2 shrink-0 hidden md:block">
                        <button onClick={() => setActiveTab('general')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded text-sm font-medium transition-colors ${activeTab === 'general' ? 'bg-white/5 text-primary border border-primary/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
                            <span className="material-symbols-outlined text-lg">tune</span>
                            General
                        </button>
                        <button onClick={() => setActiveTab('members')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded text-sm font-medium transition-colors ${activeTab === 'members' ? 'bg-white/5 text-primary border border-primary/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
                            <span className="material-symbols-outlined text-lg">group</span>
                            Members
                        </button>
                        {isAdmin && (
                            <>
                                <button onClick={() => setActiveTab('billing')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded text-sm font-medium transition-colors ${activeTab === 'billing' ? 'bg-white/5 text-primary border border-primary/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
                                    <span className="material-symbols-outlined text-lg">credit_card</span>
                                    Billing
                                </button>
                                <button onClick={() => setActiveTab('danger')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded text-sm font-medium mt-8 transition-colors ${activeTab === 'danger' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'text-[#ef4444]/70 hover:text-[#ef4444] hover:bg-red-500/5'}`}>
                                    <span className="material-symbols-outlined text-lg">warning</span>
                                    Danger Zone
                                </button>
                            </>
                        )}
                    </aside>

                    {/* Content Area */}
                    {renderContent()}
                </div>

                {/* Footer Section - Conditional */}
                {activeTab === 'general' && (
                    <footer className="h-10 border-t border-[#1c2127] bg-[#111820] px-6 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                                <span>System Status: Optimal</span>
                            </div>
                            <div>Node ID: US-EAST-1A-042</div>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500">
                            <span>© 2024 ENVRYPT FORENSICS UNIT</span>
                        </div>
                    </footer>
                )}
                {activeTab === 'members' && (
                    <footer className="h-12 border-t border-[#1c2127] bg-[#111820] px-8 flex items-center justify-between shrink-0 font-mono hidden md:flex">
                        <div className="flex items-center gap-4 text-[10px] text-slate-500 uppercase">
                            <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                                <span>Team Seat Usage: {members.length * 10}%</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 text-[10px] text-slate-500 uppercase">
                            <div className="flex gap-4">
                                <button className="hover:text-primary transition-colors disabled:opacity-30" disabled>Previous</button>
                                <span className="text-slate-300">Page 1 of 1</span>
                                <button className="hover:text-primary transition-colors disabled:opacity-30" disabled>Next</button>
                            </div>
                        </div>
                    </footer>
                )}
            </main>
        </div>
    );
};

export default TeamSettings;
