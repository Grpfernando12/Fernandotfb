import React, { useState } from 'react';
import { TrackingTab } from './components/TrackingTab';
import { LinksNotesTab } from './components/LinksNotesTab';
import { TextToolsTab } from './components/TextToolsTab';
import { LayoutDashboard, Link2, Type, Menu, X, Cpu, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from './components/AuthProvider';

export default function App() {
  const [activeTab, setActiveTab] = useState<'tracking' | 'links' | 'text'>('tracking');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logOut } = useAuth();

  const tabs = [
    { id: 'tracking', label: 'Acompanhamento', icon: LayoutDashboard },
    { id: 'links', label: 'Rotas e Blocos', icon: Link2 },
    { id: 'text', label: 'Processamento', icon: Type },
  ] as const;

  const navigateTo = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#050510] text-gray-200 font-sans flex flex-col md:flex-row bg-grid-pattern relative overflow-x-hidden">
      
      {/* Background glow effects */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-900/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Mobile Top Bar */}
      <div className="md:hidden glass-panel px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-cyan-500/10 border border-cyan-500/50 rounded-lg flex items-center justify-center text-cyan-400 font-bold text-lg neon-border-cyan">
             <Cpu size={16} />
           </div>
           <span className="font-semibold tracking-tight text-lg text-cyan-50 neon-text-cyan">FernandoTFB</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={logOut} className="p-2 text-red-400 hover:bg-red-950/50 rounded-lg transition-colors">
            <LogOut size={20} />
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -mr-2 text-cyan-400 hover:bg-cyan-950/50 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        ${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex
        flex-col fixed md:sticky top-[61px] md:top-0 left-0 w-full md:w-72 h-[calc(100vh-61px)] md:h-screen 
        glass-panel z-40 transition-all duration-300 border-r border-cyan-900/30
      `}>
        <div className="hidden md:flex items-center gap-3 p-6 border-b border-cyan-900/30">
           <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/50 rounded-xl flex items-center justify-center text-cyan-400 font-bold shadow-sm neon-border-cyan relative overflow-hidden group">
             <div className="absolute inset-0 bg-cyan-400/20 animate-pulse"></div>
             <Cpu size={20} className="relative z-10" />
           </div>
           <div className="flex flex-col">
             <span className="font-bold tracking-widest text-xl text-cyan-50 neon-text-cyan uppercase">Fernando</span>
             <span className="text-[10px] text-cyan-500 tracking-[0.3em] uppercase">TFB Systems</span>
           </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => navigateTo(tab.id as typeof activeTab)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium rounded-xl transition-all relative overflow-hidden group ${
                  isActive 
                    ? 'bg-cyan-900/40 text-cyan-300 border border-cyan-500/30' 
                    : 'text-gray-400 hover:bg-cyan-900/20 hover:text-cyan-100 border border-transparent'
                }`}
              >
                {isActive && (
                  <motion.div layoutId="activeTabIndicator" className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                )}
                <Icon size={18} className={`${isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-cyan-300'} transition-colors relative z-10`} />
                <span className="tracking-wide relative z-10">{tab.label}</span>
              </button>
            )
          })}
        </nav>
        
        {/* Footer Sidebar */}
        <div className="p-6 border-t border-cyan-900/30 hidden md:block">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
              <p className="text-[11px] text-cyan-600/80 font-mono tracking-widest uppercase">System Online</p>
            </div>
            <button 
              onClick={logOut}
              className="text-cyan-600/80 hover:text-red-400 transition-colors"
              title="Sair do sistema"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 mx-auto w-full max-w-7xl relative z-10 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {activeTab === 'tracking' && <TrackingTab />}
            {activeTab === 'links' && <LinksNotesTab />}
            {activeTab === 'text' && <TextToolsTab />}
          </motion.div>
        </AnimatePresence>
      </main>
      
    </div>
  );
}
