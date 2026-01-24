import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext, Link } from 'react-router-dom';
import HeaderProfileDropdown from './HeaderProfileDropdown';
import { api } from '../lib/api';

interface Secret {
    id: string;
    key: string;
    value: string; // Decrypted value
    version: number;
}

interface Vault {
    id: string;
    name: string;
    team_id: string;
}

const VaultDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { setIsMobileMenuOpen } = useOutletContext<any>();

    const [vault, setVault] = useState<Vault | null>(null);
    const [secrets, setSecrets] = useState<Secret[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Add Secret State
    const [isAddSecretOpen, setIsAddSecretOpen] = useState(false);
    const [addMode, setAddMode] = useState<'single' | 'bulk'>('single');
    const [newKey, setNewKey] = useState('');
    const [newValue, setNewValue] = useState('');
    const [bulkContent, setBulkContent] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    // Visible Secret ID (for ephemeral viewing or just toggling visibility if we implemented that, 
    // but here we already decrypt on fetch, so maybe we mask them by default in UI?)
    // For MVP, let's show them masked and toggle on click? 
    // Or just show them as stars and click to copy/reveal.
    const [revealedSecrets, setRevealedSecrets] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    const fetchData = async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            // Parallel fetch
            const [vaultData, secretsData] = await Promise.all([
                api.get<Vault>(`/vaults/${id}`),
                api.get<Secret[]>(`/vaults/${id}/secrets`)
            ]);
            setVault(vaultData);
            setSecrets(secretsData);
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddSecret = async () => {
        if (!newKey.trim() || !newValue || !id) return;
        setIsAdding(true);
        try {
            await api.post('/secrets', {
                vault_id: id,
                key: newKey,
                value: newValue
            });
            setNewKey('');
            setNewValue('');
            setIsAddSecretOpen(false);
            fetchData(); // Refresh list
        } catch (err) {
            console.error('Failed to add secret:', err);
        } finally {
            setIsAdding(false);
        }
    };

    const handleFormatBulk = () => {
        const lines = bulkContent.split('\n');
        const parsed = lines
            .map(line => {
                const trimmed = line.trim();
                // Basic env parsing: KEY=VALUE or KEY="VALUE"
                if (!trimmed || trimmed.startsWith('#')) return null;
                const idx = trimmed.indexOf('=');
                if (idx === -1) return null;
                
                const key = trimmed.slice(0, idx).trim().toUpperCase();
                let value = trimmed.slice(idx + 1).trim();
                
                // Remove surrounding quotes if matching
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                
                return { key, value };
            })
            .filter((item): item is { key: string, value: string } => item !== null);
        
        // Sort by key
        parsed.sort((a, b) => a.key.localeCompare(b.key));
        
        // Reconstruct
        const formatted = parsed.map(p => `${p.key}=${p.value}`).join('\n');
        setBulkContent(formatted);
    };

    const handleBulkAddSecret = async () => {
        if (!bulkContent.trim() || !id) return;
        
        const lines = bulkContent.split('\n');
        const secretsToAdd: { key: string, value: string }[] = [];
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            
            const idx = trimmed.indexOf('=');
            if (idx !== -1) {
                const key = trimmed.slice(0, idx).trim().toUpperCase();
                let value = trimmed.slice(idx + 1).trim();
                
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                
                if (key) secretsToAdd.push({ key, value });
            }
        }

        if (secretsToAdd.length === 0) return;

        setIsAdding(true);
        try {
            await Promise.all(secretsToAdd.map(s => 
                api.post('/secrets', {
                    vault_id: id,
                    key: s.key,
                    value: s.value
                }).catch(err => {
                    console.error(`Failed to add secret ${s.key}:`, err);
                    // Continue with others
                    return null;
                })
            ));
            
            setBulkContent('');
            setIsAddSecretOpen(false);
            setAddMode('single');
            fetchData();
        } catch (err) {
            console.error('Failed to add bulk secrets:', err);
        } finally {
            setIsAdding(false);
        }
    };

    const toggleReveal = (secretId: string) => {
        const newSet = new Set(revealedSecrets);
        if (newSet.has(secretId)) {
            newSet.delete(secretId);
        } else {
            newSet.add(secretId);
        }
        setRevealedSecrets(newSet);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Show toast?
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_#111820_0%,_#0a0f14_60%)] h-full relative items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-primary text-4xl">donut_large</span>
            </div>
        );
    }

    if (!vault) {
        return (
            <div className="flex-1 p-8 text-center text-slate-500">
                Vault not found.
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_#111820_0%,_#0a0f14_60%)] h-full relative">
            <header className="h-20 border-b border-[#1c2127] flex items-center justify-between px-4 md:px-8 shrink-0 bg-[#0a0f14]/80 backdrop-blur-md sticky top-0 z-20 gap-4">
                <div className="flex items-center gap-3">
                    <button
                        className="md:hidden text-slate-400 hover:text-white"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-0.5 font-mono">
                            <Link to="/vaults" className="hover:text-primary transition-colors">Vaults</Link>
                            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                            <span className="text-primary">{vault.name}</span>
                        </div>
                        <h2 className="text-lg md:text-2xl font-bold text-white tracking-tight">{vault.name}</h2>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsAddSecretOpen(true)}
                        className="bg-primary hover:bg-primary/90 text-white text-xs font-bold px-5 py-2.5 rounded flex items-center gap-2 transition-all glow-primary uppercase tracking-wider"
                    >
                        <span className="material-symbols-outlined text-sm">add</span>
                        <span className="hidden md:inline">Add Secret</span>
                        <span className="md:hidden">Add</span>
                    </button>
                    <HeaderProfileDropdown />
                </div>
            </header>

            <div className="p-4 md:p-8">
                {/* Secrets Table */}
                <div className="bg-[#111820] border border-[#1c2127] rounded-lg overflow-hidden relative tech-border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#1c2127] bg-slate-900/40">
                                    <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold w-1/3">Key</th>
                                    <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold w-1/3">Value</th>
                                    <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold">Version</th>
                                    <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1c2127]">
                                {secrets.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                            No secrets in this vault yet.
                                        </td>
                                    </tr>
                                )}
                                {secrets.map(secret => (
                                    <tr key={secret.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 max-w-[200px] sm:max-w-[300px]">
                                            <div className="font-mono text-sm text-primary font-bold truncate" title={secret.key}>
                                                {secret.key}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div 
                                                    className="font-mono text-sm text-slate-300 bg-black/30 px-2 py-1 rounded border border-white/5 min-w-[120px] max-w-[200px] sm:max-w-[400px] truncate"
                                                    title={revealedSecrets.has(secret.id) ? secret.value : undefined}
                                                >
                                                    {revealedSecrets.has(secret.id) ? secret.value : '••••••••••••••••'}
                                                </div>
                                                <button
                                                    onClick={() => toggleReveal(secret.id)}
                                                    className="text-slate-500 hover:text-white transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-sm">
                                                        {revealedSecrets.has(secret.id) ? 'visibility_off' : 'visibility'}
                                                    </span>
                                                </button>
                                                <button
                                                    onClick={() => copyToClipboard(secret.value)}
                                                    className="text-slate-500 hover:text-primary transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-sm">content_copy</span>
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-0.5 rounded bg-slate-800 border border-white/5 text-[10px] font-mono text-slate-400">v{secret.version}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-500 hover:text-white transition-colors p-1">
                                                <span className="material-symbols-outlined text-lg">more_horiz</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Secret Modal */}
            {isAddSecretOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]">
                    <div className="max-w-md w-full bg-[#0d1218] border border-[#1c2127] rounded-2xl glow-modal overflow-hidden p-6 tech-border">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-white">Add Secrets</h3>
                            <div className="flex bg-[#111820] rounded-lg p-1 border border-[#1c2127]">
                                <button
                                    onClick={() => setAddMode('single')}
                                    className={`px-3 py-1 text-xs font-bold rounded transition-colors ${addMode === 'single' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
                                >
                                    Single
                                </button>
                                <button
                                    onClick={() => setAddMode('bulk')}
                                    className={`px-3 py-1 text-xs font-bold rounded transition-colors ${addMode === 'bulk' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
                                >
                                    Bulk
                                </button>
                            </div>
                        </div>

                        {addMode === 'single' ? (
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-2">Key</label>
                                    <input
                                        className="w-full bg-[#111820] border border-[#1c2127] rounded-lg px-4 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none font-mono placeholder:text-slate-700"
                                        placeholder="e.g. DATABASE_URL"
                                        value={newKey}
                                        onChange={e => setNewKey(e.target.value.toUpperCase())}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-2">Value</label>
                                    <textarea
                                        className="w-full bg-[#111820] border border-[#1c2127] rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none font-mono placeholder:text-slate-700 min-h-[100px]"
                                        placeholder="Enter secret value..."
                                        value={newValue}
                                        onChange={e => setNewValue(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 mb-6">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-mono">Bulk Secrets</label>
                                        <button 
                                            onClick={handleFormatBulk}
                                            className="text-[10px] text-primary hover:text-white transition-colors uppercase tracking-wider font-bold flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-[10px]">sort</span> Format & Sort
                                        </button>
                                    </div>
                                    <textarea
                                        className="w-full bg-[#111820] border border-[#1c2127] rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none font-mono placeholder:text-slate-700 min-h-[200px] text-xs leading-relaxed"
                                        placeholder="KEY=VALUE&#10;ANOTHER_KEY=value"
                                        value={bulkContent}
                                        onChange={e => setBulkContent(e.target.value)}
                                    ></textarea>
                                    <p className="text-[10px] text-slate-500">Paste your .env content here. Keys are separated by =. One secret per line.</p>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsAddSecretOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                            {addMode === 'single' ? (
                                <button onClick={handleAddSecret} disabled={!newKey || !newValue || isAdding} className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded font-bold disabled:opacity-50">
                                    {isAdding ? 'Adding...' : 'Add Secret'}
                                </button>
                            ) : (
                                <button onClick={handleBulkAddSecret} disabled={!bulkContent.trim() || isAdding} className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded font-bold disabled:opacity-50">
                                    {isAdding ? 'Adding...' : 'Add Secrets'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VaultDetail;
