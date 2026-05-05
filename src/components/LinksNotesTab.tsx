import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Plus, Trash2, ExternalLink, StickyNote, Anchor } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuickLink {
  id: string;
  name: string;
  url: string;
  clicks: number;
  createdAt: number;
}

interface PostIt {
  id: string;
  text: string;
  color: string;
  createdAt: number;
}

const COLOR_OPTIONS = [
  { full: 'bg-cyan-900/40 border-cyan-500/50 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.15)] glow-cyan', btn: 'bg-cyan-950 border-cyan-500' },
  { full: 'bg-pink-900/40 border-pink-500/50 text-pink-100 shadow-[0_0_15px_rgba(236,72,153,0.15)] glow-pink', btn: 'bg-pink-950 border-pink-500' },
  { full: 'bg-green-900/40 border-green-500/50 text-green-100 shadow-[0_0_15px_rgba(34,197,94,0.15)] glow-green', btn: 'bg-green-950 border-green-500' },
  { full: 'bg-purple-900/40 border-purple-500/50 text-purple-100 shadow-[0_0_15px_rgba(168,85,247,0.15)] glow-purple', btn: 'bg-purple-950 border-purple-500' },
  { full: 'bg-yellow-900/40 border-yellow-500/50 text-yellow-100 shadow-[0_0_15px_rgba(234,179,8,0.15)] glow-yellow', btn: 'bg-yellow-950 border-yellow-500' }
];

