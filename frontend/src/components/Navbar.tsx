import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
            <nav className="flex h-16 w-full max-w-[960px] items-center justify-between rounded-xl border border-white/10 bg-black/40 px-8 backdrop-blur-xl">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="size-8 text-primary">
                        <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold tracking-tighter"><span className="text-primary">Env</span>rypt</h2>
                </div>
                <div className="hidden md:flex items-center gap-8">
                    <button onClick={() => navigate('/')} className="text-sm font-medium text-white/70 transition-colors hover:text-primary cursor-pointer">Home</button>
                    <a className="text-sm font-medium text-white/70 transition-colors hover:text-primary" href="#">How to use</a>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/login')} className="text-sm font-bold text-white/70 hover:text-white px-4 cursor-pointer">Log In</button>
                    <button onClick={() => navigate('/signup')} className="rounded-lg bg-primary px-5 py-2 text-sm font-bold transition-all hover:bg-primary/80 glow-shadow cursor-pointer">
                        Signup
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
