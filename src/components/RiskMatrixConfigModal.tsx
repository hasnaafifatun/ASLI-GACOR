import { useEffect, useState } from 'react';
import {
  createDefaultRiskMatrix,
  IMPACT_OPTIONS,
  PROBABILITY_OPTIONS,
  RISK_STATUS_TABLE,
} from '../data/ppgData';
import { RiskLevelCategory, RiskMatrixConfig } from '../types/upg';
import { Modal } from './Modal';

interface RiskMatrixConfigModalProps {
  open: boolean;
  config: RiskMatrixConfig;
  canEdit: boolean;
  onClose: () => void;
  onSave: (next: RiskMatrixConfig) => void;
}

const CATEGORIES: RiskLevelCategory[] = [
  'Sangat Rendah',
  'Rendah',
  'Moderat',
  'Tinggi',
  'Ekstrim/Sangat Tinggi',
];

export function getCategoryBadgeClass(
  category: RiskLevelCategory | null
): string {
  switch (category) {
    case 'Sangat Rendah':
      return 'bg-[#e3f5eb] text-[#137a45] border-[#b7e2cb]';
    case 'Rendah':
      return 'bg-[#e4f0fc] text-[#155da8] border-[#b5d4f5]';
    case 'Moderat':
      return 'bg-[#fef9c3] text-[#854d0e] border-[#fde047]';
    case 'Tinggi':
      return 'bg-[#ffedd5] text-[#b45309] border-[#fdba74]';
    case 'Ekstrim/Sangat Tinggi':
      return 'bg-[#fde8e8] text-[#b4232c] border-[#f5c2c7]';
    default:
      return 'bg-[#edf1f5] text-[#64748b] border-[#dce3eb]';
  }
}

export function getMatrixCellColorClass(
  category: RiskLevelCategory | null
): string {
  switch (category) {
    case 'Sangat Rendah':
      return 'bg-[#159947] text-[#0b2e16]';
    case 'Rendah':
      return 'bg-[#2a76bd] text-[#0c2745]';
    case 'Moderat':
      return 'bg-[#f9f346] text-[#1f2937]';
    case 'Tinggi':
      return 'bg-[#ea9855] text-[#291707]';
    case 'Ekstrim/Sangat Tinggi':
      return 'bg-[#d63342] text-[#2b090c]';
    default:
      return 'bg-[#edf1f5] text-[#475569]';
  }
}

