'use client';

import React, { useState } from 'react';
import Context from '@/components/admin/Context';
import Ventas from '@/components/admin/Ventas';
import Stock from '@/components/admin/Productos';
import Producto from '@/components/admin/CrearProducto';

export default function Admin() {
  const [tab, setTab] = useState('inicio');

  return (
    <div className="min-h-[calc(100vh-80px)] w-full bg-[#0b1220]">

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px, 32px 32px',
          backgroundPosition: '0 0, 0 0',
        }}
      />

      <div className="relative container mx-auto px-4 py-6 text-white">
        <h1 className="mb-4 text-2xl font-semibold">Administrador</h1>

        <div className="grid gap-4 ">

          <aside className="h-max rounded-2xl bg-white/10 p-2 backdrop-blur border border-white/10">
            <SideItem active={tab === 'inicio'} onClick={() => setTab('inicio')} title="Inicio" subtitle="Resumen y ayuda" />
            <SideItem active={tab === 'ventas'} onClick={() => setTab('ventas')} title="Ventas" subtitle="Ver y gestionar ventas" />
            <SideItem active={tab === 'productos'} onClick={() => setTab('productos')} title="Productos" subtitle="Stock y edicion de productos" />
            <SideItem active={tab === 'crear'} onClick={() => setTab('crear')} title="Crear producto" subtitle="Nuevo registro" />
          </aside>


          <section className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-6 backdrop-blur">
            {tab === 'inicio' && <Context />}
            {tab === 'ventas' && <Ventas />}
            {tab === 'productos' && <Stock />}
            {tab === 'crear' && <Producto />}
          </section>
        </div>
      </div>
    </div>
  );
}

function SideItem({ active, onClick, title, subtitle }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full flex-col rounded-xl border px-3 py-2 text-left transition ${active
          ? 'bg-white text-[#0b1220] border-white'
          : 'bg-transparent text-white/90 border-transparent hover:bg-white/5'
        }`}
    >
      <span className={`text-sm font-medium ${active ? '' : 'text-white'}`}>{title}</span>
      <span className={`text-[11px] ${active ? 'text-[#0b1220]/80' : 'text-white/60'}`}>{subtitle}</span>
    </button>
  );
}
