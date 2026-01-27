import React, { useState, useEffect, useRef } from 'react';
import { useParams, useOutletContext, Link } from 'react-router-dom';
import HeaderProfileDropdown from './HeaderProfileDropdown';
import { api } from '../lib/api';

interface Secret {
    id: string;
    key: string;
    value: string | null; // Value is null until revealed
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

    // Edit Secret State
    const [editingSecret, setEditingSecret] = useState<Secret | null>(null);
    const [editKey, setEditKey] = useState('');
    const [editValue, setEditValue] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    // Action Menu State
    const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
    const actionMenuRef = useRef<HTMLDivElement>(null);

    // Visible Secret ID
    const [revealedSecrets, setRevealedSecrets] = useState<Set<string>>(new Set());
    const [loadingSecrets, setLoadingSecrets] = useState<Set<string>>(new Set());
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
                setActiveActionMenu(null);
            }
        };

        if (activeActionMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeActionMenu]);

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
        setErrorMessage(null);
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
        } catch (err: any) {
            console.error('Failed to add secret:', err);
            if (err.message && err.message.includes('duplicate key value')) {
                setErrorMessage('A secret with this key already exists in this vault.');
            } else {
                setErrorMessage(err.message || 'Failed to add secret.');
            }
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
                
                const key = trimmed.slice(0, idx).trim(); // Removed .toUpperCase()
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
                const key = trimmed.slice(0, idx).trim(); // Removed .toUpperCase()
                let value = trimmed.slice(idx + 1).trim();
                
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                
                if (key) secretsToAdd.push({ key, value });
            }
        }

        if (secretsToAdd.length === 0) return;

        setIsAdding(true);
        setErrorMessage(null);
        try {
            await Promise.all(secretsToAdd.map(s => 
                api.post('/secrets', {
                    vault_id: id,
                    key: s.key,
                    value: s.value
                })
            ));
            
            setBulkContent('');
            setIsAddSecretOpen(false);
            setAddMode('single');
            fetchData();
        } catch (err: any) {
            console.error('Failed to add bulk secrets:', err);
             if (err.message && err.message.includes('duplicate key value')) {
                setErrorMessage('One or more secrets already exist in this vault (duplicate key).');
            } else {
                setErrorMessage(err.message || 'Failed to add secrets.');
            }
        } finally {
            setIsAdding(false);
        }
    };

    const toggleReveal = async (secretId: string) => {
        const secretIndex = secrets.findIndex(s => s.id === secretId);
        if (secretIndex === -1) return;
        
        const secret = secrets[secretIndex];
        const newSet = new Set(revealedSecrets);
        
        if (newSet.has(secretId)) {
            newSet.delete(secretId);
            setRevealedSecrets(newSet);
        } else {
            // Need to fetch value if not present
            if (secret.value === null) {
                // Set loading state
                setLoadingSecrets(prev => new Set(prev).add(secretId));
                try {
                    const data = await api.get<{ id: string, value: string }>(`/secrets/${secretId}/reveal`);
                    // Update secret in state
                    const updatedSecrets = [...secrets];
                    updatedSecrets[secretIndex] = { ...secret, value: data.value };
                    setSecrets(updatedSecrets);
                    
                    // Now reveal
                    newSet.add(secretId);
                    setRevealedSecrets(newSet);
                } catch (err) {
                    console.error('Failed to reveal secret:', err);
                    alert('Failed to reveal secret.');
                } finally {
                    // Remove loading state
                    setLoadingSecrets(prev => {
                        const next = new Set(prev);
                        next.delete(secretId);
                        return next;
                    });
                }
            } else {
                newSet.add(secretId);
                setRevealedSecrets(newSet);
            }
        }
    };

    const copyToClipboard = async (secretId: string, value: string | null) => {
        if (value === null) {
             try {
                const data = await api.get<{ id: string, value: string }>(`/secrets/${secretId}/reveal`);
                // Update state to cache it
                const updatedSecrets = secrets.map(s => s.id === secretId ? { ...s, value: data.value } : s);
                setSecrets(updatedSecrets);
                value = data.value;
            } catch (err) {
                console.error('Failed to copy secret:', err);
                return;
            }
        }
        if (value) {
            navigator.clipboard.writeText(value);
        }
    };

    const handleDeleteSecret = async (secretId: string) => {
        if (!confirm('Are you sure you want to delete this secret?')) return;
        try {
            await api.delete(`/secrets/${secretId}`);
            setSecrets(secrets.filter(s => s.id !== secretId));
            setActiveActionMenu(null);
        } catch (err) {
            console.error('Failed to delete secret:', err);
        }
    };

    const handleUpdateSecret = async () => {
         if (!editingSecret || !editKey.trim() || !editValue) return;
         setIsUpdating(true);
         setErrorMessage(null);
         try {
             const updated = await api.patch<Secret>(`/secrets/${editingSecret.id}`, {
                 key: editKey,
                 value: editValue
             });
             
             setSecrets(secrets.map(s => s.id === editingSecret.id ? 
                 { ...s, key: updated.key, value: editValue, version: updated.version } : s
             ));
             setEditingSecret(null);
             setEditKey('');
             setEditValue('');
         } catch (err: any) {
             console.error('Failed to update secret:', err);
             if (err.message && err.message.includes('duplicate key value')) {
                setErrorMessage('A secret with this key already exists in this vault.');
            } else {
                setErrorMessage(err.message || 'Failed to update secret.');
            }
         } finally {
             setIsUpdating(false);
         }
    };

    const openEditModal = async (secret: Secret) => {
        setActiveActionMenu(null);
        setErrorMessage(null);
        
        let valueToEdit = secret.value;
        // Fetch if not available
        if (valueToEdit === null) {
             try {
                const data = await api.get<{ id: string, value: string }>(`/secrets/${secret.id}/reveal`);
                // Update cache
                const updatedSecrets = secrets.map(s => s.id === secret.id ? { ...s, value: data.value } : s);
                setSecrets(updatedSecrets);
                valueToEdit = data.value;
            } catch (err) {
                console.error('Failed to fetch secret for editing:', err);
                return;
            }
        }
        
        setEditingSecret(secret);
        setEditKey(secret.key);
        setEditValue(valueToEdit || '');
    };

    const handleDownloadEnv = async () => {
        if (!secrets.length || !vault) return;
        
        // Ensure all secrets are revealed/fetched before download? 
        // This might be heavy if there are many. 
        // Or we should have a bulk reveal endpoint? 
        // For security, maybe just fetch one by one or warn user.
        // Let's iterate and fetch missing ones.
        
        let secretsToDownload = [...secrets];
        let hasMissing = secretsToDownload.some(s => s.value === null);
        
        if (hasMissing) {
            // Ideally call a bulk reveal or loop. For now, loop.
            const confirmDownload = confirm("Downloading will reveal all secrets. This might take a moment if they are not cached. Continue?");
            if (!confirmDownload) return;
            
            // This is slow but secure-ish.
            for (let i = 0; i < secretsToDownload.length; i++) {
                if (secretsToDownload[i].value === null) {
                    try {
                        const data = await api.get<{ id: string, value: string }>(`/secrets/${secretsToDownload[i].id}/reveal`);
                        secretsToDownload[i].value = data.value;
                    } catch (e) {
                         console.error(`Failed to fetch ${secretsToDownload[i].key}`);
                    }
                }
            }
            // Update state with fetched ones
            setSecrets(secretsToDownload);
        }
        
        const envContent = secretsToDownload
            .map(s => `${s.key}=${s.value || ''}`)
            .join('\n');
            
        const blob = new Blob([envContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${vault.name.toLowerCase().replace(/\s+/g, '-')}.env`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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
                        onClick={handleDownloadEnv}
                        className="bg-[#111820] hover:bg-[#1c2127] border border-[#1c2127] text-white text-xs font-bold px-4 py-2.5 rounded flex items-center gap-2 transition-all uppercase tracking-wider"
                        title="Download as .env"
                    >
                        <span className="material-symbols-outlined text-sm">download</span>
                        <span className="hidden md:inline">.env</span>
                    </button>
                    <button
                        onClick={() => { setIsAddSecretOpen(true); setErrorMessage(null); }}
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
                    <div className="overflow-x-auto min-h-[350px]">
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
                                                    title={revealedSecrets.has(secret.id) ? (secret.value || undefined) : undefined}
                                                >
                                                    {revealedSecrets.has(secret.id) ? secret.value : '••••••••••••••••'}
                                                </div>
                                                <button
                                                    onClick={() => toggleReveal(secret.id)}
                                                    className="text-slate-500 hover:text-white transition-colors flex items-center justify-center w-5 h-5"
                                                    disabled={loadingSecrets.has(secret.id)}
                                                >
                                                    {loadingSecrets.has(secret.id) ? (
                                                        <span className="material-symbols-outlined text-sm animate-spin text-primary">progress_activity</span>
                                                    ) : (
                                                        <span className="material-symbols-outlined text-sm">
                                                            {revealedSecrets.has(secret.id) ? 'visibility_off' : 'visibility'}
                                                        </span>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => copyToClipboard(secret.id, secret.value)}
                                                    className="text-slate-500 hover:text-primary transition-colors"
                                                    title="Copy value"
                                                >
                                                    <span className="material-symbols-outlined text-sm">content_copy</span>
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-0.5 rounded bg-slate-800 border border-white/5 text-[10px] font-mono text-slate-400">v{secret.version}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="relative">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveActionMenu(activeActionMenu === secret.id ? null : secret.id);
                                                    }}
                                                    className={`text-slate-500 hover:text-white transition-colors p-1 rounded hover:bg-white/10 ${activeActionMenu === secret.id ? 'text-white bg-white/10' : ''}`}
                                                >
                                                    <span className="material-symbols-outlined text-lg">more_horiz</span>
                                                </button>
                                                {activeActionMenu === secret.id && (
                                                    <div ref={actionMenuRef} className="absolute right-0 top-full mt-1 w-32 bg-[#0d1218] border border-[#1c2127] rounded shadow-xl z-10 overflow-hidden">
                                                        <button 
                                                            onClick={() => openEditModal(secret)}
                                                            className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                                                        >
                                                            <span className="material-symbols-outlined text-xs">edit</span> Edit
                                                        </button>
                                                        <button 
                                                            onClick={() => copyToClipboard(secret.id, secret.value)}
                                                            className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                                                        >
                                                            <span className="material-symbols-outlined text-xs">content_copy</span> Copy
                                                        </button>
                                                        <hr className="border-[#1c2127]" />
                                                        <button 
                                                            onClick={() => handleDeleteSecret(secret.id)}
                                                            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2"
                                                        >
                                                            <span className="material-symbols-outlined text-xs">delete</span> Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
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
                                    onClick={() => { setAddMode('single'); setErrorMessage(null); }}
                                    className={`px-3 py-1 text-xs font-bold rounded transition-colors ${addMode === 'single' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
                                >
                                    Single
                                </button>
                                <button
                                    onClick={() => { setAddMode('bulk'); setErrorMessage(null); }}
                                    className={`px-3 py-1 text-xs font-bold rounded transition-colors ${addMode === 'bulk' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
                                >
                                    Bulk
                                </button>
                            </div>
                        </div>
                        
                        {errorMessage && (
                            <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono">
                                {errorMessage}
                            </div>
                        )}

                        {addMode === 'single' ? (
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-2">Key</label>
                                    <input
                                        className="w-full bg-[#111820] border border-[#1c2127] rounded-lg px-4 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none font-mono placeholder:text-slate-700"
                                        placeholder="e.g. DATABASE_URL"
                                        value={newKey}
                                        onChange={e => setNewKey(e.target.value)} // Removed .toUpperCase()
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
                            <button onClick={() => { setIsAddSecretOpen(false); setErrorMessage(null); }} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
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

            {/* Edit Secret Modal */}
            {editingSecret && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]">
                    <div className="max-w-md w-full bg-[#0d1218] border border-[#1c2127] rounded-2xl glow-modal overflow-hidden p-6 tech-border">
                        <h3 className="text-xl font-bold text-white mb-4">Edit Secret</h3>
                        
                        {errorMessage && (
                            <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono">
                                {errorMessage}
                            </div>
                        )}

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-2">Key</label>
                                <input
                                    className="w-full bg-[#111820] border border-[#1c2127] rounded-lg px-4 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none font-mono placeholder:text-slate-700"
                                    placeholder="e.g. DATABASE_URL"
                                    value={editKey}
                                    onChange={e => setEditKey(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-2">Value</label>
                                <textarea
                                    className="w-full bg-[#111820] border border-[#1c2127] rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none font-mono placeholder:text-slate-700 min-h-[100px]"
                                    placeholder="Enter secret value..."
                                    value={editValue}
                                    onChange={e => setEditValue(e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => { setEditingSecret(null); setErrorMessage(null); }} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                            <button onClick={handleUpdateSecret} disabled={!editKey || !editValue || isUpdating} className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded font-bold disabled:opacity-50">
                                {isUpdating ? 'Updating...' : 'Update Secret'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default VaultDetail;
