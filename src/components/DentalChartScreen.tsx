import React, { useState, useMemo } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  AlertCircle,
  Clock,
  CheckCircle2,
  Trash2,
  X,
  Info,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Patient, ToothRecord, ToothStatus } from '../types';
import { ADULT_TEETH, PEDIATRIC_TEETH, PROCEDURE_OPTIONS, ToothMeta } from '../data/toothData';

interface DentalChartScreenProps {
  patient: Patient;
}

export const DentalChartScreen: React.FC<DentalChartScreenProps> = ({ patient }) => {
  const { toothRecords, updateToothRecord, resetToothRecord, showToast } = useApp();
  const [chartType, setChartType] = useState<'adult' | 'pediatric'>('adult');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedTooth, setSelectedTooth] = useState<ToothMeta | null>(null);

  // Bottom sheet modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<ToothStatus>('planned');
  const [formProcedure, setFormProcedure] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formSurface, setFormSurface] = useState('');

  // Active teeth list based on mode
  const teethMetaList = chartType === 'adult' ? ADULT_TEETH : PEDIATRIC_TEETH;

  // Patient's recorded conditions map for fast lookup
  const recordsMap = useMemo(() => {
    const map = new Map<number, ToothRecord>();
    toothRecords
      .filter((r) => r.patientId === patient.id && r.chartType === chartType)
      .forEach((r) => {
        map.set(r.toothNumber, r);
      });
    return map;
  }, [toothRecords, patient.id, chartType]);

  const handleToothClick = (tooth: ToothMeta) => {
    setSelectedTooth(tooth);
    const existing = recordsMap.get(tooth.number);
    if (existing) {
      setFormStatus(existing.status);
      setFormProcedure(existing.procedureName);
      setFormNotes(existing.notes || '');
      setFormSurface(existing.surface || '');
    } else {
      setFormStatus('planned');
      setFormProcedure('Class II Composite Restoration (MOD)');
      setFormNotes('');
      setFormSurface('O');
    }
    setModalOpen(true);
  };

  const handleSaveTooth = () => {
    if (!selectedTooth) return;

    updateToothRecord({
      patientId: patient.id,
      toothNumber: selectedTooth.number,
      chartType,
      status: formStatus,
      procedureName: formProcedure || 'General Odontic Treatment',
      notes: formNotes,
      surface: formSurface,
    });

    setModalOpen(false);
  };

  const handleResetTooth = () => {
    if (!selectedTooth) return;
    resetToothRecord(patient.id, selectedTooth.number, chartType);
    setModalOpen(false);
  };

  // Color mapping per specification:
  // White/outline = healthy
  // Green fill = treatment planned (#1E8E5A)
  // Amber/yellow fill = treatment in progress (#F39C12)
  // Red/salmon fill = treatment completed or needs attention (#C0392B / #E74C3C)
  const getToothColors = (record?: ToothRecord) => {
    if (!record || record.status === 'healthy') {
      return {
        fill: '#FFFFFF',
        stroke: '#2B2D33',
        strokeWidth: '1.5',
        labelColor: '#2B2D33',
        textClass: 'text-gray-700',
      };
    }
    switch (record.status) {
      case 'planned':
        return {
          fill: '#1E8E5A', // Forest green
          stroke: '#14603c',
          strokeWidth: '2',
          labelColor: '#1E8E5A',
          textClass: 'text-[#1E8E5A] font-bold',
        };
      case 'in_progress':
        return {
          fill: '#F39C12', // Amber / yellow
          stroke: '#b87204',
          strokeWidth: '2',
          labelColor: '#D97706',
          textClass: 'text-amber-600 font-bold',
        };
      case 'completed':
      case 'needs_attention':
        return {
          fill: '#E74C3C', // Salmon / red
          stroke: '#962d22',
          strokeWidth: '2',
          labelColor: '#C0392B',
          textClass: 'text-[#C0392B] font-bold',
        };
      case 'missing':
        return {
          fill: '#E5E7EB',
          stroke: '#9CA3AF',
          strokeWidth: '1.5',
          strokeDasharray: '4 2',
          labelColor: '#9CA3AF',
          textClass: 'text-gray-400 line-through',
        };
      default:
        return {
          fill: '#FFFFFF',
          stroke: '#2B2D33',
          strokeWidth: '1.5',
          labelColor: '#2B2D33',
          textClass: 'text-gray-700',
        };
    }
  };

  // Pre-calculated geometric positions along the dental arch for upper & lower
  // SVG coordinates: Center around (200, 240). Upper arch curves 1..16. Lower arch curves 32..17.
  const getToothCoordinates = (index: number, totalInArch: number, arch: 'upper' | 'lower') => {
    const cx = 200;
    const cy = arch === 'upper' ? 140 : 330;
    const rx = 145;
    const ry = 100;

    // Normalize angle
    // In upper arch: tooth 1 starts on the right (angle ~ 0 rad) and curves to tooth 16 on the left (angle ~ pi rad)
    const t = index / (totalInArch - 1); // 0 to 1
    const angle = arch === 'upper' 
      ? Math.PI * 0.95 - t * Math.PI * 0.90 
      : Math.PI * 0.05 + t * Math.PI * 0.90;

    const x = cx + rx * Math.cos(angle);
    const y = cy - (arch === 'upper' ? 1 : -1) * ry * Math.sin(angle);

    // Label offset
    const labelDistance = 26;
    const labelX = cx + (rx + labelDistance) * Math.cos(angle);
    const labelY = cy - (arch === 'upper' ? 1 : -1) * (ry + labelDistance) * Math.sin(angle);

    return { x, y, labelX, labelY, angle };
  };

  const upperTeeth = teethMetaList.filter((t) => t.arch === 'upper');
  const lowerTeeth = teethMetaList.filter((t) => t.arch === 'lower');

  return (
    <div className="pb-24 max-w-4xl mx-auto w-full">
      {/* 1. Top Header Banner matching Patient Profile */}
      <div className="relative bg-gradient-to-b from-[#1E88C7] to-[#1678b0] pt-4 pb-12 px-4 text-white text-center rounded-b-3xl shadow-sm">
        <div className="inline-block mt-1">
          {patient.avatar ? (
            <img
              src={patient.avatar}
              alt={patient.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md mx-auto"
            />
          ) : (
            <div
              className="w-16 h-16 rounded-full border-2 border-white shadow-md flex items-center justify-center font-bold text-white text-xl mx-auto"
              style={{ backgroundColor: patient.avatarColor || '#1E88C7' }}
            >
              {patient.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
          )}
        </div>
        <h2 className="mt-1 text-lg font-bold tracking-tight">
          {patient.name}, Dental Chart
        </h2>
        <p className="text-xs text-white/80">
          Tap any tooth to log condition, treatment plan, or procedure
        </p>
      </div>

      {/* 2. Toggle Switch: Adult / Pediatric (Segmented control) */}
      <div className="px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl p-1.5 shadow-md border border-gray-100 flex max-w-sm mx-auto">
          <button
            onClick={() => setChartType('adult')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              chartType === 'adult'
                ? 'bg-[#1E88C7] text-white shadow-xs'
                : 'text-[#767B87] hover:text-[#2B2D33]'
            }`}
          >
            Adult (1–32)
          </button>
          <button
            onClick={() => setChartType('pediatric')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              chartType === 'pediatric'
                ? 'bg-[#1E88C7] text-white shadow-xs'
                : 'text-[#767B87] hover:text-[#2B2D33]'
            }`}
          >
            Pediatric (Primary)
          </button>
        </div>
      </div>

      {/* 3. Interactive Odontogram Vector Diagram Container */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 relative overflow-hidden">
          {/* Zoom controls */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-gray-100/90 backdrop-blur-xs p-1 rounded-xl shadow-xs z-10">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
              className="p-1.5 text-gray-700 hover:text-[#1E88C7] hover:bg-white rounded-lg transition-colors"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
              className="p-1.5 text-gray-700 hover:text-[#1E88C7] hover:bg-white rounded-lg transition-colors"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 text-gray-700 hover:text-[#1E88C7] hover:bg-white rounded-lg transition-colors"
              title="Reset Zoom"
              aria-label="Reset Zoom"
            >
              <RotateCcw size={15} />
            </button>
          </div>

          {/* Arch Labels */}
          <div className="flex justify-between items-center text-[11px] font-bold text-[#767B87] uppercase tracking-wider mb-2 px-2">
            <span>Right (Patient's Right)</span>
            <span className="text-[#1E88C7] bg-[#1E88C7]/10 px-2.5 py-0.5 rounded-full">
              Maxillary Arch (Upper)
            </span>
            <span>Left (Patient's Left)</span>
          </div>

          {/* SVG Arch Graphic */}
          <div className="w-full flex justify-center items-center overflow-x-auto py-2">
            <div
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
                transition: 'transform 0.2s ease-out',
              }}
              className="w-full max-w-[420px]"
            >
              <svg
                viewBox="0 0 400 480"
                className="w-full h-auto select-none drop-shadow-xs"
              >
                <defs>
                  {/* Subtle shadows and gradients */}
                  <filter id="tooth-shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodOpacity="0.15" />
                  </filter>
                </defs>

                {/* Arch guidelines (subtle curved dotted lines) */}
                <path
                  d="M 55 140 Q 200 40 345 140"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <path
                  d="M 55 330 Q 200 430 345 330"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Midline vertical indicator */}
                <line
                  x1="200"
                  y1="35"
                  x2="200"
                  y2="445"
                  stroke="#1E88C7"
                  strokeWidth="1"
                  strokeOpacity="0.25"
                  strokeDasharray="2 3"
                />

                {/* UPPER TEETH */}
                {upperTeeth.map((tooth, idx) => {
                  const { x, y, labelX, labelY } = getToothCoordinates(
                    idx,
                    upperTeeth.length,
                    'upper'
                  );
                  const record = recordsMap.get(tooth.number);
                  const colors = getToothColors(record);
                  const isSelected = selectedTooth?.number === tooth.number;

                  return (
                    <g
                      key={`upper-${tooth.number}`}
                      onClick={() => handleToothClick(tooth)}
                      className="cursor-pointer group"
                    >
                      {/* Tooth Number Label */}
                      <text
                        x={labelX}
                        y={labelY}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="11"
                        fontWeight="700"
                        fill={record ? colors.labelColor : '#4B5563'}
                        className="transition-all"
                      >
                        {tooth.pediatricLabel || tooth.label}
                      </text>

                      {/* Tooth Body: Anatomical rounded shape */}
                      <rect
                        x={x - 11}
                        y={y - 12}
                        width="22"
                        height="24"
                        rx={tooth.type === 'molar' ? '6' : tooth.type === 'canine' ? '10' : '4'}
                        fill={colors.fill}
                        stroke={isSelected ? '#9B59D0' : colors.stroke}
                        strokeWidth={isSelected ? '2.5' : colors.strokeWidth}
                        strokeDasharray={colors.strokeDasharray}
                        filter="url(#tooth-shadow)"
                        className="transition-all hover:opacity-90 hover:stroke-[#1E88C7]"
                      />

                      {/* Anatomical occlusal cross / fissure lines */}
                      {tooth.type === 'molar' && (
                        <path
                          d={`M ${x - 5} ${y - 4} L ${x + 5} ${y + 4} M ${x + 5} ${y - 4} L ${x - 5} ${y + 4}`}
                          stroke={record && record.status !== 'healthy' ? '#FFFFFF' : '#9CA3AF'}
                          strokeWidth="1"
                          strokeOpacity="0.6"
                          pointerEvents="none"
                        />
                      )}
                      {tooth.type === 'premolar' && (
                        <line
                          x1={x - 5}
                          y1={y}
                          x2={x + 5}
                          y2={y}
                          stroke={record && record.status !== 'healthy' ? '#FFFFFF' : '#9CA3AF'}
                          strokeWidth="1"
                          strokeOpacity="0.6"
                          pointerEvents="none"
                        />
                      )}
                    </g>
                  );
                })}

                {/* Central Arch Divider Label */}
                <text
                  x="200"
                  y="235"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="10"
                  fontWeight="800"
                  fill="#9CA3AF"
                  letterSpacing="1"
                >
                  INCISAL PLANE
                </text>

                {/* LOWER TEETH */}
                {lowerTeeth.map((tooth, idx) => {
                  const { x, y, labelX, labelY } = getToothCoordinates(
                    idx,
                    lowerTeeth.length,
                    'lower'
                  );
                  const record = recordsMap.get(tooth.number);
                  const colors = getToothColors(record);
                  const isSelected = selectedTooth?.number === tooth.number;

                  return (
                    <g
                      key={`lower-${tooth.number}`}
                      onClick={() => handleToothClick(tooth)}
                      className="cursor-pointer group"
                    >
                      {/* Tooth Number Label */}
                      <text
                        x={labelX}
                        y={labelY}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="11"
                        fontWeight="700"
                        fill={record ? colors.labelColor : '#4B5563'}
                        className="transition-all"
                      >
                        {tooth.pediatricLabel || tooth.label}
                      </text>

                      {/* Tooth Body */}
                      <rect
                        x={x - 11}
                        y={y - 12}
                        width="22"
                        height="24"
                        rx={tooth.type === 'molar' ? '6' : tooth.type === 'canine' ? '10' : '4'}
                        fill={colors.fill}
                        stroke={isSelected ? '#9B59D0' : colors.stroke}
                        strokeWidth={isSelected ? '2.5' : colors.strokeWidth}
                        strokeDasharray={colors.strokeDasharray}
                        filter="url(#tooth-shadow)"
                        className="transition-all hover:opacity-90 hover:stroke-[#1E88C7]"
                      />

                      {/* Anatomical occlusal lines */}
                      {tooth.type === 'molar' && (
                        <path
                          d={`M ${x - 5} ${y - 4} L ${x + 5} ${y + 4} M ${x + 5} ${y - 4} L ${x - 5} ${y + 4}`}
                          stroke={record && record.status !== 'healthy' ? '#FFFFFF' : '#9CA3AF'}
                          strokeWidth="1"
                          strokeOpacity="0.6"
                          pointerEvents="none"
                        />
                      )}
                      {tooth.type === 'premolar' && (
                        <line
                          x1={x - 5}
                          y1={y}
                          x2={x + 5}
                          y2={y}
                          stroke={record && record.status !== 'healthy' ? '#FFFFFF' : '#9CA3AF'}
                          strokeWidth="1"
                          strokeOpacity="0.6"
                          pointerEvents="none"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="flex justify-center items-center text-[11px] font-bold text-[#1E88C7] uppercase tracking-wider mt-1">
            <span className="bg-[#1E88C7]/10 px-2.5 py-0.5 rounded-full">
              Mandibular Arch (Lower)
            </span>
          </div>
        </div>
      </div>

      {/* 4. Color Code Legend Bar per specification */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-3.5 shadow-2xs border border-gray-100">
          <span className="text-[11px] font-bold text-[#767B87] uppercase tracking-wider block mb-2">
            Condition Legend
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md border-2 border-gray-800 bg-white" />
              <span className="text-gray-700">Healthy / Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-[#1E8E5A]" />
              <span className="text-gray-700">Treatment Planned</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-[#F39C12]" />
              <span className="text-gray-700">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-[#E74C3C]" />
              <span className="text-gray-700">Completed / Urgent</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Currently Logged Conditions List for this patient */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-2xs border border-gray-100">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-3">
            <h3 className="font-bold text-sm text-[#2B2D33]">
              Recorded Chart Entries ({toothRecords.filter((r) => r.patientId === patient.id).length})
            </h3>
            <span className="text-xs text-[#767B87]">Universal #1–32</span>
          </div>

          <div className="space-y-2">
            {toothRecords
              .filter((r) => r.patientId === patient.id)
              .map((rec) => {
                const colors = getToothColors(rec);
                return (
                  <div
                    key={rec.id}
                    onClick={() => {
                      const t = ADULT_TEETH.find((x) => x.number === rec.toothNumber) ||
                        PEDIATRIC_TEETH.find((x) => x.number === rec.toothNumber);
                      if (t) handleToothClick(t);
                    }}
                    className="p-3 rounded-xl bg-[#F5F6F8] hover:bg-blue-50/50 cursor-pointer flex items-center justify-between transition-colors border border-transparent hover:border-[#1E88C7]/30"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-2xs"
                        style={{ backgroundColor: colors.fill === '#FFFFFF' ? '#767B87' : colors.fill }}
                      >
                        #{rec.toothNumber}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-[#2B2D33]">{rec.procedureName}</p>
                        <p className="text-[11px] text-[#767B87]">
                          {rec.surface ? `Surface: ${rec.surface} • ` : ''}
                          {rec.notes || 'No notes added'}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${colors.textClass}`}
                    >
                      {rec.status.replace('_', ' ')}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* 6. Tooth Procedure Bottom Sheet Modal */}
      {modalOpen && selectedTooth && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 z-10 animate-in slide-in-from-bottom duration-200">
            {/* Sheet Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#1E88C7] text-white flex items-center justify-center font-extrabold text-sm">
                  #{selectedTooth.pediatricLabel || selectedTooth.number}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#2B2D33]">
                    Tooth #{selectedTooth.pediatricLabel || selectedTooth.number}
                  </h3>
                  <p className="text-xs text-[#767B87]">{selectedTooth.name}</p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Fields */}
            <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Status Picker (Color-coded) */}
              <div>
                <label className="text-xs font-bold text-[#767B87] uppercase tracking-wider block mb-2">
                  Clinical Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormStatus('planned')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                      formStatus === 'planned'
                        ? 'bg-[#1E8E5A] text-white border-[#1E8E5A] shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-3 h-3 rounded-full bg-white border border-black/20" />
                    <span>Treatment Planned</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormStatus('in_progress')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                      formStatus === 'in_progress'
                        ? 'bg-[#F39C12] text-white border-[#F39C12] shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-3 h-3 rounded-full bg-white border border-black/20" />
                    <span>In Progress</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormStatus('completed')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                      formStatus === 'completed'
                        ? 'bg-[#E74C3C] text-white border-[#E74C3C] shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-3 h-3 rounded-full bg-white border border-black/20" />
                    <span>Completed / Review</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormStatus('needs_attention')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                      formStatus === 'needs_attention'
                        ? 'bg-[#C0392B] text-white border-[#C0392B] shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-3 h-3 rounded-full bg-white border border-black/20" />
                    <span>Needs Urgent Attention</span>
                  </button>
                </div>
              </div>

              {/* Procedure / Diagnosis selection */}
              <div>
                <label className="text-xs font-bold text-[#767B87] uppercase tracking-wider block mb-1.5">
                  Procedure / Treatment
                </label>
                <select
                  value={formProcedure}
                  onChange={(e) => setFormProcedure(e.target.value)}
                  className="w-full text-xs font-medium p-3 rounded-xl bg-[#F5F6F8] border border-gray-200 text-[#2B2D33] focus:outline-none focus:border-[#1E88C7]"
                >
                  {PROCEDURE_OPTIONS.map((proc) => (
                    <option key={proc} value={proc}>
                      {proc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Surface Picker (O, M, D, B, L) */}
              <div>
                <label className="text-xs font-bold text-[#767B87] uppercase tracking-wider block mb-1.5">
                  Anatomical Surface (Optional)
                </label>
                <div className="flex gap-2">
                  {['O', 'MOD', 'MO', 'DO', 'B', 'L'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFormSurface(formSurface === s ? '' : s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        formSurface === s
                          ? 'bg-[#1E88C7] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clinical Notes */}
              <div>
                <label className="text-xs font-bold text-[#767B87] uppercase tracking-wider block mb-1.5">
                  Clinical Notes
                </label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Enter details on caries depth, margin prep, restorative material used..."
                  className="w-full text-xs p-3 rounded-xl bg-[#F5F6F8] border border-gray-200 text-[#2B2D33] focus:outline-none focus:border-[#1E88C7]"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleResetTooth}
                className="px-3 py-2.5 text-xs font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Trash2 size={14} />
                <span>Clear Condition</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveTooth}
                  className="px-5 py-2.5 text-xs font-bold bg-[#1E88C7] hover:bg-[#186ea3] text-white rounded-xl shadow-xs active:scale-95 transition-all"
                >
                  Save Tooth Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
