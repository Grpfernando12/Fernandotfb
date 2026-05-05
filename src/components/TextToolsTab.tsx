import React, { useState } from 'react';
import { Wand2, Loader2, ArrowRight, ScanText } from 'lucide-react';

export function TextToolsTab() {
  const [originalText, setOriginalText] = useState('');
  const [improvedText, setImprovedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock function to simulate AI text improvement API call
  const handleImproveText = () => {
    if (!originalText.trim()) return;
    
    setIsProcessing(true);
    setImprovedText('');

    // [TODO/FUTURE API CALL]: Replace this mock with an actual fetch() call to the AI endpoint.
    // fetch('/api/improve-text', { method: 'POST', body: JSON.stringify({ text: originalText }) }) ...
    setTimeout(() => {
      // Mock logic just to show functionality: fixes some spaces and adds a prefix
      const mockResult = `(Análise Concluída pelo Sistema)\n\n` + 
                         originalText
                           .split('\n')
                           .map(p => p.trim())
                           .filter(p => p.length > 0)
                           .map(p => {
                             // Basic capitalization and space fixing mock
                             let fixed = p.replace(/\s+/g, ' ');
                             if (fixed.length > 0) {
                               fixed = fixed.charAt(0).toUpperCase() + fixed.slice(1);
                               if (!fixed.match(/[.!?]$/)) fixed += '.';
                             }
                             return fixed;
                           })
                           .join('\n\n');
                           
      setImprovedText(mockResult);
      setIsProcessing(false);
    }, 1500); // 1.5s simulated loading
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-center gap-3">
        <ScanText className="text-cyan-400 hidden sm:block" size={28} />
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-cyan-50">Processamento Natural</h2>
          <p className="text-sm text-cyan-500/70 mt-1 font-mono uppercase tracking-wider">Módulo de IA para correção e otimização de sintaxe_</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        
        {/* Input Column */}
        <div className="flex flex-col glass-panel rounded-2xl overflow-hidden h-[500px] border border-cyan-900/30">
          <div className="p-4 bg-cyan-950/20 border-b border-cyan-900/30 flex items-center justify-between">
            <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">Input Raw</span>
            <span className="text-[10px] text-cyan-600/70 font-mono">{originalText.length} bytes</span>
          </div>
          <textarea
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            placeholder="Insira os dados não processados aqui..."
            className="flex-1 p-6 resize-none bg-gray-900/40 focus:outline-none focus:ring-inset focus:ring-1 focus:ring-cyan-500/50 text-cyan-50 placeholder-cyan-900/80 leading-relaxed font-mono text-sm custom-scrollbar"
          />
        </div>

        {/* Action Button (Desktop absolute, Mobile inline) */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 items-center justify-center">
          <button
            onClick={handleImproveText}
            disabled={isProcessing || !originalText.trim()}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-950 border border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:bg-cyan-900 hover:text-cyan-100 hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-cyan-950 transition-all group"
            title="Inicializar Processamento"
          >
            {isProcessing ? <Loader2 size={20} className="animate-spin text-cyan-400" /> : <ArrowRight size={20} className="group-hover:translate-x-0.5 transition-transform" />}
          </button>
        </div>

        {/* Mobile Action Button */}
        <div className="md:hidden flex justify-center py-2">
           <button
            onClick={handleImproveText}
            disabled={isProcessing || !originalText.trim()}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-950 border border-cyan-500 text-cyan-300 py-3 font-bold tracking-widest uppercase hover:bg-cyan-900 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]"
          >
            {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
            <span>{isProcessing ? 'Processando...' : 'Iniciar Decodificação'}</span>
          </button>
        </div>

        {/* Output Column */}
        <div className="flex flex-col glass-panel rounded-2xl overflow-hidden h-[500px] relative border border-cyan-900/30">
          <div className="p-4 bg-cyan-950/20 border-b border-cyan-900/30 flex items-center justify-between">
            <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest flex items-center gap-2">
              <Wand2 size={14} className="text-cyan-400" />
              Output Limpo
            </span>
          </div>
          <textarea
            value={improvedText}
            readOnly
            placeholder="O resultado será renderizado aqui..."
            className="flex-1 p-6 resize-none bg-gray-900/20 outline-none text-cyan-100 leading-relaxed font-mono text-sm custom-scrollbar"
          />
          {isProcessing && (
            <div className="absolute inset-0 top-[53px] bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-20">
              <div className="flex flex-col items-center gap-4 text-cyan-400 glass-panel p-6 rounded-xl border border-cyan-500/30">
                <Loader2 size={32} className="animate-spin" />
                <span className="text-xs font-mono font-bold tracking-widest uppercase">Processando Dados...</span>
                <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-cyan-400 animate-pulse w-full"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
