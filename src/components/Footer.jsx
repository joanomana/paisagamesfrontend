'use client';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="mt-16 border-t border-white/10 bg-[#0b1020] text-white">

            <div className="h-1 w-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-fuchsia-500 blur-[2px] opacity-70" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-8 md:grid-cols-4">

                <div>
                    <div className="inline-flex items-center gap-2">
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-600 to-cyan-500 shadow-lg shadow-fuchsia-500/30">
                            <svg viewBox="0 0 24 24" className="h-5 w-5 text-white">
                                <path fill="currentColor" d="M7 8h10a5 5 0 0 1 4.58 2.89l.95 2.11A3 3 0 0 1 19.78 17h-2.06a2 2 0 0 1-1.7-.94l-.61-.96a2 2 0 0 0-1.7-.94H10.3a2 2 0 0 0-1.7.94l-.61.96A2 2 0 0 1 6.3 17H4.22A3 3 0 0 1 .47 13l.95-2.11A5 5 0 0 1 7 8Z" />
                            </svg>
                        </span>
                        <span className="text-lg font-semibold">PaisaGames</span>
                    </div>
                    <p className="mt-3 text-sm text-white/70">
                        Tu portal para juegos, consolas y coleccionables. Subimos de nivel contigo.
                    </p>


                    <div className="mt-4 flex items-center gap-3">
                        <Social href="#" label="Twitter">
                            <svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="M22 5.75c-.77.34-1.6.57-2.46.67c.89-.53 1.57-1.37 1.89-2.37c-.83.49-1.75.84-2.72 1.03A4.13 4.13 0 0 0 12.1 8.5c0 .32.04.64.11.94C9.04 9.3 6.4 7.9 4.67 5.75c-.36.62-.56 1.34-.56 2.1c0 1.45.75 2.72 1.9 3.46c-.7-.02-1.36-.22-1.94-.53v.05c0 2.02 1.5 3.7 3.5 4.07c-.37.1-.77.15-1.18.15c-.29 0-.57-.03-.84-.08c.57 1.78 2.22 3.08 4.18 3.12A8.3 8.3 0 0 1 2 19.54A11.7 11.7 0 0 0 8.29 21.5c7.55 0 11.68-6.33 11.68-11.82c0-.18 0-.36-.01-.54c.8-.6 1.49-1.34 2.04-2.19Z" /></svg>
                        </Social>
                        <Social href="#" label="Instagram">
                            <svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5m10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3m-5 3.5A5.5 5.5 0 1 1 6.5 13A5.5 5.5 0 0 1 12 7.5m0 2A3.5 3.5 0 1 0 15.5 13A3.5 3.5 0 0 0 12 9.5M18 6.5a1 1 0 1 1-1 1a1 1 0 0 1 1-1" /></svg>
                        </Social>
                        <Social href="#" label="YouTube">
                            <svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="M10 15.5V8.5l6 3m2-9.5H6A4 4 0 0 0 2 6v12a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4V6a4 4 0 0 0-4-4Z" /></svg>
                        </Social>
                    </div>
                </div>


                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">Categorías</h3>
                    <ul className="mt-3 space-y-2 text-sm text-white/70">
                        <li><Link href="/producto?tipo=JUEGO_FISICO" className="hover:text-white">Juegos físicos</Link></li>
                        <li><Link href="/producto?tipo=LLAVE_DIGITAL" className="hover:text-white">Llaves digitales</Link></li>
                        <li><Link href="/producto?tipo=CONSOLA" className="hover:text-white">Consolas</Link></li>
                        <li><Link href="/producto?tipo=ACCESORIO" className="hover:text-white">Accesorios</Link></li>
                        <li><Link href="/producto?tipo=COLECCIONABLE" className="hover:text-white">Coleccionables</Link></li>
                    </ul>
                </div>


                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">Soporte</h3>
                    <ul className="mt-3 space-y-2 text-sm text-white/70">
                        <li><Link href="/soporte" className="hover:text-white">Centro de ayuda</Link></li>
                        <li><Link href="/envios" className="hover:text-white">Envíos y devoluciones</Link></li>
                        <li><Link href="/terminos" className="hover:text-white">Términos & Condiciones</Link></li>
                        <li><Link href="/privacidad" className="hover:text-white">Privacidad</Link></li>
                    </ul>
                </div>


                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">Newsletter</h3>
                    <p className="mt-3 text-sm text-white/70">Ofertas exclusivas y lanzamientos semanales.</p>


                    <div className="mt-4 flex items-center gap-2 text-white/60">
                        <Badge>VISA</Badge>
                        <Badge>Mastercard</Badge>
                        <Badge>PayPal</Badge>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
                © {new Date().getFullYear()} PaisaGames · Hecho con ❤️ y muchos combos
            </div>
        </footer>
    );
}

function Social({ href, label, children }) {
    return (
        <a
            href={href}
            aria-label={label}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition"
        >
            {children}
        </a>
    );
}

function Badge({ children }) {
    return (
        <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] tracking-wider">
            {children}
        </span>
    );
}
