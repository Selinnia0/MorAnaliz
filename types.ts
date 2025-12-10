export enum ChartType {
  BAR = 'Sütun Grafik',
  LINE = 'Çizgi Grafik',
  AREA = 'Alan Grafik',
  SCATTER = 'Dağılım Grafik',
  PIE = 'Pasta Grafik',
  RADAR = 'Radar Grafik',
  RADIAL_BAR = 'Radyal Çubuk',
  COMPOSED = 'Birleşik Grafik',
  FUNNEL = 'Huni Grafik',
  DOUGHNUT = 'Halka Grafik',
}

export interface DataPoint {
  [key: string]: string | number;
}

export interface CsvConfig {
  separator: string;
  xAxis: string;
  yAxis: string;
  chartType: ChartType;
}

export interface AnalysisResult {
  title: string;
  summary: string;
  insights: string[];
}