export function LinksNotesTab() {
  const [links, setLinks] = useLocalStorage<QuickLink[]>('dashboard_links', []);
  const [postIts, setPostIts] = useLocalStorage<PostIt[]>('dashboard_postits', []);

  // Form states for Links
  const [linkName, setLinkName] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  // Form states for Post-it
  const [noteText, setNoteText] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0].full);

  // Handle Link Activity
  const [clickingId, setClickingId] = useState<string | null>(null);

  // Handle Link Add
  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkName.trim() || !linkUrl.trim()) return;

    let processedUrl = linkUrl.trim();
    if (!/^https?:\/\//i.test(processedUrl)) {
      processedUrl = `https://${processedUrl}`;
    }

    const newLink: QuickLink = {
      id: crypto.randomUUID(),
      name: linkName.trim(),
      url: processedUrl,
      clicks: 0,
      createdAt: Date.now()
    };

    setLinks([...links, newLink]);
    setLinkName('');
    setLinkUrl('');
  };

  const handleLinkClick = (id: string, currentClicks: number) => {
    setLinks(prevLinks => prevLinks.map(l => l.id === id ? { ...l, clicks: currentClicks + 1 } : l));
    
    setClickingId(id);
    
    setTimeout(() => {
      setClickingId(null);
    }, 150);
  };

  const removeLink = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
  };

  // Handle Post-it Add
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    const newNote: PostIt = {
      id: crypto.randomUUID(),
      text: noteText.trim(),
      color: selectedColor,
      createdAt: Date.now()
    };

    setPostIts([newNote, ...postIts]);

    setNoteText('');
  };

  const removeNote = (id: string) => {
    setPostIts(postIts.filter(n => n.id !== id));
  };

  // Ordena os links sempre do maior para o menor (decrescente)
  const sortedLinks = [...links].sort((a, b) => b.clicks - a.clicks);

  return (
    <div className="space-y-12">
      {/* SEÇÃO DE LINKS */}
      <section>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 flex items-center gap-2"
        >
          <Anchor className="text-cyan-400" size={24} />
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-cyan-50">Rotas Rápidas</h2>
            <p className="text-sm text-cyan-500/70 mt-1 font-mono uppercase tracking-wider">Acessos frequentes priorizados pelo sistema_</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Adicionar Link */}
          <div className="lg:col-span-1 glass-panel p-5 rounded-2xl h-max">
            <h3 className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-4">Novo Endpoint</h3>
            <form onSubmit={handleAddLink} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Nome (ex: Sistema Web)"
                  value={linkName}
                  onChange={(e) => setLinkName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-cyan-900/50 rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 outline-none transition-all text-cyan-50 placeholder-cyan-900/80 font-mono"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="URL (ex: admin.com)"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-cyan-900/50 rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 outline-none transition-all text-cyan-50 placeholder-cyan-900/80 font-mono"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-cyan-950 border border-cyan-500 text-cyan-300 font-bold tracking-widest uppercase py-2 rounded-lg transition-all flex items-center justify-center gap-2 hover:bg-cyan-900 hover:text-cyan-100 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              >
                <Plus size={18} /> Estabelecer
              </button>
            </form>
          </div>

          {/* Lista de Links */}
          <div className="lg:col-span-2">
            <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-full border border-cyan-900/30">
              <div className="p-4 bg-cyan-950/20 border-b border-cyan-900/30 flex justify-between items-center text-[10px] font-bold text-cyan-500 uppercase tracking-widest">
                <span>Destino</span>
                <span>Hits</span>
              </div>
              {sortedLinks.length === 0 ? (
                <div className="p-8 text-center text-cyan-700 font-mono tracking-widest text-sm">NO_LINKS_FOUND</div>
              ) : (
                <ul className="divide-y divide-cyan-900/30 flex-1 overflow-y-auto custom-scrollbar">
                  <AnimatePresence mode="popLayout">
                  {sortedLinks.map(link => (
                    <motion.li 
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      key={link.id} 
                      className="flex items-center justify-between p-4 hover:bg-cyan-950/20 transition-all group"
                    >
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleLinkClick(link.id, link.clicks)}
                        className={`flex-1 flex items-center gap-3 text-left focus:outline-none transition-all duration-150 ${
                          clickingId === link.id ? 'scale-[0.97] opacity-80' : 'hover:scale-[1.01]'
                        }`}
                      >
                        <div className="bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 p-2 rounded-lg group-hover:bg-cyan-900/50 group-hover:border-cyan-400 transition-all group-hover:shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                          <ExternalLink size={18} />
                        </div>
                        <div>
                          <p className="font-bold tracking-wide text-cyan-100 group-hover:text-cyan-300 transition-colors">{link.name}</p>
                          <p className="text-[11px] font-mono text-cyan-600/70 truncate max-w-[200px] sm:max-w-sm">{link.url}</p>
                        </div>
                      </a>
                      
                      <div className="flex items-center gap-4">
                        <span className="inline-flex items-center justify-center min-w-[32px] h-8 px-2 rounded-sm bg-cyan-950/40 border border-cyan-900 border-l-cyan-500 text-xs font-mono font-bold text-cyan-400" title="Número de cliques">
                          {link.clicks}
                        </span>
                        <button
                          onClick={() => removeLink(link.id)}
                          className="p-1.5 text-gray-500 hover:text-red-400 border border-transparent hover:border-red-900/50 hover:bg-red-950/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10 relative"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </motion.li>
                  ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO POST-ITS */}
      <section>
         <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex items-center gap-2"
        >
          <StickyNote className="text-purple-400" size={24} />
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-purple-50">Blocos de Memória</h2>
            <p className="text-sm text-purple-500/70 mt-1 font-mono uppercase tracking-wider">Anotações holográficas locais_</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          
          {/* Adicionar Post-it */}
          <div className="glass-panel p-5 rounded-2xl flex flex-col h-[280px] border border-purple-900/30">
            <h3 className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-3">Registrar Bloco</h3>
            <form onSubmit={handleAddNote} className="flex-1 flex flex-col gap-3">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Insira dados temporários aqui..."
                className="w-full flex-1 px-3 py-2 bg-gray-900/50 border border-purple-900/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-400 outline-none resize-none text-sm text-purple-50 placeholder-purple-900/80 font-mono custom-scrollbar transition-all"
                required
              />
              <div className="flex items-center justify-between gap-2 mt-auto">
                <div className="flex gap-1.5">
                  {COLOR_OPTIONS.map(opt => (
                    <button
                      key={opt.full}
                      type="button"
                      onClick={() => setSelectedColor(opt.full)}
                      className={`w-6 h-6 rounded-sm border ${opt.btn} transition-all hover:scale-110 ${selectedColor === opt.full ? 'ring-2 ring-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.3)]' : ''}`}
                      aria-label="Selecionar cor"
                    />
                  ))}
                </div>
                <button type="submit" className="bg-purple-950 border border-purple-500 text-purple-300 p-2 rounded-lg transition-all hover:bg-purple-900 hover:text-purple-100 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                  <Plus size={18} />
                </button>
              </div>
            </form>
          </div>

          {/* Grid de Post-its */}
          <AnimatePresence mode="popLayout">
          {postIts.map(note => (
            <motion.div 
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              key={note.id} 
              className={`${note.color} p-5 rounded-xl border aspect-square flex flex-col relative group transform hover:-translate-y-1 transition-all backdrop-blur-md font-mono before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[2px] before:bg-white/20 before:rounded-t-xl`}
            >
              <button 
                onClick={() => removeNote(note.id)}
                className="absolute top-3 right-3 text-white/50 hover:text-red-400 hover:bg-red-900/30 p-1 rounded transition-all opacity-0 group-hover:opacity-100 z-10"
              >
                <Trash2 size={14} />
              </button>
              <p className="text-sm whitespace-pre-wrap flex-1 mt-1 leading-relaxed overflow-y-auto custom-scrollbar pr-1 relative z-0">
                {note.text}
              </p>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10 relative z-0">
                <p className="text-[10px] text-white/50 tracking-wider">
                  {new Date(note.createdAt).toLocaleDateString()}
                </p>
                <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse"></div>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>


        </div>
      </section>
    </div>
  );
}
