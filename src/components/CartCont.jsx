'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cart';

export default function CartCounter() {
    const items = useCartStore((s) => s.items);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const count = mounted ? items.reduce((acc, i) => acc + i.cantidad, 0) : 0;

    return (
        <Link href="/carrito" className="relative inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-white">
                <path fill="currentColor" d="M7 18a2 2 0 1 0 0 4a2 2 0 0 0 0-4m10 0a2 2 0 1 0 0 4a2 2 0 0 0 0-4M7.1 14h9.97a2 2 0 0 0 1.93-1.48l2-7A1 1 0 0 0 20 4H6.21l-.3-1.2A1 1 0 0 0 5 2H2v2h2.24l2.54 10.16A3 3 0 0 0 7.1 14Z" />
            </svg>
            <span className="hidden lg:inline">Carrito</span>


            {mounted && count > 0 && (
                <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-fuchsia-600 text-[10px] font-bold text-white ring-2 ring-[#0b1020]">
                    {count}
                </span>
            )}
        </Link>
    );
}