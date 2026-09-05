import React from 'react';
import { Moto, MotoContract, MotoTenant } from '../../../types';
import { Camera, CheckCircle2, FileText } from 'lucide-react';

interface MotoDetailVistoriaTabProps {
  moto: Moto;
  activeContract?: MotoContract;
  tenant?: MotoTenant;
  formatDate: (dateStr: string) => string;
  setShowDeliveryModal: (show: boolean) => void;
  onGenerateDocument: (type: any, moto: Moto, contract?: MotoContract, tenant?: MotoTenant) => void;
}

export const MotoDetailVistoriaTab: React.FC<MotoDetailVistoriaTabProps> = ({
  moto,
  activeContract,
  tenant,
  formatDate,
  setShowDeliveryModal,
  onGenerateDocument,
}) => {
  return (
    <div className="space-y-4">
      {moto.delivery ? (
        <div className="p-4 bg-[#101012] border border-white/[0.08] rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#10B981]">
                Entrega Oficial Realizada
              </span>
              <h4 className="text-sm font-semibold text-[#F5F5F7] mt-0.5">
                KM de Entrega: {moto.delivery.initialKm.toLocaleString('pt-BR')} km
              </h4>
            </div>
            <span className="text-xs text-[#9A9AA2]">
              Data: {formatDate(moto.delivery.date)}
            </span>
          </div>

          <p className="text-xs text-[#9A9AA2] bg-[#18181B] p-3 rounded-lg border border-white/[0.08]">
            {moto.delivery.stateNotes}
          </p>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-[#10B981] flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Termo de entrega assinado pelo locatário
            </span>

            <button
              onClick={() =>
                onGenerateDocument('termo_entrega_moto', moto, activeContract, tenant)
              }
              className="px-3 py-1.5 rounded-lg bg-transparent hover:bg-[#25242C] text-[#F5F5F7] text-xs font-medium border border-white/[0.08] flex items-center gap-1 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Imprimir Termo</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center bg-[#101012] rounded-xl border border-dashed border-white/[0.08]">
          <Camera className="w-8 h-8 text-[#5F5F66] mx-auto mb-2" />
          <p className="text-xs text-[#F5F5F7] font-medium">Entrega ainda não registrada</p>
          <button
            onClick={() => setShowDeliveryModal(true)}
            className="mt-3 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer transition-all shadow-sm shadow-amber-500/20 active:scale-95"
          >
            Registrar Entrega da Moto
          </button>
        </div>
      )}
    </div>
  );
};
