'use client';
import Link from 'next/link';
import { useState } from 'react';
import CartCounter from '@/components/CartCont';

export default function Navbar({ cartCount = 0 }) {
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 backdrop-blur bg-gradient-to-b from-[#0b1020]/90 to-[#0b1020]/70 border-b border-white/10">

            <div className="h-1 w-full bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-emerald-400 blur-[2px] opacity-70" />

            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">

                    <Link href="/" className="group inline-flex items-center gap-2">
                        <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-600 to-cyan-500 text-white shadow-lg shadow-fuchsia-500/30">

                            <svg viewBox="0 0 24 24" className="h-5 w-5">
                                <path fill="currentColor" d="M7 8h10a5 5 0 0 1 4.58 2.89l.95 2.11A3 3 0 0 1 19.78 17h-2.06a2 2 0 0 1-1.7-.94l-.61-.96a2 2 0 0 0-1.7-.94H10.3a2 2 0 0 0-1.7.94l-.61.96A2 2 0 0 1 6.3 17H4.22A3 3 0 0 1 .47 13l.95-2.11A5 5 0 0 1 7 8Zm2.5 1.5h-2v1.5H6v2h1.5V15h2v-2h1.5v-2H9.5Zm7.75 1a1 1 0 1 0 0 2a1 1 0 0 0 0-2Zm-2.5 2.5a1 1 0 1 0 0-2a1 1 0 0 0 0 2Z" />
                            </svg>
                        </span>
                        <div>
                            <div className="text-white font-semibold leading-none tracking-wide">PaisaGames</div>
                            <div className="text-[10px] uppercase tracking-[0.2em] text-white/60 -mt-0.5">
                                power up your play
                            </div>
                        </div>
                    </Link>


                    <div className="hidden md:flex items-center gap-6 text-sm">
                        <NavLink href="/producto">Productos</NavLink>
                        <NavLink href="/soporte">Soporte</NavLink>
                        <NavLink href="/administrador">Administrador</NavLink>
                    </div>


                    <div className="hidden md:flex items-center gap-3">
                        <CartCounter />
                    </div>


                    <button
                        className="md:hidden inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-white hover:bg-white/10 transition"
                        onClick={() => setOpen(!open)}
                        aria-label="Abrir menú"
                    >
                        <Burger open={open} />
                    </button>
                </div>

                {open && (
                    <div className="md:hidden pb-4">
                        <div className="flex flex-col gap-2">
                            <LinkItem href="/producto" onClick={() => setOpen(false)}>Productos</LinkItem>
                            <LinkItem href="/soporte" onClick={() => setOpen(false)}>Soporte</LinkItem>
                            <LinkItem href="/administrador" onClick={() => setOpen(false)}>Administrador</LinkItem>

                            <Link
                                href="/carrito"
                                onClick={() => setOpen(false)}
                                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20"
                            >
                                <CartIcon /> Ver carrito {cartCount > 0 ? `(${cartCount})` : ''}
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}

function NavLink({ href, children }) {
    return (
        <Link
            href={href}
            className="text-white/80 hover:text-white transition relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-fuchsia-500 after:to-cyan-400 hover:after:w-full after:transition-all"
        >
            {children}
        </Link>
    );
}

function LinkItem({ href, children, onClick }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white hover:bg-white/10"
        >
            {children}
        </Link>
    );
}

function CartIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white">
            <path fill="currentColor" d="M7 18a2 2 0 1 0 0 4a2 2 0 0 0 0-4m10 0a2 2 0 1 0 0 4a2 2 0 0 0 0-4M7.1 14h9.97a2 2 0 0 0 1.93-1.48l2-7A1 1 0 0 0 20 4H6.21l-.3-1.2A1 1 0 0 0 5 2H2v2h2.24l2.54 10.16A3 3 0 0 0 7.1 14Z" />
        </svg>
    );
}

function Burger({ open }) {
    return (
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-white">
            {open ? (
                <path fill="currentColor" d="M18.3 5.71L12 12l6.3 6.29l-1.41 1.42L10.59 13.4L4.3 19.71L2.89 18.3L9.17 12L2.89 5.71L4.3 4.3l6.29 6.29l6.29-6.3z" />
            ) : (
                <path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
            )}
        </svg>
    );
}
