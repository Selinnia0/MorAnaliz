import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, ScatterChart, Scatter, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  RadialBarChart, RadialBar, FunnelChart, Funnel, ComposedChart
} from 'recharts';
import { Upload, Trash2, FileText, Settings, BarChart2 } from 'lucide-react';
import { SAMPLE_CSV_DATA, SEPARATORS, CHART_TYPES, COLORS } from '../constants';
import { parseCSV, detectColumns } from '../utils/csvHelper';
import { ChartType, DataPoint, CsvConfig } from '../types';

const CsvAnalysis: React.FC = () => {
  const [rawData, setRawData] = useState<string>(SAMPLE_CSV_DATA);
  const [fileName, setFileName] = useState<string>('ornek_veri.csv');
  const [data, setData] = useState<DataPoint[]>([]);
  const [config, setConfig] = useState<CsvConfig>({
    separator: ',',
    xAxis: '',
    yAxis: '',
    chartType: ChartType.BAR
  });
  
  const [columns, setColumns] = useState<{keys: string[], numerics: string[], categoricals: string[]}>({
    keys: [], numerics: [], categoricals: []
  });

  // Parse Data when raw content or separator changes
  useEffect(() => {
    const parsedData = parseCSV(rawData, config.separator);
    setData(parsedData);
    
    const cols = detectColumns(parsedData);
    setColumns(cols);

    // Intelligent Default Selection
    if (parsedData.length > 0) {
      const defaultX = cols.categoricals.length > 0 ? cols.categoricals[0] : cols.keys[0];
      // Try to find a numeric column that isn't the X axis
      const defaultY = cols.numerics.find(n => n !== defaultX) || cols.numerics[0] || '';
      
      // Auto-detect chart type based on data shape
      let suggestedType = ChartType.BAR;
      if (parsedData.length > 15 && cols.categoricals.some(c => c.toLowerCase().includes('date') || c.toLowerCase().includes('tarih') || c.toLowerCase().includes('yıl') || c.toLowerCase().includes('ay'))) {
        suggestedType = ChartType.LINE;
      } else if (parsedData.length < 6) {
        suggestedType = ChartType.PIE;
      }

      setConfig(prev => ({
        ...prev,
        xAxis: prev.xAxis && cols.keys.includes(prev.xAxis) ? prev.xAxis : defaultX,
        yAxis: prev.yAxis && cols.keys.includes(prev.yAxis) ? prev.yAxis : defaultY,
        chartType: prev.chartType === ChartType.BAR ? suggestedType : prev.chartType // Only override if it was default
      }));
    }
  }, [rawData, config.separator]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        setRawData(text);
      };
      reader.readAsText(file);
    }
  };

  const handleRemoveFile = () => {
    setRawData(SAMPLE_CSV_DATA);
    setFileName('ornek_veri.csv');
    setConfig(prev => ({ ...prev, separator: ',' }));
  };

  const renderChart = () => {
    if (!data || data.length === 0 || !config.xAxis || !config.yAxis) {
      return <div className="flex items-center justify-center h-64 text-gray-400">Görüntülenecek veri yok</div>;
    }

    const commonProps = {
      data: data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    switch (config.chartType) {
      case ChartType.LINE:
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
              <XAxis dataKey={config.xAxis} stroke="#6d28d9" />
              <YAxis stroke="#6d28d9" />
              <Tooltip contentStyle={{ backgroundColor: '#f5f3ff', borderColor: '#8b5cf6' }} />
              <Legend />
              <Line type="monotone" dataKey={config.yAxis} stroke="#7c3aed" strokeWidth={3} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case ChartType.AREA:
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
              <XAxis dataKey={config.xAxis} stroke="#6d28d9" />
              <YAxis stroke="#6d28d9" />
              <Tooltip contentStyle={{ backgroundColor: '#f5f3ff', borderColor: '#8b5cf6' }} />
              <Legend />
              <Area type="monotone" dataKey={config.yAxis} stroke="#7c3aed" fill="#c4b5fd" />
            </AreaChart>
          </ResponsiveContainer>
        );
      case ChartType.SCATTER:
         return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
              <XAxis type="category" dataKey={config.xAxis} name={config.xAxis} stroke="#6d28d9" />
              <YAxis type="number" dataKey={config.yAxis} name={config.yAxis} stroke="#6d28d9" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#f5f3ff', borderColor: '#8b5cf6' }} />
              <Scatter name={config.yAxis} data={data} fill="#7c3aed" />
            </ScatterChart>
          </ResponsiveContainer>
        );
      case ChartType.PIE:
      case ChartType.DOUGHNUT:
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={config.chartType === ChartType.DOUGHNUT ? 120 : 150}
                innerRadius={config.chartType === ChartType.DOUGHNUT ? 80 : 0}
                fill="#8884d8"
                dataKey={config.yAxis}
                nameKey={config.xAxis}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#f5f3ff', borderColor: '#8b5cf6' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      case ChartType.RADAR:
        return (
           <ResponsiveContainer width="100%" height={400}>
            <RadarChart cx="50%" cy="50%" outerRadius={150} data={data}>
              <PolarGrid stroke="#e9d5ff" />
              <PolarAngleAxis dataKey={config.xAxis} stroke="#6d28d9" />
              <PolarRadiusAxis stroke="#6d28d9" />
              <Radar name={config.yAxis} dataKey={config.yAxis} stroke="#7c3aed" fill="#8b5cf6" fillOpacity={0.6} />
              <Tooltip contentStyle={{ backgroundColor: '#f5f3ff', borderColor: '#8b5cf6' }} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        );
      case ChartType.RADIAL_BAR:
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={10} data={data}>
              <RadialBar
                label={{ position: 'insideStart', fill: '#fff' }}
                background
                dataKey={config.yAxis}
                fill="#7c3aed" 
              />
              <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ right: 0 }} />
              <Tooltip contentStyle={{ backgroundColor: '#f5f3ff', borderColor: '#8b5cf6' }} />
            </RadialBarChart>
          </ResponsiveContainer>
        );
      case ChartType.FUNNEL:
        return (
          <ResponsiveContainer width="100%" height={400}>
            <FunnelChart>
              <Tooltip contentStyle={{ backgroundColor: '#f5f3ff', borderColor: '#8b5cf6' }} />
              <Funnel
                dataKey={config.yAxis}
                data={data}
                isAnimationActive
              >
                {data.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        );
      case ChartType.COMPOSED:
        return (
           <ResponsiveContainer width="100%" height={400}>
            <ComposedChart {...commonProps}>
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey={config.xAxis} scale="band" />
              <YAxis />
              <Tooltip contentStyle={{ backgroundColor: '#f5f3ff', borderColor: '#8b5cf6' }} />
              <Legend />
              <Area type="monotone" dataKey={config.yAxis} fill="#ddd6fe" stroke="#8884d8" />
              <Bar dataKey={config.yAxis} barSize={20} fill="#7c3aed" />
              <Line type="monotone" dataKey={config.yAxis} stroke="#4c1d95" />
            </ComposedChart>
          </ResponsiveContainer>
        );
      case ChartType.BAR:
      default:
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
              <XAxis dataKey={config.xAxis} stroke="#6d28d9" />
              <YAxis stroke="#6d28d9" />
              <Tooltip contentStyle={{ backgroundColor: '#f5f3ff', borderColor: '#8b5cf6' }} />
              <Legend />
              <Bar dataKey={config.yAxis} fill="#7c3aed" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* File Upload Area */}
          <div className="col-span-1 lg:col-span-2 space-y-2">
            <label className="text-sm font-semibold text-purple-900 flex items-center gap-2">
              <Upload size={16} /> Veri Kaynağı (.csv)
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-1 cursor-pointer group">
                <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                <div className="flex items-center justify-between px-4 py-3 bg-purple-50 border-2 border-dashed border-purple-200 rounded-xl group-hover:bg-purple-100 transition-colors">
                  <span className="text-purple-700 font-medium truncate max-w-[200px]">{fileName}</span>
                  <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">Gözat</span>
                </div>
              </label>
              {fileName !== 'ornek_veri.csv' && (
                <button 
                  onClick={handleRemoveFile}
                  className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 border border-red-100 transition-colors"
                  title="Dosyayı Kaldır"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Separator Selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-purple-900 flex items-center gap-2">
              <Settings size={16} /> Ayırıcı
            </label>
            <select 
              value={config.separator}
              onChange={(e) => setConfig({...config, separator: e.target.value})}
              className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-purple-900"
            >
              {SEPARATORS.map(sep => (
                <option key={sep.value} value={sep.value}>{sep.label}</option>
              ))}
            </select>
          </div>

          {/* Chart Type Selection */}
          <div className="space-y-2">
             <label className="text-sm font-semibold text-purple-900 flex items-center gap-2">
              <BarChart2 size={16} /> Grafik Türü
            </label>
            <select 
              value={config.chartType}
              onChange={(e) => setConfig({...config, chartType: e.target.value as ChartType})}
              className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-purple-900"
            >
              {CHART_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Axis Configuration */}
        <div className="mt-6 pt-6 border-t border-purple-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-purple-600 font-medium">X Ekseni (Kategori)</label>
            <select 
              value={config.xAxis}
              onChange={(e) => setConfig({...config, xAxis: e.target.value})}
              className="w-full px-4 py-2 bg-purple-50 border border-purple-100 rounded-lg text-purple-800"
            >
              {columns.keys.map(key => <option key={key} value={key}>{key}</option>)}
            </select>
          </div>
          <div className="space-y-2">
             <label className="text-sm text-purple-600 font-medium">Y Ekseni (Değer)</label>
             <select 
              value={config.yAxis}
              onChange={(e) => setConfig({...config, yAxis: e.target.value})}
              className="w-full px-4 py-2 bg-purple-50 border border-purple-100 rounded-lg text-purple-800"
            >
              {columns.keys.map(key => <option key={key} value={key}>{key}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Chart Display */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-purple-100 min-h-[500px] flex flex-col">
        <h3 className="text-xl font-bold text-purple-900 mb-6 flex items-center gap-2">
          <FileText className="text-purple-500" />
          Veri Görselleştirme
        </h3>
        <div className="flex-1 w-full bg-purple-50/30 rounded-xl p-4 border border-purple-50">
          {renderChart()}
        </div>
      </div>

      {/* Data Table Preview */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100 overflow-hidden">
        <h3 className="text-lg font-bold text-purple-900 mb-4">Veri Önizleme (İlk 5 Satır)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-purple-800">
            <thead className="bg-purple-100 text-purple-900 uppercase font-semibold">
              <tr>
                {columns.keys.map(key => <th key={key} className="px-4 py-3">{key}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100">
              {data.slice(0, 5).map((row, i) => (
                <tr key={i} className="hover:bg-purple-50 transition-colors">
                  {columns.keys.map((key, j) => (
                    <td key={j} className="px-4 py-3">{row[key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CsvAnalysis;
