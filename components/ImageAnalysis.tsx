import React, { useState } from 'react';
import { Upload, ImageIcon, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { analyzeChartImage } from '../services/geminiService';
import { AnalysisResult } from '../types';

const ImageAnalysis: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const result = evt.target?.result as string;
        // Extract base64 data only
        const base64Data = result.split(',')[1];
        setImage(base64Data);
        setMimeType(file.type);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);
    try {
      const analysisData = await analyzeChartImage(image, mimeType);
      setResult(analysisData);
    } catch (err) {
      setError("Görsel analiz edilirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Upload Section */}
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-purple-100 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-purple-100 rounded-full text-purple-600">
              <ImageIcon size={48} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-purple-900 mb-2">Grafik Görseli Yükle</h2>
          <p className="text-purple-600 mb-8">
            Analiz etmek istediğiniz grafiğin ekran görüntüsünü veya fotoğrafını yükleyin. 
            Yapay zeka grafiği tanıyacak ve yorumlayacaktır.
          </p>
          
          <label className="inline-block">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <div className="flex items-center gap-3 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl cursor-pointer transition-all shadow-md hover:shadow-xl font-semibold">
              <Upload size={20} />
              Görsel Seç
            </div>
          </label>
        </div>

        {image && (
          <div className="bg-white p-4 rounded-2xl shadow-md border border-purple-100">
            <img 
              src={`data:${mimeType};base64,${image}`} 
              alt="Preview" 
              className="w-full h-64 object-contain rounded-lg bg-gray-50" 
            />
            <button 
              onClick={handleAnalyze} 
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold transition-all disabled:opacity-70 shadow-lg"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
              {loading ? 'Analiz Ediliyor...' : 'Yapay Zeka ile Analiz Et'}
            </button>
          </div>
        )}
      </div>

      {/* Result Section */}
      <div className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-3">
            <AlertCircle /> {error}
          </div>
        )}

        {!result && !loading && !error && (
          <div className="h-full flex flex-col items-center justify-center text-purple-300 p-12 border-2 border-dashed border-purple-200 rounded-2xl">
            <Sparkles size={64} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">Sonuçlar burada görünecek</p>
          </div>
        )}

        {result && (
          <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden animate-fade-in">
            <div className="bg-purple-900 text-white p-6">
              <span className="inline-block px-3 py-1 bg-purple-700 rounded-full text-xs font-semibold tracking-wide uppercase mb-2">
                {result.chartType}
              </span>
              <h3 className="text-2xl font-bold">{result.title}</h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-sm font-bold text-purple-900 uppercase tracking-wider mb-2">Özet</h4>
                <p className="text-purple-800 leading-relaxed bg-purple-50 p-4 rounded-xl border border-purple-100">
                  {result.summary}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-purple-900 uppercase tracking-wider mb-3">Önemli Bulgular</h4>
                <ul className="space-y-3">
                  {result.insights?.map((insight, idx) => (
                    <li key={idx} className="flex gap-3 items-start">
                      <div className="mt-1 min-w-[24px] h-6 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 text-xs font-bold">
                        {idx + 1}
                      </div>
                      <span className="text-gray-700">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageAnalysis;
