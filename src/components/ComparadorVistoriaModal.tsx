import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle2, AlertTriangle, Eye, ArrowRight, Gauge, Layers, SplitSquareVertical } from 'lucide-react';
import { Moto, Kitnet } from '../types';
import { formatDate } from '../utils/formatters';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

interface ComparadorVistoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  assetType: 'moto' | 'kitnet';
  moto?: Moto;
  kitnet?: Kitnet;
}

export const ComparadorVistoriaModal: React.FC<ComparadorVistoriaModalProps> = ({
  isOpen,
  onClose,
  assetType,
  moto,
  kitnet,
}) => {
  const [viewMode, setViewMode] = useState<'lado_a_lado' | 'slider'>('lado_a_lado');
  const [sliderPos, setSliderPos] = useState<number>(50);

  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  const isMoto = assetType === 'moto' && moto;
  const isKitnet = assetType === 'kitnet' && kitnet;

  // Moto Photos
  const motoBeforePhoto = moto?.delivery?.photos[0] || moto?.photos.front || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80';
  const motoAfterPhoto = moto?.photos.dashboard || moto?.photos.rear || motoBeforePhoto;
  
  // Kitnet Photos
  const kitnetBeforePhoto = kitnet?.photos.livingRoom || kitnet?.photos.kitchen || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80';
  const kitnetAfterPhoto = kitnet?.photos.bedroom || kitnet?.photos.bathroom || kitnetBeforePhoto;

  const beforePhoto = isMoto ? motoBeforePhoto : kitnetBeforePhoto;
  const afterPhoto = isMoto ? motoAfterPhoto : kitnetAfterPhoto;

  const beforeDate = isMoto ? moto?.delivery?.date || moto?.purchaseDate : kitnet?.entryInspection?.date || 'Data de Entrada';
  const afterDate = isMoto ? moto?.returnInspection?.date || 'Estado Atual' : kitnet?.exitInspection?.date || 'Estado Atual';

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn font-sans">
      <div className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-2xl w-full max-w-4xl max-h-[92dvh] sm:max-h-[88vh] overflow-hidden shadow-2xl flex flex-col my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#2A2A2E] flex items-center justify-between bg-[#1C1C1F] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20">
              <SplitSquareVertical className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#F2F1ED] flex items-center gap-2 flex-wrap">
                <span>Comparador de Vistoria</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#121214] text-[#8B5CF6] font-medium border border-[#2A2A2E]">
                  {isMoto ? `Moto ${moto.brand} ${moto.model} (${moto.plate})` : `Kitnet ${kitnet?.name} - Nº ${kitnet?.number}`}
                </span>
              </h2>
              <p className="text-xs text-[#9C9CA3]">
                Comparativo oficial de entrega vs devolução / estado corrente do ativo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex bg-[#121214] p-0.5 rounded-lg border border-[#2A2A2E]">
              <button
                type="button"
                onClick={() => setViewMode('lado_a_lado')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  viewMode === 'lado_a_lado' ? 'bg-[#8B5CF6] text-[#121214] font-bold' : 'text-[#9C9CA3] hover:text-[#F2F1ED]'
                }`}
              >
                Lado a Lado
              </button>
              <button
                type="button"
                onClick={() => setViewMode('slider')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  viewMode === 'slider' ? 'bg-[#8B5CF6] text-[#121214] font-bold' : 'text-[#9C9CA3] hover:text-[#F2F1ED]'
                }`}
              >
                Slider Interativo
              </button>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#9C9CA3] hover:text-[#F2F1ED] hover:bg-[#2A2A2E] transition-colors cursor-pointer border border-transparent hover:border-[#2A2A2E]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-6 modal-scroll-container"
          style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
        >
          {/* Mobile viewMode buttons */}
          <div className="flex sm:hidden bg-[#121214] p-1 rounded-xl border border-[#2A2A2E]">
            <button
              type="button"
              onClick={() => setViewMode('lado_a_lado')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                viewMode === 'lado_a_lado' ? 'bg-[#8B5CF6] text-[#121214]' : 'text-[#9C9CA3]'
              }`}
            >
              Lado a Lado
            </button>
            <button
              type="button"
              onClick={() => setViewMode('slider')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                viewMode === 'slider' ? 'bg-[#8B5CF6] text-[#121214]' : 'text-[#9C9CA3]'
              }`}
            >
              Slider Interativo
            </button>
          </div>

          {/* Visual Comparison Area */}
          {viewMode === 'lado_a_lado' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* BEFORE */}
              <div className="bg-[#121214] border border-[#2A2A2E] rounded-xl overflow-hidden flex flex-col">
                <div className="p-3 bg-[#1C1C1F] border-b border-[#2A2A2E] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#8B5CF6] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse" />
                    1. ANTES (Entrega / Entrada)
                  </span>
                  <span className="text-xs text-[#9C9CA3] font-mono">{formatDate(beforeDate || '')}</span>
                </div>
                <div className="h-64 bg-[#121214] relative overflow-hidden flex items-center justify-center">
                  <img
                    src={beforePhoto}
                    alt="Vistoria Anterior"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] text-[#F2F1ED] border border-[#2A2A2E] font-mono">
                    {isMoto ? `KM Inicial: ${moto?.delivery?.initialKm || moto?.currentKm} km` : 'Vistoria Inicial'}
                  </div>
                </div>
                <div className="p-3 text-xs text-[#9C9CA3]">
                  <strong className="text-[#F2F1ED]">Laudo de Entrada:</strong> {isMoto ? moto?.delivery?.stateNotes || 'Veículo entregue revisado, com 2 chaves e manual.' : kitnet?.entryInspection?.stateNotes || 'Imóvel com pintura nova e instalações testadas.'}
                </div>
              </div>

              {/* AFTER */}
              <div className="bg-[#121214] border border-[#2A2A2E] rounded-xl overflow-hidden flex flex-col">
                <div className="p-3 bg-[#1C1C1F] border-b border-[#2A2A2E] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#8B5CF6] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse" />
                    2. DEPOIS (Devolução / Atual)
                  </span>
                  <span className="text-xs text-[#9C9CA3] font-mono">{formatDate(afterDate || '')}</span>
                </div>
                <div className="h-64 bg-[#121214] relative overflow-hidden flex items-center justify-center">
                  <img
                    src={afterPhoto}
                    alt="Vistoria Posterior"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] text-[#F2F1ED] border border-[#2A2A2E] font-mono">
                    {isMoto ? `KM Atual: ${moto?.currentKm} km (+${(moto?.currentKm || 0) - (moto?.delivery?.initialKm || 0)} km)` : 'Vistoria Atual'}
                  </div>
                </div>
                <div className="p-3 text-xs text-[#9C9CA3]">
                  <strong className="text-[#F2F1ED]">Laudo de Saída / Atual:</strong> {isMoto ? moto?.returnInspection?.stateNotes || 'Estado operacional verificado no odômetro.' : kitnet?.exitInspection?.stateNotes || 'Vistoria periódica de conservação.'}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="h-80 bg-[#121214] rounded-xl border border-[#2A2A2E] relative overflow-hidden select-none">
                {/* Background Image (AFTER) */}
                <img
                  src={afterPhoto}
                  alt="Depois"
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* Clipped Image (BEFORE) */}
                <div
                  className="absolute inset-0 overflow-hidden border-r-2 border-[#8B5CF6] shadow-2xl"
                  style={{ width: `${sliderPos}%` }}
                >
                  <img
                    src={beforePhoto}
                    alt="Antes"
                    className="absolute inset-0 w-full h-full object-cover max-w-none"
                    style={{ width: '100%', minWidth: '100%' }}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-[#8B5CF6] text-[#121214] text-xs font-bold px-2.5 py-1 rounded-md shadow-md">
                    ANTES
                  </div>
                </div>

                <div className="absolute top-3 right-3 bg-[#1C1C1F] text-[#F2F1ED] border border-[#2A2A2E] text-xs font-bold px-2.5 py-1 rounded-md shadow-md">
                  DEPOIS
                </div>

                {/* Slider Handle */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-[#8B5CF6] flex items-center justify-center pointer-events-none"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="w-7 h-7 bg-[#8B5CF6] rounded-full text-[#121214] flex items-center justify-center shadow-lg font-bold text-xs">
                    ⇄
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-[#9C9CA3] font-bold">Antes</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPos}
                  onChange={(e) => setSliderPos(Number(e.target.value))}
                  className="flex-1 accent-[#8B5CF6] cursor-pointer h-2 bg-[#121214] rounded-lg"
                />
                <span className="text-xs text-[#9C9CA3] font-bold">Depois</span>
              </div>
            </div>
          )}

          {/* Checklist & Metrics Comparison */}
          <div className="bg-[#121214] border border-[#2A2A2E] rounded-xl p-4">
            <h3 className="text-sm font-bold text-[#F2F1ED] mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#8B5CF6]" />
              Checklist Comparativo de Itens e Estrutura
            </h3>

            {isMoto && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#1C1C1F] p-3 rounded-lg border border-[#2A2A2E]">
                  <span className="text-xs text-[#9C9CA3]">Variação de Odômetro (KM)</span>
                  <div className="text-lg font-mono font-bold text-[#F2F1ED] mt-1">
                    {(moto.currentKm || 0) - (moto.delivery?.initialKm || moto.currentKm || 0)} km rodados
                  </div>
                  <span className="text-[11px] text-[#8B5CF6]">
                    Inicial: {moto.delivery?.initialKm || moto.currentKm} km → Atual: {moto.currentKm} km
                  </span>
                </div>

                <div className="bg-[#1C1C1F] p-3 rounded-lg border border-[#2A2A2E]">
                  <span className="text-xs text-[#9C9CA3]">Registro de Avarias</span>
                  <div className="text-lg font-mono font-bold text-[#8B5CF6] mt-1">
                    {moto.photos.damages?.length || 0} avarias catalogadas
                  </div>
                  <span className="text-[11px] text-[#9C9CA3]">
                    {moto.photos.damages && moto.photos.damages.length > 0 ? moto.photos.damages[0].description : 'Nenhuma avaria grave registrada.'}
                  </span>
                </div>

                <div className="bg-[#1C1C1F] p-3 rounded-lg border border-[#2A2A2E]">
                  <span className="text-xs text-[#9C9CA3]">Assinaturas do Laudo</span>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Admin OK
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Cliente OK
                    </span>
                  </div>
                </div>
              </div>
            )}

            {isKitnet && kitnet.entryInspection && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {Object.entries(kitnet.entryInspection.itemsState).map(([key, val]) => (
                  <div key={key} className="bg-[#1C1C1F] p-2.5 rounded-lg border border-[#2A2A2E] flex items-center justify-between">
                    <span className="capitalize text-[#F2F1ED] font-medium">{key}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      val === 'otimo' || val === 'bom' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {String(val).toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2A2A2E] flex flex-wrap items-center justify-between gap-3 bg-[#1C1C1F] shrink-0">
          <span className="text-xs text-[#9C9CA3]">
            Relatório fotográfico com carimbo temporal para auditoria.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-[#121214] hover:bg-[#2A2A2E] text-[#F2F1ED] border border-[#2A2A2E] rounded-xl transition-all cursor-pointer"
          >
            Fechar Comparador
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};
