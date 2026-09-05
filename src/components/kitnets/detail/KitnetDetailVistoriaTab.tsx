import React from 'react';
import { Kitnet } from '../../../types';

interface KitnetDetailVistoriaTabProps {
  kitnet: Kitnet;
  formatDate: (dateStr: string) => string;
}

export const KitnetDetailVistoriaTab: React.FC<KitnetDetailVistoriaTabProps> = ({
  kitnet,
  formatDate,
}) => {
  return (
    <div className="space-y-4">
      {kitnet.entryInspection ? (
        <div className="p-4 bg-[#101012] border border-white/[0.08] rounded-xl space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#10B981] uppercase font-semibold">Laudo Registrado</span>
              <h3 className="text-sm font-bold text-[#F5F5F7]">Vistoria de Entrada</h3>
            </div>
            <span className="text-xs text-[#9A9AA2] font-mono">
              {formatDate(kitnet.entryInspection.date)}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
            {Object.entries(kitnet.entryInspection.itemsState).map(([item, state]) => (
              <div key={item} className="p-2 bg-[#18181B] rounded-lg border border-white/[0.08] flex items-center justify-between">
                <span className="capitalize text-[#9A9AA2]">{item}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
                  {state}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[#9A9AA2] text-xs italic bg-[#18181B] p-2.5 rounded-lg border border-white/[0.08]">
            "{kitnet.entryInspection.stateNotes}"
          </p>
        </div>
      ) : (
        <div className="py-8 text-center text-xs text-[#9A9AA2] bg-[#101012] border border-white/[0.08] rounded-xl">
          Nenhuma vistoria de entrada salva. Use o botão "Vistorias" para registrar ou comparar laudos.
        </div>
      )}
    </div>
  );
};