export function RiskMatrixConfigModal({
  open,
  config,
  canEdit,
  onClose,
  onSave,
}: RiskMatrixConfigModalProps) {
  const [draft, setDraft] = useState<RiskMatrixConfig>(config);

  useEffect(() => {
    if (open) {
      setDraft({
        ...config,
        grid: { ...config.grid },
      });
    }
  }, [open, config]);

  const handleCellChange = (
    prob: number,
    impact: number,
    category: RiskLevelCategory
  ) => {
    setDraft((prev) => ({
      ...prev,
      grid: {
        ...prev.grid,
        [`${prob}-${impact}`]: category,
      },
    }));
  };

  const handleReset = () => {
    setDraft(createDefaultRiskMatrix());
  };

  const handleSave = () => {
    onSave({
      ...draft,
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Matriks Analisis Risiko 5×5 & Tabel Status Risiko"
      onClose={onClose}
      onSave={canEdit ? handleSave : undefined}
      saveLabel="Simpan Konfigurasi Matriks"
    >
      <div className="space-y-4 text-[13px] text-[#243247]">
        <div className="rounded border border-[#f0d79d] bg-[#fff8e8] px-3 py-2 text-[12px] text-[#785716]">
          Matriks Analisis Risiko 5×5 (5 Skala Kemungkinan × 5 Skala Dampak)
          beserta Tabel Status Risiko sesuai ketentuan yang berlaku.
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-bold text-[#536477]">
            Dasar Ketentuan / Catatan Konfigurasi
          </label>
          <input
            type="text"
            disabled={!canEdit}
            value={draft.note}
            onChange={(e) => setDraft({ ...draft, note: e.target.value })}
            className="rounded border border-[#cfd9e4] bg-white px-2.5 py-1.5 text-[13px] text-[#243247] disabled:bg-[#f4f7fa]"
          />
        </div>

        {/* Matriks Analisis Risiko 5x5 */}
        <div className="overflow-x-auto rounded border border-[#94a3b8]">
          <table className="w-full min-w-[700px] border-collapse text-[11.5px]">
            <thead>
              <tr className="bg-[#f8fafc] text-[#1e293b]">
                <th
                  colSpan={3}
                  className="border border-[#94a3b8] px-2.5 py-2 text-center font-bold uppercase tracking-wide"
                >
                  MATRIKS ANALISIS RISIKO 5X5
                </th>
                <th
                  colSpan={5}
                  className="border border-[#94a3b8] px-2.5 py-2 text-center font-bold uppercase tracking-wide"
                >
                  DAMPAK
                </th>
              </tr>
              <tr className="bg-[#f8fafc] text-[#1e293b]">
                <th
                  rowSpan={2}
                  className="border border-[#94a3b8] px-2 py-1.5 text-center font-bold uppercase"
                >
                  DESKRIPSI
                </th>
                <th
                  rowSpan={2}
                  className="border border-[#94a3b8] px-2 py-1.5 text-center font-bold uppercase"
                >
                  KEMUNGKINAN
                </th>
                <th
                  rowSpan={2}
                  className="border border-[#94a3b8] px-2 py-1.5 text-center font-bold uppercase"
                >
                  SKALA
                  <br />
                  KEMUNGKINAN
                </th>
                {IMPACT_OPTIONS.map((imp) => (
                  <th
                    key={imp.value}
                    className="border border-[#94a3b8] px-2 py-1.5 text-center font-bold uppercase"
                  >
                    {imp.shortDesc}
                  </th>
                ))}
              </tr>
              <tr className="bg-[#f8fafc] text-[#1e293b]">
                {IMPACT_OPTIONS.map((imp) => (
                  <th
                    key={imp.value}
                    className="border border-[#94a3b8] px-2 py-1 text-center font-bold tabular-nums"
                  >
                    {imp.value}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...PROBABILITY_OPTIONS].reverse().map((prob) => (
                <tr key={prob.value}>
                  <td className="border border-[#94a3b8] bg-white px-2 py-2 text-center text-[11px] font-bold text-[#1e293b]">
                    {prob.shortDesc}
                  </td>
                  <td className="border border-[#94a3b8] bg-white px-2 py-2 text-center text-[11px] font-semibold text-[#1e293b] whitespace-nowrap">
                    {prob.range}
                  </td>
                  <td className="border border-[#94a3b8] bg-white px-2 py-2 text-center text-[12px] font-bold text-[#1e293b] tabular-nums">
                    {prob.value}
                  </td>
                  {IMPACT_OPTIONS.map((imp) => {
                    const key = `${prob.value}-${imp.value}`;
                    const score = prob.value * imp.value;
                    const currentCat = draft.grid[key] ?? 'Moderat';
                    return (
                      <td
                        key={key}
                        className={`border border-[#94a3b8] px-1.5 py-2 text-center ${getMatrixCellColorClass(
                          currentCat
                        )}`}
                      >
                        <div className="font-mono-num text-[13px] font-extrabold leading-tight">
                          {score}
                        </div>
                        {canEdit && (
                          <select
                            aria-label={`Kategori risiko ${prob.value}x${imp.value}`}
                            value={currentCat}
                            onChange={(e) =>
                              handleCellChange(
                                prob.value,
                                imp.value,
                                e.target.value as RiskLevelCategory
                              )
                            }
                            className="mt-1 w-full rounded border border-black/20 bg-white/90 px-1 py-0.5 text-[10px] font-semibold text-[#1e293b]"
                          >
                            {CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tabel Status Risiko */}
        <div>
          <div className="mb-1.5 text-[12.5px] font-bold text-[#1d3554]">
            Tabel Status Risiko
          </div>
          <div className="overflow-x-auto rounded border border-[#94a3b8]">
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr className="bg-[#f8fafc] text-[#1e293b]">
                  <th className="border border-[#94a3b8] px-3 py-2 text-center font-bold uppercase">
                    DESKRIPSI
                  </th>
                  <th className="w-[100px] border border-[#94a3b8] px-3 py-2 text-center font-bold uppercase">
                    LEVEL
                  </th>
                  <th className="w-[180px] border border-[#94a3b8] px-3 py-2 text-center font-bold uppercase">
                    RANGE NILAI
                  </th>
                </tr>
              </thead>
              <tbody>
                {RISK_STATUS_TABLE.map((row) => (
                  <tr key={row.level}>
                    <td
                      className={`border border-[#94a3b8] px-3 py-2 text-center font-bold uppercase ${getMatrixCellColorClass(
                        row.category
                      )}`}
                    >
                      {row.deskripsi}
                    </td>
                    <td className="border border-[#94a3b8] bg-white px-3 py-2 text-center font-bold text-[#1e293b] tabular-nums">
                      {row.level}
                    </td>
                    <td className="border border-[#94a3b8] bg-white px-3 py-2 text-center font-bold text-[#1e293b] tabular-nums">
                      {row.rangeNilai}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {canEdit && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <button
              type="button"
              onClick={handleReset}
              className="cursor-pointer rounded border border-[#ccd7e3] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#536477] hover:bg-[#f8fafc]"
            >
              Reset ke Default (5×5)
            </button>
            <span className="text-[11px] text-[#718096]">
              Perubahan langsung diterapkan pada hasil Inherent &amp; Residual.
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
}
