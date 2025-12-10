import React, { useState } from 'react';
import { LayoutDashboard, Image as ImageIcon, Github } from 'lucide-react';
import CsvAnalysis from './components/CsvAnalysis';
import ImageAnalysis from './components/ImageAnalysis';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'csv' | 'image'>('csv');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
              M
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-700">
              Mor Analiz
            </h1>
          </div>
          
          <nav className="flex gap-1 bg-purple-50 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('csv')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'csv' 
                  ? 'bg-white text-purple-700 shadow-sm' 
                  : 'text-purple-400 hover:text-purple-600 hover:bg-purple-100/50'
              }`}
            >
              <LayoutDashboard size={18} />
              CSV Analizi
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'image' 
                  ? 'bg-white text-purple-700 shadow-sm' 
                  : 'text-purple-400 hover:text-purple-600 hover:bg-purple-100/50'
              }`}
            >
              <ImageIcon size={18} />
              Görsel Analizi
            </button>
          </nav>

          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noreferrer"
            className="hidden sm:flex items-center gap-2 text-purple-400 hover:text-purple-700 transition-colors"
          >
            <Github size={20} />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {activeTab === 'csv' ? 'Veri Görselleştirme Stüdyosu' : 'AI Grafik Yorumlayıcı'}
          </h2>
          <p className="text-gray-500 max-w-2xl">
            {activeTab === 'csv' 
              ? 'CSV dosyalarınızı yükleyin, otomatik algılanan grafik türleri ile verilerinizi anında görselleştirin. Özelleştirilebilir eksenler ve 10 farklı grafik seçeneği.' 
              : 'Grafik görsellerini yükleyin, Gemini AI teknolojisi ile otomatik analiz, veri çıkarma ve içgörü elde edin.'}
          </p>
        </div>

        <div className="animate-fade-in-up">
          {activeTab === 'csv' ? <CsvAnalysis /> : <ImageAnalysis />}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="mt-12 border-t border-purple-100 py-8 bg-white">
         <div className="max-w-7xl mx-auto px-4 text-center text-purple-300 text-sm">
           &copy; {new Date().getFullYear()} Mor Analiz. Açık Kaynaklı Veri Aracı.
         </div>
      </footer>
    </div>
  );
};

export default App;
