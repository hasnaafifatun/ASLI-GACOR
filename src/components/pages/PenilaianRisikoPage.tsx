import { useEffect, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Edit3,
  ExternalLink,
  Lock,
  Plus,
  Settings2,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import {
  getMatrixRiskCategory,
  IMPACT_OPTIONS,
  isRiskAssessmentComplete,
  isValidHttpsUrl,
  MASTER_SATKER_LIST,
  MONEV_ACTIVITIES,
  PROBABILITY_OPTIONS,
  RISK_CONTROL_LIBRARY,
  UPG_LEVELS,
} from '../../data/ppgData';
import {
  ControlAssessmentEntry,
  ControlEffectivenessClaim,
  MasterSatker,
  QuarterPeriod,
  RiskAssessmentRecord,
  RiskMatrixConfig,
  UpgLevel,
  UserRole,
} from '../../types/upg';
import { RiskLibraryModal } from '../RiskLibraryModal';
import {
  getCategoryBadgeClass,
  RiskMatrixConfigModal,
} from '../RiskMatrixConfigModal';

interface PenilaianRisikoPageProps {
  year: string;
  userRole: UserRole;
  activeSatkerId?: string;
  assessments: RiskAssessmentRecord[];
  riskMatrix: RiskMatrixConfig;
  initialSatkerUniqueId?: string | null;
  initialRiskCode?: string | null;
  onSaveAssessment: (record: RiskAssessmentRecord) => void;
  onSaveRiskMatrix: (config: RiskMatrixConfig) => void;
  onNavigateDashboard: () => void;
}

const CLAIM_OPTIONS: ControlEffectivenessClaim[] = [
  'Belum Dinilai',
  'Tidak Efektif',
  'Sebagian Efektif',
  'Efektif',
];

const PERIOD_OPTIONS: QuarterPeriod[] = [
  'Triwulan I',
  'Triwulan II',
  'Triwulan III',
  'Triwulan IV',
];

const YEAR_OPTIONS = ['2025', '2026', '2027'];

const AVAILABLE_CONTROL_OPTIONS: string[] = Array.from(
  new Set([
    ...RISK_CONTROL_LIBRARY.flatMap((r) => r.mandatoryControls),
    ...MONEV_ACTIVITIES.map((a) => a.name),
  ])
);

const CUSTOM_CONTROL_VALUE = '__CUSTOM__';
const MIN_SELECTED_RISKS = 10;

interface RiskDraft {
  controls: ControlAssessmentEntry[];
  inherentProb: number | '';
  inherentImpact: number | '';
  residualProb: number | '';
  residualImpact: number | '';
}

function createEmptyRiskDraft(): RiskDraft {
  return {
    controls: [],
    inherentProb: '',
    inherentImpact: '',
    residualProb: '',
    residualImpact: '',
  };
}

function createEmptyControlEntry(
  controlName: string,
  defaultYear: string
): ControlAssessmentEntry {
  return {
    controlName,
    klaimEfektivitas: 'Belum Dinilai',
    buktiKlaim: '',
    catatanKlaim: '',
    tahun: YEAR_OPTIONS.includes(defaultYear) ? defaultYear : '2026',
    periode: 'Triwulan I',
  };
}

export function PenilaianRisikoPage({
  year,
  userRole,
  activeSatkerId,
  assessments,
  riskMatrix,
  initialSatkerUniqueId,
  initialRiskCode,
  onSaveAssessment,
  onSaveRiskMatrix,
  onNavigateDashboard,
}: PenilaianRisikoPageProps) {
  const isSatkerRole = userRole === 'Evaluatan (satker)';
  const allowedUpgLevels: UpgLevel[] =
    userRole === 'Evaluator (UPG Tingkat 2)' ? ['UPG Tingkat 3'] : UPG_LEVELS;

  const canEdit = true;
  const canConfigMatrix =
    userRole === 'Evaluator (UPG Tingkat 2)' ||
    userRole === 'Evaluator (UPG Pusat)';
  const canReturnToDashboard = true;

  const activeSatker: MasterSatker = (() => {
    if (isSatkerRole) {
      return (
        MASTER_SATKER_LIST.find((s) => s.uniqueId === activeSatkerId) ??
        MASTER_SATKER_LIST[0]
      );
    }
    const allowedSatkers = MASTER_SATKER_LIST.filter((s) =>
      allowedUpgLevels.includes(s.upgLevel)
    );
    if (initialSatkerUniqueId) {
      const fromTarget = allowedSatkers.find(
        (s) => s.uniqueId === initialSatkerUniqueId
      );
      if (fromTarget) return fromTarget;
    }
    if (activeSatkerId) {
      const fromActive = allowedSatkers.find(
        (s) => s.uniqueId === activeSatkerId
      );
      if (fromActive) return fromActive;
    }
    return allowedSatkers[0] ?? MASTER_SATKER_LIST[0];
  })();

  const buildDraftFromSaved = (
    satkerId: string,
    riskCode: string
  ): RiskDraft => {
    const existing = assessments.find(
      (a) => a.satkerUniqueId === satkerId && a.kodeRisiko === riskCode
    );
    if (existing) {
      return {
        controls: existing.controls.map((c) => ({ ...c })),
        inherentProb: existing.inherentProb,
        inherentImpact: existing.inherentImpact,
        residualProb: existing.residualProb,
        residualImpact: existing.residualImpact,
      };
    }
    return createEmptyRiskDraft();
  };

  const [selectedRiskCodes, setSelectedRiskCodes] = useState<string[]>(() => {
    if (initialRiskCode) return [initialRiskCode];
    const saved = assessments
      .filter((a) => a.satkerUniqueId === activeSatker.uniqueId)
      .map((a) => a.kodeRisiko);
    return saved.length > 0 ? saved : [];
  });

  const [activeRiskCode, setActiveRiskCode] = useState<string>(() => {
    if (initialRiskCode) return initialRiskCode;
    const saved = assessments.filter(
      (a) => a.satkerUniqueId === activeSatker.uniqueId
    );
    return saved.length > 0 ? saved[0].kodeRisiko : '';
  });

  const [riskPickerValue, setRiskPickerValue] = useState<string>('');
  const [riskDrafts, setRiskDrafts] = useState<Record<string, RiskDraft>>(
    () => {
      const initCodes = initialRiskCode
        ? [initialRiskCode]
        : assessments
            .filter((a) => a.satkerUniqueId === activeSatker.uniqueId)
            .map((a) => a.kodeRisiko);
      const map: Record<string, RiskDraft> = {};
      initCodes.forEach((code) => {
        map[code] = buildDraftFromSaved(activeSatker.uniqueId, code);
      });
      return map;
    }
  );

  const [selectedControlOption, setSelectedControlOption] =
    useState<string>('');
  const [customControlName, setCustomControlName] = useState<string>('');
  const [controlPickerError, setControlPickerError] = useState<string | null>(
    null
  );

  const [errors, setErrors] = useState<string[]>([]);
  const [saveBanner, setSaveBanner] = useState<{
    type: 'success' | 'warning';
    text: string;
  } | null>(null);

  const [libraryOpen, setLibraryOpen] = useState(false);
  const [matrixModalOpen, setMatrixModalOpen] = useState(false);
  const [showKabawasInfo, setShowKabawasInfo] = useState(false);

  const hasMetMinRisks = selectedRiskCodes.length >= MIN_SELECTED_RISKS;

  // Reset drafts & selected risks when switching satker or launched from Dashboard Edit
  useEffect(() => {
    const existingForSat = assessments.filter(
      (a) => a.satkerUniqueId === activeSatker.uniqueId
    );
    const savedCodes = existingForSat.map((a) => a.kodeRisiko);

    let nextCodes: string[];
    let nextActive: string;

    if (initialRiskCode) {
      nextCodes = savedCodes.includes(initialRiskCode)
        ? savedCodes
        : [...savedCodes, initialRiskCode];
      nextActive = initialRiskCode;
    } else {
      nextCodes = savedCodes;
      nextActive = savedCodes[0] ?? '';
    }

    const nextDrafts: Record<string, RiskDraft> = {};
    nextCodes.forEach((code) => {
      const existing = existingForSat.find((a) => a.kodeRisiko === code);
      nextDrafts[code] = existing
        ? {
            controls: existing.controls.map((c) => ({ ...c })),
            inherentProb: existing.inherentProb,
            inherentImpact: existing.inherentImpact,
            residualProb: existing.residualProb,
            residualImpact: existing.residualImpact,
          }
        : createEmptyRiskDraft();
    });

    setSelectedRiskCodes(nextCodes);
    setActiveRiskCode(nextActive);
    setRiskDrafts(nextDrafts);
    setRiskPickerValue('');
    setSelectedControlOption('');
    setCustomControlName('');
    setControlPickerError(null);
    setErrors([]);
  }, [activeSatker.uniqueId, initialRiskCode]);

  const activeRiskLib =
    RISK_CONTROL_LIBRARY.find((r) => r.kodeRisiko === activeRiskCode) ?? null;

  const activeDraft: RiskDraft =
    (activeRiskCode && riskDrafts[activeRiskCode]) || createEmptyRiskDraft();
  const controls = activeDraft.controls;
  const inherentProb = activeDraft.inherentProb;
  const inherentImpact = activeDraft.inherentImpact;
  const residualProb = activeDraft.residualProb;
  const residualImpact = activeDraft.residualImpact;

  const updateActiveDraft = (updater: (prev: RiskDraft) => RiskDraft) => {
    if (!activeRiskCode) return;
    setRiskDrafts((prev) => {
      const current = prev[activeRiskCode] ?? createEmptyRiskDraft();
      return {
        ...prev,
        [activeRiskCode]: updater(current),
      };
    });
  };

  const setInherentProb = (val: number | '') => {
    updateActiveDraft((d) => ({ ...d, inherentProb: val }));
  };
  const setInherentImpact = (val: number | '') => {
    updateActiveDraft((d) => ({ ...d, inherentImpact: val }));
  };
  const setResidualProb = (val: number | '') => {
    updateActiveDraft((d) => ({ ...d, residualProb: val }));
  };
  const setResidualImpact = (val: number | '') => {
    updateActiveDraft((d) => ({ ...d, residualImpact: val }));
  };

  const handleAddOrFocusRisk = (riskCode: string) => {
    if (!riskCode) return;
    if (!selectedRiskCodes.includes(riskCode)) {
      setSelectedRiskCodes((prev) => [...prev, riskCode]);
      setRiskDrafts((prev) => ({
        ...prev,
        [riskCode]:
          prev[riskCode] ?? buildDraftFromSaved(activeSatker.uniqueId, riskCode),
      }));
    }
    setActiveRiskCode(riskCode);
    setRiskPickerValue('');
    setSelectedControlOption('');
    setCustomControlName('');
    setControlPickerError(null);
    setSaveBanner(null);
    setErrors([]);
  };

  const handleRemoveRisk = (riskCode: string) => {
    const nextCodes = selectedRiskCodes.filter((c) => c !== riskCode);
    setSelectedRiskCodes(nextCodes);
    if (activeRiskCode === riskCode) {
      setActiveRiskCode(nextCodes[0] ?? '');
    }
    setSelectedControlOption('');
    setCustomControlName('');
    setControlPickerError(null);
    setSaveBanner(null);
  };

  const handleAddControl = () => {
    if (!activeRiskCode) return;
    const rawName =
      selectedControlOption === CUSTOM_CONTROL_VALUE
        ? customControlName.trim()
        : selectedControlOption.trim();

    if (!rawName) {
      setControlPickerError(
        selectedControlOption === CUSTOM_CONTROL_VALUE
          ? 'Ketik nama kontrol terlebih dahulu sebelum menambahkan.'
          : 'Pilih kontrol terlebih dahulu sebelum menambahkan.'
      );
      return;
    }

    const duplicate = controls.some(
      (c) => c.controlName.toLowerCase() === rawName.toLowerCase()
    );
    if (duplicate) {
      setControlPickerError(`Kontrol "${rawName}" sudah ada dalam daftar.`);
      return;
    }

    updateActiveDraft((d) => ({
      ...d,
      controls: [...d.controls, createEmptyControlEntry(rawName, year)],
    }));
    setSelectedControlOption('');
    setCustomControlName('');
    setControlPickerError(null);
    setSaveBanner(null);
  };

  const handleRemoveControl = (index: number) => {
    updateActiveDraft((d) => ({
      ...d,
      controls: d.controls.filter((_, idx) => idx !== index),
    }));
    setSaveBanner(null);
  };

  const updateControl = (
    index: number,
    patch: Partial<ControlAssessmentEntry>
  ) => {
    updateActiveDraft((d) => ({
      ...d,
      controls: d.controls.map((c, idx) =>
        idx === index ? { ...c, ...patch } : c
      ),
    }));
  };

  const validateAndBuildRecords = (): RiskAssessmentRecord[] | null => {
    const validationErrors: string[] = [];

    if (selectedRiskCodes.length < MIN_SELECTED_RISKS) {
      validationErrors.push(
        `Bagian A: Minimal ${MIN_SELECTED_RISKS} Risiko Gratifikasi wajib dipilih (saat ini baru dipilih ${selectedRiskCodes.length} risiko).`
      );
    }

    if (selectedRiskCodes.length === 0) {
      setErrors(validationErrors);
      setSaveBanner(null);
      return null;
    }

    const builtRecords: RiskAssessmentRecord[] = [];
    const nowIso = new Date().toISOString();

    selectedRiskCodes.forEach((code) => {
      const riskLib = RISK_CONTROL_LIBRARY.find((r) => r.kodeRisiko === code);
      const draft = riskDrafts[code] ?? createEmptyRiskDraft();
      const prefix = `[${code}]`;

      if (!riskLib) return;

      if (draft.inherentProb === '' || draft.inherentImpact === '') {
        validationErrors.push(
          `${prefix} Bagian B: Probabilitas Inherent dan Dampak Inherent wajib dipilih.`
        );
      }

      if (draft.controls.length === 0) {
        validationErrors.push(
          `${prefix} Bagian C: Minimal 1 Kontrol Berjalan wajib dipilih dan ditambahkan.`
        );
      }

      draft.controls.forEach((ctrl, i) => {
        const label = `${prefix} Bagian C (Kontrol #${i + 1}: ${ctrl.controlName})`;
        if (!ctrl.buktiKlaim.trim()) {
          validationErrors.push(`${label}: Bukti Klaim wajib diisi.`);
        } else if (!isValidHttpsUrl(ctrl.buktiKlaim)) {
          validationErrors.push(
            `${label}: Bukti Klaim harus berupa tautan URL dengan format https:// yang valid.`
          );
        }
        if (!ctrl.catatanKlaim.trim()) {
          validationErrors.push(`${label}: Catatan Klaim wajib diisi.`);
        }
        if (!ctrl.tahun) {
          validationErrors.push(`${label}: Tahun Pelaksanaan wajib dipilih.`);
        }
        if (!ctrl.periode) {
          validationErrors.push(`${label}: Periode Pelaksanaan wajib dipilih.`);
        }
      });

      if (draft.residualProb === '' || draft.residualImpact === '') {
        validationErrors.push(
          `${prefix} Bagian D: Probabilitas Residual dan Dampak Residual wajib dipilih.`
        );
      }

      builtRecords.push({
        id: `${activeSatker.uniqueId}::${riskLib.kodeRisiko}`,
        satkerUniqueId: activeSatker.uniqueId,
        upgLevel: activeSatker.upgLevel,
        kodeSatker: activeSatker.kodeSatker,
        namaSatker: activeSatker.namaSatker,
        kodeRisiko: riskLib.kodeRisiko,
        pernyataanRisiko: riskLib.pernyataanRisiko,
        controls: draft.controls.map((c) => ({
          ...c,
          buktiKlaim: c.buktiKlaim.trim(),
        })),
        inherentProb: draft.inherentProb,
        inherentImpact: draft.inherentImpact,
        residualProb: draft.residualProb,
        residualImpact: draft.residualImpact,
        updatedAt: nowIso,
      });
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setSaveBanner(null);
      return null;
    }

    return builtRecords;
  };

  const handleSave = (returnToDashboard: boolean) => {
    if (!canEdit) return;
    const records = validateAndBuildRecords();
    if (!records || records.length === 0) return;

    records.forEach((rec) => onSaveAssessment(rec));
    setErrors([]);

    const allComplete = records.every(isRiskAssessmentComplete);
    if (returnToDashboard && canReturnToDashboard) {
      onNavigateDashboard();
      return;
    }

    const codeList = records.map((r) => r.kodeRisiko).join(', ');
    setSaveBanner({
      type: allComplete ? 'success' : 'warning',
      text: allComplete
        ? `${records.length} penilaian risiko (${codeList}) untuk [${activeSatker.upgLevel}] ${activeSatker.namaSatker} berhasil disimpan. Status satker tercatat: SELESAI.`
        : `${records.length} penilaian risiko (${codeList}) tersimpan, namun masih ada klaim kontrol berstatus "Belum Dinilai". Lengkapi seluruh klaim efektivitas agar status menjadi SELESAI.`,
    });
  };

  const handleCancel = () => {
    setErrors([]);
    setSaveBanner(null);
    if (canReturnToDashboard) {
      onNavigateDashboard();
    } else {
      setSelectedRiskCodes([]);
      setActiveRiskCode('');
    }
  };

  const inherentCategory = getMatrixRiskCategory(
    riskMatrix,
    inherentProb,
    inherentImpact
  );
  const residualCategory = getMatrixRiskCategory(
    riskMatrix,
    residualProb,
    residualImpact
  );

  const satkerSavedRisks = assessments.filter(
    (a) => a.satkerUniqueId === activeSatker.uniqueId
  );

  return (
    <div className="space-y-4">

      {saveBanner && (
        <div
          className={`flex items-start gap-2.5 rounded-[6px] border px-4 py-3 text-[13px] ${
            saveBanner.type === 'success'
              ? 'border-[#b7e2cb] bg-[#e3f5eb] text-[#135c35]'
              : 'border-[#f0d79d] bg-[#fff8e8] text-[#785716]'
          }`}
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <div>{saveBanner.text}</div>
        </div>
      )}

      {errors.length > 0 && (
        <div className="rounded-[6px] border border-[#f5c2c7] bg-[#fde8e8] px-4 py-3 text-[12px] text-[#9b1c24]">
          <div className="mb-1 flex items-center gap-1.5 font-bold">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Mohon perbaiki isian berikut sebelum menyimpan:</span>
          </div>
          <ul className="m-0 list-disc pl-5 space-y-0.5">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* BAGIAN A: PEMILIHAN RISIKO GRATIFIKASI */}
      <section className="rounded-[7px] border border-[#dce3eb] bg-white p-[18px] shadow-[0_2px_5px_rgba(38,56,75,0.03)]">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#e9eef4] pb-2.5">
          <div>
            <h2 className="m-0 text-[15px] font-bold text-[#1d3554]">
              A. Pemilihan Risiko Gratifikasi
            </h2>
            <p className="m-0 mt-0.5 text-[12px] text-[#718096]">
              Pilih minimal <b>{MIN_SELECTED_RISKS} risiko gratifikasi</b> yang
              relevan pada satuan kerja. Pilih risiko dari daftar lalu klik{' '}
              <b>Tambah Risiko</b>, kemudian klik <b>Isi / Edit</b> pada tabel
              di bawah untuk mengisi kontrol dan penilaian tiap risiko secara
              terpisah.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded px-2.5 py-1 text-[11px] font-bold ${
                selectedRiskCodes.length >= MIN_SELECTED_RISKS
                  ? 'bg-[#e3f5eb] text-[#137a45]'
                  : 'bg-[#fff2d8] text-[#9a6500]'
              }`}
            >
              Dipilih: {selectedRiskCodes.length} / min. {MIN_SELECTED_RISKS}{' '}
              risiko
            </span>
            <span className="rounded bg-[#e7f0fc] px-2.5 py-1 text-[11px] font-bold text-[#1762b5]">
              {activeSatker.upgLevel} · {activeSatker.namaSatker}
            </span>
          </div>
        </div>

        {/* Bar Progres Syarat Minimal 10 Risiko */}
        <div className="mb-3.5 rounded-[6px] border border-[#e3e8ee] bg-[#f8fafc] px-3.5 py-2.5">
          <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2 text-[12px]">
            <span className="font-semibold text-[#45566c]">
              Progres Pemilihan Risiko Gratifikasi
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className={`font-bold ${
                  hasMetMinRisks ? 'text-[#137a45]' : 'text-[#9a6500]'
                }`}
              >
                {hasMetMinRisks
                  ? `Minimal ${MIN_SELECTED_RISKS} risiko terpenuhi`
                  : `Kurang ${MIN_SELECTED_RISKS - selectedRiskCodes.length} risiko lagi`}
              </span>
              <button
                type="button"
                onClick={() => setShowKabawasInfo((prev) => !prev)}
                aria-label="Lihat dasar ketentuan minimal 10 risiko"
                aria-expanded={showKabawasInfo}
                title="Klik untuk melihat dasar ketentuan"
                className="inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-[#d99116] bg-[#fff8e8] text-[11px] font-extrabold leading-none text-[#9a6500] hover:bg-[#ffe8b3]"
              >
                !
              </button>
            </div>
          </div>

          {showKabawasInfo && (
            <div className="mb-2 flex items-center gap-1.5 rounded border border-[#f0d79d] bg-[#fff8e8] px-2.5 py-1.5 text-[11.5px] font-semibold text-[#785716]">
              <AlertCircle className="h-3.5 w-3.5 shrink-0 text-[#d99116]" />
              <span>Berdasarkan Putusan Kabawas</span>
            </div>
          )}

          <div className="h-2 w-full overflow-hidden rounded-full bg-[#e2e8f0]">
            <div
              className={`h-full rounded-full transition-all duration-200 ${
                hasMetMinRisks ? 'bg-[#198754]' : 'bg-[#d99116]'
              }`}
              style={{
                width: `${Math.min(
                  100,
                  Math.round(
                    (selectedRiskCodes.length / MIN_SELECTED_RISKS) * 100
                  )
                )}%`,
              }}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[280px] flex-1 flex flex-col gap-1">
            <label className="text-[12px] font-bold text-[#536477]">
              Tambah Risiko Gratifikasi <span className="text-[#dc3545]">*</span>
            </label>
            <select
              disabled={!canEdit}
              value={riskPickerValue}
              onChange={(e) => setRiskPickerValue(e.target.value)}
              className="rounded border border-[#cfd9e4] bg-white px-3 py-2 text-[13px] text-[#243247] disabled:bg-[#f4f7fa]"
            >
              <option value="">-- Pilih Risiko Gratifikasi --</option>
              {RISK_CONTROL_LIBRARY.map((risk) => {
                const alreadySelected = selectedRiskCodes.includes(
                  risk.kodeRisiko
                );
                return (
                  <option
                    key={risk.kodeRisiko}
                    value={risk.kodeRisiko}
                    disabled={alreadySelected}
                  >
                    {risk.kodeRisiko} — {risk.pernyataanRisiko}
                    {alreadySelected ? ' (Sudah dipilih)' : ''}
                  </option>
                );
              })}
            </select>
          </div>

          <button
            type="button"
            disabled={!riskPickerValue}
            onClick={() => handleAddOrFocusRisk(riskPickerValue)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#1762b5] bg-[#1762b5] px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-[#0d559f] disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Risiko</span>
          </button>

          <button
            type="button"
            onClick={() => setLibraryOpen(true)}
            className="inline-flex cursor-pointer items-center gap-2 rounded border border-[#08a9c4] bg-white px-3.5 py-2 text-[13px] font-semibold text-[#0796b0] hover:bg-[#f0fbfd] transition-colors whitespace-nowrap"
          >
            <BookOpen className="h-4 w-4" />
            <span>Risk and Control Library</span>
          </button>
        </div>

        {/* Tabel Daftar Risiko yang Dipilih (Rapi & Anti Salah Pilih) */}
        <div className="mt-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[12.5px] font-bold text-[#1d3554]">
              Daftar Risiko yang Dipilih ({selectedRiskCodes.length})
            </span>
            <span className="text-[11.5px] text-[#718096]">
              Klik <b>Isi / Edit</b> pada baris risiko untuk mengisi Bagian B,
              C, dan D
            </span>
          </div>

          {selectedRiskCodes.length === 0 ? (
            <div className="rounded border border-dashed border-[#cfd9e4] bg-[#f8fafc] px-4 py-6 text-center text-[13px] text-[#718096]">
              Belum ada risiko yang dipilih. Silakan pilih minimal{' '}
              <b>{MIN_SELECTED_RISKS} risiko</b> melalui menu di atas lalu klik{' '}
              <b>Tambah Risiko</b>.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-[6px] border border-[#dce3eb]">
              <table className="w-full min-w-[780px] border-collapse">
                <thead>
                  <tr className="bg-[#f4f7fa]">
                    <th className="w-[46px] border-b border-[#e3e8ee] px-3 py-2 text-left text-[11px] font-bold uppercase tracking-[0.3px] text-[#45566c]">
                      No.
                    </th>
                    <th className="w-[108px] border-b border-[#e3e8ee] px-3 py-2 text-left text-[11px] font-bold uppercase tracking-[0.3px] text-[#45566c]">
                      Kode
                    </th>
                    <th className="border-b border-[#e3e8ee] px-3 py-2 text-left text-[11px] font-bold uppercase tracking-[0.3px] text-[#45566c]">
                      Pernyataan Risiko
                    </th>
                    <th className="w-[95px] border-b border-[#e3e8ee] px-3 py-2 text-center text-[11px] font-bold uppercase tracking-[0.3px] text-[#45566c]">
                      Kontrol
                    </th>
                    <th className="w-[115px] border-b border-[#e3e8ee] px-3 py-2 text-center text-[11px] font-bold uppercase tracking-[0.3px] text-[#45566c]">
                      Status Isian
                    </th>
                    <th className="w-[170px] border-b border-[#e3e8ee] px-3 py-2 text-right text-[11px] font-bold uppercase tracking-[0.3px] text-[#45566c]">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRiskCodes.map((code, idx) => {
                    const riskItem = RISK_CONTROL_LIBRARY.find(
                      (r) => r.kodeRisiko === code
                    );
                    const isActive = code === activeRiskCode;
                    const draft = riskDrafts[code] ?? createEmptyRiskDraft();
                    const ctrlCount = draft.controls.length;
                    const hasScores =
                      draft.inherentProb !== '' &&
                      draft.inherentImpact !== '' &&
                      draft.residualProb !== '' &&
                      draft.residualImpact !== '';
                    const isDraftComplete =
                      ctrlCount > 0 &&
                      hasScores &&
                      draft.controls.every(
                        (c) =>
                          c.klaimEfektivitas !== 'Belum Dinilai' &&
                          isValidHttpsUrl(c.buktiKlaim) &&
                          c.catatanKlaim.trim().length > 0
                      );

                    return (
                      <tr
                        key={code}
                        className={`transition-colors last:[&>td]:border-b-0 ${
                          isActive
                            ? 'bg-[#eef5fd]'
                            : 'bg-white hover:bg-[#fafcff]'
                        }`}
                      >
                        <td className="border-b border-[#e3e8ee] px-3 py-2.5 text-[12.5px] font-semibold text-[#52647a] tabular-nums">
                          {idx + 1}
                        </td>
                        <td className="border-b border-[#e3e8ee] px-3 py-2.5 whitespace-nowrap">
                          <span
                            className={`font-mono-num rounded px-2 py-0.5 text-[11px] font-bold ${
                              isActive
                                ? 'bg-[#1762b5] text-white'
                                : 'bg-[#e7f0fc] text-[#1762b5]'
                            }`}
                          >
                            {code}
                          </span>
                        </td>
                        <td className="border-b border-[#e3e8ee] px-3 py-2.5 text-[12.5px] text-[#243247]">
                          <div className="line-clamp-2 font-medium">
                            {riskItem?.pernyataanRisiko ?? code}
                          </div>
                        </td>
                        <td className="border-b border-[#e3e8ee] px-3 py-2.5 text-center text-[12px] whitespace-nowrap">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums ${
                              ctrlCount > 0
                                ? 'bg-[#e7f0fc] text-[#1762b5]'
                                : 'bg-[#f1f5f9] text-[#64748b]'
                            }`}
                          >
                            {ctrlCount} kontrol
                          </span>
                        </td>
                        <td className="border-b border-[#e3e8ee] px-3 py-2.5 text-center whitespace-nowrap">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                              isDraftComplete
                                ? 'bg-[#e3f5eb] text-[#137a45]'
                                : 'bg-[#fff2d8] text-[#9a6500]'
                            }`}
                          >
                            {isDraftComplete ? 'Lengkap' : 'Belum Lengkap'}
                          </span>
                        </td>
                        <td className="border-b border-[#e3e8ee] px-3 py-2.5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              disabled={!hasMetMinRisks}
                              onClick={() => handleAddOrFocusRisk(code)}
                              title={
                                hasMetMinRisks
                                  ? `Isi / Edit ${code}`
                                  : `Pilih minimal ${MIN_SELECTED_RISKS} risiko terlebih dahulu`
                              }
                              className={`inline-flex cursor-pointer items-center gap-1 rounded border px-2.5 py-1 text-[11.5px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${
                                isActive && hasMetMinRisks
                                  ? 'border-[#1762b5] bg-[#1762b5] text-white'
                                  : 'border-[#1762b5] bg-white text-[#1762b5] hover:bg-[#eef5fc]'
                              }`}
                            >
                              <Edit3 className="h-3 w-3" />
                              <span>
                                {isActive && hasMetMinRisks
                                  ? 'Sedang Diisi'
                                  : 'Isi / Edit'}
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveRisk(code)}
                              title={`Hapus ${code} dari daftar pilihan`}
                              className="inline-flex cursor-pointer items-center justify-center rounded border border-[#f5c2c7] bg-white p-1.5 text-[#b4232c] hover:bg-[#fde8e8]"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Banner Risiko yang Sedang Aktif Diisi + Navigasi Sebelumnya/Berikutnya */}
        {hasMetMinRisks && activeRiskLib && (
          <div className="mt-4 rounded-[6px] border border-[#9dc2ec] bg-[#f4f9ff] p-3.5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-[#1762b5]" />
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-[#52647a]">
                      Sedang Mengisi Risiko (
                      {selectedRiskCodes.indexOf(activeRiskLib.kodeRisiko) + 1}{' '}
                      dari {selectedRiskCodes.length}):
                    </span>
                    <span className="font-mono-num rounded bg-[#1762b5] px-2 py-0.5 text-[11px] font-bold text-white">
                      {activeRiskLib.kodeRisiko}
                    </span>
                  </div>
                  <div className="text-[13.5px] font-semibold text-[#1d3554]">
                    {activeRiskLib.pernyataanRisiko}
                  </div>
                </div>
              </div>

              {selectedRiskCodes.length > 1 && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    disabled={
                      selectedRiskCodes.indexOf(activeRiskLib.kodeRisiko) <= 0
                    }
                    onClick={() => {
                      const idx = selectedRiskCodes.indexOf(
                        activeRiskLib.kodeRisiko
                      );
                      if (idx > 0) handleAddOrFocusRisk(selectedRiskCodes[idx - 1]);
                    }}
                    className="inline-flex cursor-pointer items-center gap-1 rounded border border-[#cfd9e4] bg-white px-2.5 py-1.5 text-[11.5px] font-semibold text-[#243247] hover:bg-[#edf2f7] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span>Sebelumnya</span>
                  </button>
                  <button
                    type="button"
                    disabled={
                      selectedRiskCodes.indexOf(activeRiskLib.kodeRisiko) >=
                      selectedRiskCodes.length - 1
                    }
                    onClick={() => {
                      const idx = selectedRiskCodes.indexOf(
                        activeRiskLib.kodeRisiko
                      );
                      if (idx >= 0 && idx < selectedRiskCodes.length - 1) {
                        handleAddOrFocusRisk(selectedRiskCodes[idx + 1]);
                      }
                    }}
                    className="inline-flex cursor-pointer items-center gap-1 rounded border border-[#cfd9e4] bg-white px-2.5 py-1.5 text-[11.5px] font-semibold text-[#243247] hover:bg-[#edf2f7] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span>Berikutnya</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {!hasMetMinRisks ? (
        <section className="rounded-[7px] border border-[#f0d79d] bg-[#fffcf2] p-6 text-center shadow-[0_2px_5px_rgba(38,56,75,0.03)]">
          <div className="mx-auto mb-2.5 grid h-11 w-11 place-items-center rounded-full bg-[#fff2d8] text-[#9a6500]">
            <Lock className="h-5 w-5" />
          </div>
          <h3 className="m-0 text-[15px] font-bold text-[#785716]">
            Tahap Selanjutnya Belum Dapat Dibuka
          </h3>
          <p className="mx-auto mt-1.5 mb-0 max-w-[560px] text-[13px] text-[#785716]/90">
            Pilih minimal <b>{MIN_SELECTED_RISKS} risiko gratifikasi</b> pada{' '}
            <b>Bagian A</b> (kurang{' '}
            <b>{MIN_SELECTED_RISKS - selectedRiskCodes.length} risiko lagi</b>)
            untuk melanjutkan ke <b>Bagian B (Penilaian Risiko Inherent)</b>,{' '}
            <b>Bagian C (Kontrol Berjalan)</b>, dan{' '}
            <b>Bagian D (Penilaian Risiko Residual)</b>.
          </p>
        </section>
      ) : (
        <>
      {/* BAR MATRIKS ANALISIS RISIKO 5X5 */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-[6px] border border-[#dce3eb] bg-[#f8fafc] px-4 py-2.5 text-[12px] text-[#52647a]">
        <span>
          Kategori tingkat risiko menggunakan <b>Matriks Analisis Risiko 5×5</b>{' '}
          (5 Kemungkinan × 5 Dampak).
        </span>
        <button
          type="button"
          onClick={() => setMatrixModalOpen(true)}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#1762b5] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#1762b5] hover:bg-[#eef5fc]"
        >
          <Settings2 className="h-3.5 w-3.5" />
          <span>
            {canConfigMatrix
              ? 'Konfigurasi Matriks Risiko (Admin)'
              : 'Lihat Matriks Risiko'}
          </span>
        </button>
      </div>

      {/* BAGIAN B: PENILAIAN RISIKO INHERENT */}
      <section className="rounded-[7px] border border-[#dce3eb] bg-white p-[18px] shadow-[0_2px_5px_rgba(38,56,75,0.03)]">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#e9eef4] pb-2.5">
          <div>
            <h2 className="m-0 text-[15px] font-bold text-[#1d3554]">
              B. Penilaian Risiko Inherent
            </h2>
            <p className="m-0 mt-0.5 text-[12px] text-[#718096]">
              Penilaian risiko <b>sebelum</b> memperhitungkan pengendalian yang
              berjalan.
            </p>
          </div>
          {activeRiskLib && (
            <span className="font-mono-num rounded bg-[#1762b5] px-2.5 py-1 text-[11px] font-bold text-white">
              {activeRiskLib.kodeRisiko}
            </span>
          )}
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3.5 max-md:grid-cols-1">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-[#536477]">
                1. Probabilitas Inherent{' '}
                <span className="text-[#dc3545]">*</span>
              </label>
              <select
                disabled={!canEdit}
                value={inherentProb}
                onChange={(e) =>
                  setInherentProb(e.target.value ? Number(e.target.value) : '')
                }
                className="rounded border border-[#cfd9e4] bg-white px-3 py-2 text-[13px] text-[#243247] disabled:bg-[#f4f7fa]"
              >
                <option value="">-- Pilih Level Probabilitas Inherent --</option>
                {PROBABILITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-[#536477]">
                2. Dampak Inherent <span className="text-[#dc3545]">*</span>
              </label>
              <select
                disabled={!canEdit}
                value={inherentImpact}
                onChange={(e) =>
                  setInherentImpact(
                    e.target.value ? Number(e.target.value) : ''
                  )
                }
                className="rounded border border-[#cfd9e4] bg-white px-3 py-2 text-[13px] text-[#243247] disabled:bg-[#f4f7fa]"
              >
                <option value="">-- Pilih Level Dampak Inherent --</option>
                {IMPACT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Hasil Penilaian Inherent Terpisah */}
          <div className="mt-2 rounded-[6px] border border-[#dce3eb] bg-[#f7faff] p-3.5">
            <div className="text-[11px] font-bold uppercase tracking-wide text-[#52647a]">
              Hasil Penilaian Inherent
            </div>
            {inherentProb !== '' && inherentImpact !== '' ? (
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <div className="text-[12px] text-[#243247]">
                  Probabilitas: <b>Level {inherentProb}</b> · Dampak:{' '}
                  <b>Level {inherentImpact}</b> · Skor:{' '}
                  <b className="font-mono-num">
                    {Number(inherentProb) * Number(inherentImpact)}
                  </b>
                </div>
                <span
                  className={`rounded-full border px-3 py-0.5 text-[12px] font-bold ${getCategoryBadgeClass(
                    inherentCategory
                  )}`}
                >
                  {inherentCategory}
                </span>
              </div>
            ) : (
              <div className="mt-1 text-[12px] text-[#8492a3]">
                Lengkapi Probabilitas dan Dampak Inherent untuk melihat hasil.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* BAGIAN C: KONTROL BERJALAN (PILIH MANUAL) */}
      <section className="rounded-[7px] border border-[#dce3eb] bg-white p-[18px] shadow-[0_2px_5px_rgba(38,56,75,0.03)]">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#e9eef4] pb-2.5">
          <div>
            <h2 className="m-0 text-[15px] font-bold text-[#1d3554]">
              C. Kontrol Berjalan
            </h2>
            <p className="m-0 mt-0.5 text-[12px] text-[#718096]">
              Pilih dan tambahkan kontrol berjalan secara manual sesuai
              pengendalian yang diterapkan pada satuan kerja, lalu lengkapi
              klaim efektivitasnya.
            </p>
          </div>
          {activeRiskLib && (
            <span className="font-mono-num rounded bg-[#1762b5] px-2.5 py-1 text-[11px] font-bold text-white">
              {activeRiskLib.kodeRisiko}
            </span>
          )}
        </div>

        {!activeRiskLib ? (
          <div className="rounded border border-dashed border-[#cfd9e4] bg-[#f8fafc] px-4 py-6 text-center text-[13px] text-[#718096]">
            Pilih risiko pada <b>Bagian A</b> terlebih dahulu untuk memilih dan
            menambahkan Kontrol Berjalan.
          </div>
        ) : (
          <div className="space-y-4">
            {/* Picker Kontrol Manual */}
            <div className="rounded-[6px] border border-[#dce3eb] bg-[#f8fafc] p-3.5">
              <div className="flex flex-wrap items-end gap-2.5">
                <div className="min-w-[240px] flex-1 flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-[#536477]">
                    Pilih Kontrol yang Diterapkan{' '}
                    <span className="text-[#dc3545]">*</span>
                  </label>
                  <select
                    disabled={!canEdit}
                    value={selectedControlOption}
                    onChange={(e) => {
                      setSelectedControlOption(e.target.value);
                      setControlPickerError(null);
                    }}
                    className="rounded border border-[#cfd9e4] bg-white px-3 py-2 text-[13px] text-[#243247]"
                  >
                    <option value="">-- Pilih Kontrol --</option>
                    {AVAILABLE_CONTROL_OPTIONS.map((ctrlName) => {
                      const alreadyAdded = controls.some(
                        (c) =>
                          c.controlName.toLowerCase() === ctrlName.toLowerCase()
                      );
                      return (
                        <option
                          key={ctrlName}
                          value={ctrlName}
                          disabled={alreadyAdded}
                        >
                          {ctrlName}
                          {alreadyAdded ? ' (Sudah ditambahkan)' : ''}
                        </option>
                      );
                    })}
                    <option value={CUSTOM_CONTROL_VALUE}>
                      + Lainnya (Input Manual)...
                    </option>
                  </select>
                </div>

                {selectedControlOption === CUSTOM_CONTROL_VALUE && (
                  <div className="min-w-[240px] flex-1 flex flex-col gap-1">
                    <label className="text-[12px] font-bold text-[#536477]">
                      Nama Kontrol Manual{' '}
                      <span className="text-[#dc3545]">*</span>
                    </label>
                    <input
                      type="text"
                      value={customControlName}
                      onChange={(e) => {
                        setCustomControlName(e.target.value);
                        setControlPickerError(null);
                      }}
                      placeholder="Ketik nama kontrol berjalan..."
                      className="rounded border border-[#cfd9e4] bg-white px-3 py-2 text-[13px] text-[#243247]"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleAddControl}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded border border-[#1762b5] bg-[#1762b5] px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-[#0d559f] whitespace-nowrap"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah Kontrol</span>
                </button>
              </div>

              {controlPickerError && (
                <div className="mt-2 text-[11.5px] font-medium text-[#dc3545]">
                  {controlPickerError}
                </div>
              )}
            </div>

            {controls.length === 0 ? (
              <div className="rounded border border-dashed border-[#cfd9e4] bg-[#fbfcfe] px-4 py-6 text-center text-[13px] text-[#718096]">
                Belum ada kontrol yang dipilih. Silakan pilih kontrol pada menu
                di atas lalu klik <b>Tambah Kontrol</b>.
              </div>
            ) : (
              controls.map((ctrl, idx) => {
                const urlInvalid =
                  ctrl.buktiKlaim.trim().length > 0 &&
                  !isValidHttpsUrl(ctrl.buktiKlaim);
                return (
                  <div
                    key={ctrl.controlName}
                    className="rounded-[6px] border border-[#dce3eb] bg-[#fbfcfe] p-4"
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#e9eef4] pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-[#1762b5] px-2 py-0.5 text-[11px] font-bold text-white">
                          Kontrol #{idx + 1}
                        </span>
                        <span className="text-[14px] font-bold text-[#1d3554]">
                          {ctrl.controlName}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveControl(idx)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded border border-[#f5c2c7] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#b4232c] hover:bg-[#fde8e8]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-12 gap-3 max-md:grid-cols-1">
                      {/* 1. Klaim Efektivitas Kontrol */}
                      <div className="col-span-4 max-md:col-span-1 flex flex-col gap-1">
                        <label className="text-[12px] font-bold text-[#536477]">
                          1. Klaim Efektivitas Kontrol{' '}
                          <span className="text-[#dc3545]">*</span>
                        </label>
                        <select
                          disabled={!canEdit}
                          value={ctrl.klaimEfektivitas}
                          onChange={(e) =>
                            updateControl(idx, {
                              klaimEfektivitas: e.target
                                .value as ControlEffectivenessClaim,
                            })
                          }
                          className="rounded border border-[#cfd9e4] bg-white px-2.5 py-2 text-[13px] text-[#243247] disabled:bg-[#f4f7fa]"
                        >
                          {CLAIM_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* 4. Tahun Pelaksanaan */}
                      <div className="col-span-4 max-md:col-span-1 flex flex-col gap-1">
                        <label className="text-[12px] font-bold text-[#536477]">
                          4. Tahun Pelaksanaan{' '}
                          <span className="text-[#dc3545]">*</span>
                        </label>
                        <select
                          disabled={!canEdit}
                          value={ctrl.tahun}
                          onChange={(e) =>
                            updateControl(idx, { tahun: e.target.value })
                          }
                          className="rounded border border-[#cfd9e4] bg-white px-2.5 py-2 text-[13px] text-[#243247] disabled:bg-[#f4f7fa]"
                        >
                          {YEAR_OPTIONS.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* 5. Periode Pelaksanaan */}
                      <div className="col-span-4 max-md:col-span-1 flex flex-col gap-1">
                        <label className="text-[12px] font-bold text-[#536477]">
                          5. Periode Pelaksanaan{' '}
                          <span className="text-[#dc3545]">*</span>
                        </label>
                        <select
                          disabled={!canEdit}
                          value={ctrl.periode}
                          onChange={(e) =>
                            updateControl(idx, {
                              periode: e.target.value as QuarterPeriod,
                            })
                          }
                          className="rounded border border-[#cfd9e4] bg-white px-2.5 py-2 text-[13px] text-[#243247] disabled:bg-[#f4f7fa]"
                        >
                          {PERIOD_OPTIONS.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* 2. Bukti Klaim */}
                      <div className="col-span-12 max-md:col-span-1 flex flex-col gap-1">
                        <label className="text-[12px] font-bold text-[#536477]">
                          2. Bukti Klaim (Tautan URL HTTPS){' '}
                          <span className="text-[#dc3545]">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="url"
                            disabled={!canEdit}
                            value={ctrl.buktiKlaim}
                            onChange={(e) =>
                              updateControl(idx, { buktiKlaim: e.target.value })
                            }
                            placeholder="https://drive.mahkamahagung.go.id/bukti-kontrol"
                            className={`flex-1 rounded border px-3 py-2 text-[13px] text-[#243247] disabled:bg-[#f4f7fa] ${
                              urlInvalid
                                ? 'border-[#dc3545] bg-[#fff5f5]'
                                : 'border-[#cfd9e4] bg-white'
                            }`}
                          />
                          {isValidHttpsUrl(ctrl.buktiKlaim) && (
                            <a
                              href={ctrl.buktiKlaim.trim()}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded border border-[#08a9c4] bg-white px-2.5 py-2 text-[12px] font-semibold text-[#0796b0] hover:bg-[#f0fbfd]"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              <span>Buka</span>
                            </a>
                          )}
                        </div>
                        {urlInvalid && (
                          <span className="text-[11px] font-medium text-[#dc3545]">
                            Format URL tidak valid. Wajib menggunakan tautan
                            HTTPS (contoh: https://...).
                          </span>
                        )}
                      </div>

                      {/* 3. Catatan Klaim */}
                      <div className="col-span-12 max-md:col-span-1 flex flex-col gap-1">
                        <label className="text-[12px] font-bold text-[#536477]">
                          3. Catatan Klaim{' '}
                          <span className="text-[#dc3545]">*</span>
                        </label>
                        <textarea
                          disabled={!canEdit}
                          value={ctrl.catatanKlaim}
                          onChange={(e) =>
                            updateControl(idx, { catatanKlaim: e.target.value })
                          }
                          placeholder="Jelaskan pelaksanaan kontrol dan dasar klaim efektivitasnya..."
                          className="min-h-[75px] resize-y rounded border border-[#cfd9e4] bg-white px-3 py-2 text-[13px] text-[#243247] disabled:bg-[#f4f7fa]"
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </section>

      {/* BAGIAN D: PENILAIAN RISIKO RESIDUAL */}
      <section className="rounded-[7px] border border-[#dce3eb] bg-white p-[18px] shadow-[0_2px_5px_rgba(38,56,75,0.03)]">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#e9eef4] pb-2.5">
          <div>
            <h2 className="m-0 text-[15px] font-bold text-[#1d3554]">
              D. Penilaian Risiko Residual
            </h2>
            <p className="m-0 mt-0.5 text-[12px] text-[#718096]">
              Penilaian risiko <b>setelah</b> memperhitungkan pengendalian yang
              berjalan.
            </p>
          </div>
          {activeRiskLib && (
            <span className="font-mono-num rounded bg-[#1762b5] px-2.5 py-1 text-[11px] font-bold text-white">
              {activeRiskLib.kodeRisiko}
            </span>
          )}
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3.5 max-md:grid-cols-1">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-[#536477]">
                1. Probabilitas Residual{' '}
                <span className="text-[#dc3545]">*</span>
              </label>
              <select
                disabled={!canEdit}
                value={residualProb}
                onChange={(e) =>
                  setResidualProb(e.target.value ? Number(e.target.value) : '')
                }
                className="rounded border border-[#cfd9e4] bg-white px-3 py-2 text-[13px] text-[#243247] disabled:bg-[#f4f7fa]"
              >
                <option value="">-- Pilih Level Probabilitas Residual --</option>
                {PROBABILITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-[#536477]">
                2. Dampak Residual <span className="text-[#dc3545]">*</span>
              </label>
              <select
                disabled={!canEdit}
                value={residualImpact}
                onChange={(e) =>
                  setResidualImpact(
                    e.target.value ? Number(e.target.value) : ''
                  )
                }
                className="rounded border border-[#cfd9e4] bg-white px-3 py-2 text-[13px] text-[#243247] disabled:bg-[#f4f7fa]"
              >
                <option value="">-- Pilih Level Dampak Residual --</option>
                {IMPACT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Hasil Penilaian Residual Terpisah */}
          <div className="mt-2 rounded-[6px] border border-[#dce3eb] bg-[#f7faff] p-3.5">
            <div className="text-[11px] font-bold uppercase tracking-wide text-[#52647a]">
              Hasil Penilaian Residual
            </div>
            {residualProb !== '' && residualImpact !== '' ? (
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <div className="text-[12px] text-[#243247]">
                  Probabilitas: <b>Level {residualProb}</b> · Dampak:{' '}
                  <b>Level {residualImpact}</b> · Skor:{' '}
                  <b className="font-mono-num">
                    {Number(residualProb) * Number(residualImpact)}
                  </b>
                </div>
                <span
                  className={`rounded-full border px-3 py-0.5 text-[12px] font-bold ${getCategoryBadgeClass(
                    residualCategory
                  )}`}
                >
                  {residualCategory}
                </span>
              </div>
            ) : (
              <div className="mt-1 text-[12px] text-[#8492a3]">
                Lengkapi Probabilitas dan Dampak Residual untuk melihat hasil.
              </div>
            )}
          </div>
        </div>
      </section>
        </>
      )}

      {/* Tombol Akhir Formulir */}
      <div className="flex flex-wrap items-center justify-end gap-2.5 rounded-[7px] border border-[#dce3eb] bg-white px-5 py-4 shadow-[0_2px_5px_rgba(38,56,75,0.03)]">
        <button
          type="button"
          onClick={handleCancel}
          className="cursor-pointer rounded border border-[#ccd7e3] bg-white px-4 py-2 text-[13px] font-semibold text-[#536477] hover:bg-[#f8fafc]"
        >
          Batal
        </button>

        {canEdit && (
          <>
            <button
              type="button"
              disabled={!hasMetMinRisks}
              onClick={() => handleSave(false)}
              className="cursor-pointer rounded border border-[#08a9c4] bg-white px-4 py-2 text-[13px] font-semibold text-[#0796b0] hover:bg-[#f0fbfd] disabled:cursor-not-allowed disabled:opacity-45"
            >
              Simpan
            </button>
            <button
              type="button"
              disabled={!hasMetMinRisks}
              onClick={() => handleSave(true)}
              className="cursor-pointer rounded border border-[#1762b5] bg-[#1762b5] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#0d559f] disabled:cursor-not-allowed disabled:opacity-45"
            >
              Simpan dan Kembali
            </button>
          </>
        )}
      </div>

      {/* Modals */}
      <RiskLibraryModal
        open={libraryOpen}
        initialRiskCode={activeRiskCode || RISK_CONTROL_LIBRARY[0].kodeRisiko}
        onClose={() => setLibraryOpen(false)}
        onSelectRisk={canEdit ? handleAddOrFocusRisk : undefined}
      />

      <RiskMatrixConfigModal
        open={matrixModalOpen}
        config={riskMatrix}
        canEdit={canConfigMatrix}
        onClose={() => setMatrixModalOpen(false)}
        onSave={onSaveRiskMatrix}
      />
    </div>
  );
}
