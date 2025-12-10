import { DataPoint } from '../types';

export const parseCSV = (content: string, separator: string = ','): DataPoint[] => {
  const lines = content.trim().split(/\r\n|\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(separator).map(h => h.trim());
  const result: DataPoint[] = [];

  for (let i = 1; i < lines.length; i++) {
    const obj: DataPoint = {};
    const currentline = lines[i].split(separator);

    // Skip empty lines or malformed lines
    if (currentline.length !== headers.length) continue;

    for (let j = 0; j < headers.length; j++) {
      const value = currentline[j].trim();
      // Try to parse as number if possible
      const numValue = parseFloat(value);
      obj[headers[j]] = !isNaN(numValue) && isFinite(numValue) ? numValue : value;
    }
    result.push(obj);
  }

  return result;
};

export const detectColumns = (data: DataPoint[]): { keys: string[], numerics: string[], categoricals: string[] } => {
  if (data.length === 0) return { keys: [], numerics: [], categoricals: [] };

  const keys = Object.keys(data[0]);
  const numerics: string[] = [];
  const categoricals: string[] = [];

  keys.forEach(key => {
    // Check first few rows to determine type
    const isNum = data.slice(0, 5).every(row => typeof row[key] === 'number');
    if (isNum) {
      numerics.push(key);
    } else {
      categoricals.push(key);
    }
  });

  return { keys, numerics, categoricals };
};
