import { ChartType } from './types';

// Örnek CSV verisi (Türkçe)
export const SAMPLE_CSV_DATA = `Ay,Satış,Gider,Kâr,Müşteri_Memnuniyeti
Ocak,12000,8000,4000,85
Şubat,15000,9000,6000,88
Mart,11000,7500,3500,82
Nisan,18000,10000,8000,90
Mayıs,22000,11000,11000,92
Haziran,25000,12000,13000,95
Temmuz,24000,13000,11000,94
Ağustos,20000,11500,8500,89
Eylül,23000,12000,11000,91
Ekim,26000,13000,13000,93
Kasım,28000,14000,14000,96
Aralık,35000,16000,19000,98`;

export const CHART_TYPES = Object.values(ChartType);

export const SEPARATORS = [
  { label: 'Virgül (,)', value: ',' },
  { label: 'Noktalı Virgül (;)', value: ';' },
  { label: 'Tab (\\t)', value: '\t' },
  { label: 'Dikey Çizgi (|)', value: '|' },
];

export const COLORS = ['#8b5cf6', '#c084fc', '#a78bfa', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95', '#2e1065'];
