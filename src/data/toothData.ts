export interface ToothMeta {
  number: number;
  label: string;
  pediatricLabel?: string;
  pediatricNumber?: number;
  name: string;
  arch: 'upper' | 'lower';
  quadrant: 'UR' | 'UL' | 'LL' | 'LR';
  type: 'incisor' | 'canine' | 'premolar' | 'molar';
}

export const ADULT_TEETH: ToothMeta[] = [
  // Upper arch (1 to 16)
  { number: 1, label: '1', name: 'Maxillary Right 3rd Molar (Wisdom)', arch: 'upper', quadrant: 'UR', type: 'molar' },
  { number: 2, label: '2', name: 'Maxillary Right 2nd Molar', arch: 'upper', quadrant: 'UR', type: 'molar' },
  { number: 3, label: '3', name: 'Maxillary Right 1st Molar', arch: 'upper', quadrant: 'UR', type: 'molar' },
  { number: 4, label: '4', name: 'Maxillary Right 2nd Premolar', arch: 'upper', quadrant: 'UR', type: 'premolar' },
  { number: 5, label: '5', name: 'Maxillary Right 1st Premolar', arch: 'upper', quadrant: 'UR', type: 'premolar' },
  { number: 6, label: '6', name: 'Maxillary Right Canine (Cuspid)', arch: 'upper', quadrant: 'UR', type: 'canine' },
  { number: 7, label: '7', name: 'Maxillary Right Lateral Incisor', arch: 'upper', quadrant: 'UR', type: 'incisor' },
  { number: 8, label: '8', name: 'Maxillary Right Central Incisor', arch: 'upper', quadrant: 'UR', type: 'incisor' },
  { number: 9, label: '9', name: 'Maxillary Left Central Incisor', arch: 'upper', quadrant: 'UL', type: 'incisor' },
  { number: 10, label: '10', name: 'Maxillary Left Lateral Incisor', arch: 'upper', quadrant: 'UL', type: 'incisor' },
  { number: 11, label: '11', name: 'Maxillary Left Canine (Cuspid)', arch: 'upper', quadrant: 'UL', type: 'canine' },
  { number: 12, label: '12', name: 'Maxillary Left 1st Premolar', arch: 'upper', quadrant: 'UL', type: 'premolar' },
  { number: 13, label: '13', name: 'Maxillary Left 2nd Premolar', arch: 'upper', quadrant: 'UL', type: 'premolar' },
  { number: 14, label: '14', name: 'Maxillary Left 1st Molar', arch: 'upper', quadrant: 'UL', type: 'molar' },
  { number: 15, label: '15', name: 'Maxillary Left 2nd Molar', arch: 'upper', quadrant: 'UL', type: 'molar' },
  { number: 16, label: '16', name: 'Maxillary Left 3rd Molar (Wisdom)', arch: 'upper', quadrant: 'UL', type: 'molar' },

  // Lower arch (32 down to 17)
  { number: 32, label: '32', name: 'Mandibular Right 3rd Molar (Wisdom)', arch: 'lower', quadrant: 'LR', type: 'molar' },
  { number: 31, label: '31', name: 'Mandibular Right 2nd Molar', arch: 'lower', quadrant: 'LR', type: 'molar' },
  { number: 30, label: '30', name: 'Mandibular Right 1st Molar', arch: 'lower', quadrant: 'LR', type: 'molar' },
  { number: 29, label: '29', name: 'Mandibular Right 2nd Premolar', arch: 'lower', quadrant: 'LR', type: 'premolar' },
  { number: 28, label: '28', name: 'Mandibular Right 1st Premolar', arch: 'lower', quadrant: 'LR', type: 'premolar' },
  { number: 27, label: '27', name: 'Mandibular Right Canine', arch: 'lower', quadrant: 'LR', type: 'canine' },
  { number: 26, label: '26', name: 'Mandibular Right Lateral Incisor', arch: 'lower', quadrant: 'LR', type: 'incisor' },
  { number: 25, label: '25', name: 'Mandibular Right Central Incisor', arch: 'lower', quadrant: 'LR', type: 'incisor' },
  { number: 24, label: '24', name: 'Mandibular Left Central Incisor', arch: 'lower', quadrant: 'LL', type: 'incisor' },
  { number: 23, label: '23', name: 'Mandibular Left Lateral Incisor', arch: 'lower', quadrant: 'LL', type: 'incisor' },
  { number: 22, label: '22', name: 'Mandibular Left Canine', arch: 'lower', quadrant: 'LL', type: 'canine' },
  { number: 21, label: '21', name: 'Mandibular Left 1st Premolar', arch: 'lower', quadrant: 'LL', type: 'premolar' },
  { number: 20, label: '20', name: 'Mandibular Left 2nd Premolar', arch: 'lower', quadrant: 'LL', type: 'premolar' },
  { number: 19, label: '19', name: 'Mandibular Left 1st Molar', arch: 'lower', quadrant: 'LL', type: 'molar' },
  { number: 18, label: '18', name: 'Mandibular Left 2nd Molar', arch: 'lower', quadrant: 'LL', type: 'molar' },
  { number: 17, label: '17', name: 'Mandibular Left 3rd Molar (Wisdom)', arch: 'lower', quadrant: 'LL', type: 'molar' },
];

