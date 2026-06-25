'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    // Login state ko dynamically check karne ke liye helper function
    const checkUser = () => {
        const storedUser = localStorage.getItem('blogUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setUser(null);
        }
    };

    useEffect(() => {
        checkUser();

        // Jab bhi page change ho ya login/logout ho, state sync rahegi
        window.addEventListener('storage', checkUser);
        return () => window.removeEventListener('storage', checkUser);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('blogUser');
        setUser(null);
        router.push('/login');
        // Custom event dispatch taaki baaki pages ko instantly pata chal jaye
        window.dispatchEvent(new Event('storage'));
    };

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 40px',
            background: '#ffffff',
            borderBottom: '1px solid #eaeaea',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            {/* Left Side: Logo */}
            <div>
                <Link href="/" style={{ fontSize: '22px', fontWeight: 'bold', color: '#0070f3', textDecoration: 'none' }}>
                    ✍️ BlogVerse
                </Link>
            </div>

            {/* Right Side: Authentication Links */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <Link href="/" style={{ color: '#333', textDecoration: 'none', fontWeight: 500 }}>
                    Home
                </Link>

                {user ? (
                    <>
                        <Link href="/create" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: 500 }}>
                            📝 Write Post
                        </Link>
                        <span style={{ color: '#666', fontSize: '14px' }}>
                            Hi, <strong>{user.username}</strong>
                        </span>
                        <button 
                            onClick={handleLogout} 
                            style={{
                                background: '#ff4757',
                                color: '#fff',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontWeight: 500
                            }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/login" style={{ color: '#333', textDecoration: 'none', fontWeight: 500 }}>
                            Login
                        </Link>
                        <Link href="/register" style={{
                            background: '#000',
                            color: '#fff',
                            padding: '8px 16px',
                            borderRadius: '5px',
                            textDecoration: 'none',
                            fontWeight: 500
                        }}>
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}