export const PEDIATRIC_TEETH: ToothMeta[] = [
  // Upper Primary Arch (A through J)
  { number: 1, label: 'A', pediatricLabel: 'A', name: 'Primary Maxillary Right 2nd Molar', arch: 'upper', quadrant: 'UR', type: 'molar' },
  { number: 2, label: 'B', pediatricLabel: 'B', name: 'Primary Maxillary Right 1st Molar', arch: 'upper', quadrant: 'UR', type: 'molar' },
  { number: 3, label: 'C', pediatricLabel: 'C', name: 'Primary Maxillary Right Canine', arch: 'upper', quadrant: 'UR', type: 'canine' },
  { number: 4, label: 'D', pediatricLabel: 'D', name: 'Primary Maxillary Right Lateral Incisor', arch: 'upper', quadrant: 'UR', type: 'incisor' },
  { number: 5, label: 'E', pediatricLabel: 'E', name: 'Primary Maxillary Right Central Incisor', arch: 'upper', quadrant: 'UR', type: 'incisor' },
  { number: 6, label: 'F', pediatricLabel: 'F', name: 'Primary Maxillary Left Central Incisor', arch: 'upper', quadrant: 'UL', type: 'incisor' },
  { number: 7, label: 'G', pediatricLabel: 'G', name: 'Primary Maxillary Left Lateral Incisor', arch: 'upper', quadrant: 'UL', type: 'incisor' },
  { number: 8, label: 'H', pediatricLabel: 'H', name: 'Primary Maxillary Left Canine', arch: 'upper', quadrant: 'UL', type: 'canine' },
  { number: 9, label: 'I', pediatricLabel: 'I', name: 'Primary Maxillary Left 1st Molar', arch: 'upper', quadrant: 'UL', type: 'molar' },
  { number: 10, label: 'J', pediatricLabel: 'J', name: 'Primary Maxillary Left 2nd Molar', arch: 'upper', quadrant: 'UL', type: 'molar' },

  // Lower Primary Arch (T down to K)
  { number: 20, label: 'T', pediatricLabel: 'T', name: 'Primary Mandibular Right 2nd Molar', arch: 'lower', quadrant: 'LR', type: 'molar' },
  { number: 19, label: 'S', pediatricLabel: 'S', name: 'Primary Mandibular Right 1st Molar', arch: 'lower', quadrant: 'LR', type: 'molar' },
  { number: 18, label: 'R', pediatricLabel: 'R', name: 'Primary Mandibular Right Canine', arch: 'lower', quadrant: 'LR', type: 'canine' },
  { number: 17, label: 'Q', pediatricLabel: 'Q', name: 'Primary Mandibular Right Lateral Incisor', arch: 'lower', quadrant: 'LR', type: 'incisor' },
  { number: 16, label: 'P', pediatricLabel: 'P', name: 'Primary Mandibular Right Central Incisor', arch: 'lower', quadrant: 'LR', type: 'incisor' },
  { number: 15, label: 'O', pediatricLabel: 'O', name: 'Primary Mandibular Left Central Incisor', arch: 'lower', quadrant: 'LL', type: 'incisor' },
  { number: 14, label: 'N', pediatricLabel: 'N', name: 'Primary Mandibular Left Lateral Incisor', arch: 'lower', quadrant: 'LL', type: 'incisor' },
  { number: 13, label: 'M', pediatricLabel: 'M', name: 'Primary Mandibular Left Canine', arch: 'lower', quadrant: 'LL', type: 'canine' },
  { number: 12, label: 'L', pediatricLabel: 'L', name: 'Primary Mandibular Left 1st Molar', arch: 'lower', quadrant: 'LL', type: 'molar' },
  { number: 11, label: 'K', pediatricLabel: 'K', name: 'Primary Mandibular Left 2nd Molar', arch: 'lower', quadrant: 'LL', type: 'molar' },
];

export const PROCEDURE_OPTIONS = [
  'Routine Prophylaxis / Cleaning',
  'Class I Composite Restoration',
  'Class II Composite Restoration (MO/DO/MOD)',
  'Direct Composite Veneer',
  'Endodontic Root Canal Therapy (Stage 1/2)',
  'Endodontic Obturation / Final Fill',
  'Ceramic Crown Preparation',
  'Final Zirconia Crown Cementation',
  'Simple Dental Extraction',
  'Surgical Impacted Molar Extraction',
  'Pit and Fissure Sealant',
  'Fluoride Treatment',
  'Desensitizing Varnish Application',
  'Periodontal Deep Scaling & Root Planing',
  'Gingival Sulcus Irrigation'
];
