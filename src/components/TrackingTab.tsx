import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Check, CheckCircle2, Circle, Plus, Trash2, Edit2, Save, X, Activity } from 'lucide-react';

interface Task {
  id: string;
  cityCode: string;
  contractNumber: string;
  salesperson: string;
  status: 'pendente' | 'concluido';
  createdAt: number;
}

export function TrackingTab() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('dashboard_tasks', []);
  const [cityCode, setCityCode] = useState('');
  const [contractNumber, setContractNumber] = useState('');
  const [salesperson, setSalesperson] = useState('');
  const [editTaskId, setEditTaskId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityCode.trim() || !contractNumber.trim() || !salesperson.trim()) return;

    if (editTaskId) {
      setTasks(tasks.map(t => 
        t.id === editTaskId 
          ? { 
              ...t, 
              cityCode: cityCode.trim(), 
              contractNumber: contractNumber.trim(), 
              salesperson: salesperson.trim() 
            } 
          : t
      ));
      setEditTaskId(null);
    } else {
      const newTask: Task = {
        id: crypto.randomUUID(),
        cityCode: cityCode.trim(),
        contractNumber: contractNumber.trim(),
        salesperson: salesperson.trim(),
        status: 'pendente',
        createdAt: Date.now(),
      };
      setTasks([newTask, ...tasks]);
    }

    setCityCode('');
    setContractNumber('');
    setSalesperson('');
  };

  const handleEdit = (task: Task) => {
    setEditTaskId(task.id);
    setCityCode(task.cityCode);
    setContractNumber(task.contractNumber);
    setSalesperson(task.salesperson);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditTaskId(null);
    setCityCode('');
    setContractNumber('');
    setSalesperson('');
  };

  const toggleStatus = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, status: task.status === 'pendente' ? 'concluido' : 'pendente' } 
        : task
    ));
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-cyan-50 flex items-center gap-2">
          <Activity className="text-cyan-400" />
          Acompanhamento {editTaskId && <span className="text-xs ml-2 px-2 py-1 bg-cyan-900/50 text-cyan-300 rounded-md uppercase tracking-widest border border-cyan-500/30">Modo Edição</span>}
        </h2>
        <p className="text-sm text-cyan-500/70 mt-1 font-mono uppercase tracking-wider">Gerencie status de contratos e vendas_</p>
      </div>

      {/* Form */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:flex-row md:items-end relative z-10">
          <div className="flex-1 space-y-1">
            <label htmlFor="cityCode" className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Código da Cidade</label>
            <input
              id="cityCode"
              type="text"
              value={cityCode}
              onChange={(e) => setCityCode(e.target.value)}
              placeholder="Ex: CWB"
              className="w-full px-4 py-2 bg-gray-900/50 border border-cyan-900/50 rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 outline-none transition-all text-cyan-50 placeholder-cyan-900/80 font-mono"
              required
            />
          </div>
          <div className="flex-1 space-y-1">
            <label htmlFor="contractNumber" className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Nº do Contrato</label>
            <input
              id="contractNumber"
              type="text"
              value={contractNumber}
              onChange={(e) => setContractNumber(e.target.value)}
              placeholder="Ex: 123456"
              className="w-full px-4 py-2 bg-gray-900/50 border border-cyan-900/50 rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 outline-none transition-all text-cyan-50 placeholder-cyan-900/80 font-mono"
              required
            />
          </div>
          <div className="flex-1 space-y-1 md:col-span-2">
            <label htmlFor="salesperson" className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Operador(a)</label>
            <input
              id="salesperson"
              type="text"
              value={salesperson}
              onChange={(e) => setSalesperson(e.target.value)}
              placeholder="Nome"
              className="w-full px-4 py-2 bg-gray-900/50 border border-cyan-900/50 rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 outline-none transition-all text-cyan-50 placeholder-cyan-900/80"
              required
            />
          </div>
          {editTaskId ? (
            <div className="flex flex-col sm:flex-row gap-2 md:w-auto mt-2 md:mt-0">
              <button 
                type="submit" 
                className="flex-1 sm:w-32 bg-cyan-950 border border-cyan-500 text-cyan-300 font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all h-[42px] hover:bg-cyan-900 hover:text-cyan-100 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              >
                <Save size={18} />
                <span>Salvar</span>
              </button>
              <button 
                type="button" 
                onClick={handleCancelEdit}
                className="flex-1 sm:w-32 bg-gray-900/80 border border-gray-700 text-gray-400 font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all h-[42px] hover:text-gray-200 hover:border-gray-500"
              >
                <X size={18} />
                <span>Cancelar</span>
              </button>
            </div>
          ) : (
            <button 
              type="submit" 
              className="md:w-32 bg-cyan-500 text-gray-900 font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all h-[42px] mt-2 md:mt-0 hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)]"
            >
              <Plus size={18} />
              <span>Inserir</span>
            </button>
          )}
        </form>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-12 glass-panel rounded-2xl border-dashed border-cyan-900/50">
            <p className="text-cyan-700 font-mono tracking-widest text-sm">NO_DATA_FOUND</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {tasks.map(task => (
              <div 
                key={task.id} 
                className={`group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                  task.status === 'concluido' 
                    ? 'bg-blue-900/10 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                    : 'bg-black/40 border-gray-800 hover:border-cyan-900/50'
                }`}
              >
                {task.status === 'concluido' && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
                )}
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 w-full mb-4 sm:mb-0 relative z-10 pl-2">
                  {/* Status Badge */}
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest w-max border ${
                    task.status === 'concluido' 
                      ? 'bg-cyan-950/50 text-cyan-400 border-cyan-500/30' 
                      : 'bg-gray-900/50 text-gray-500 border-gray-800'
                  }`}>
                    {task.status === 'concluido' ? 'Concluído' : 'Pendente'}
                  </span>
                  
                  {/* Info */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 md:gap-10">
                    <div>
                      <span className="text-[10px] text-cyan-600/70 uppercase tracking-widest">Cidade</span>
                      <p className={`font-mono ${task.status === 'concluido' ? 'text-cyan-100' : 'text-gray-300'}`}>
                        {task.cityCode}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-cyan-600/70 uppercase tracking-widest">Contrato</span>
                      <p className={`font-mono ${task.status === 'concluido' ? 'text-cyan-100' : 'text-gray-300'}`}>
                        {task.contractNumber}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-cyan-600/70 uppercase tracking-widest">Operador</span>
                      <p className={`${task.status === 'concluido' ? 'text-cyan-100' : 'text-gray-300'}`}>
                        {task.salesperson}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end relative z-10">
                  <button
                    onClick={() => toggleStatus(task.id)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                      task.status === 'concluido'
                        ? 'text-cyan-400 border-cyan-500/30 bg-cyan-950/30 hover:bg-cyan-950/60'
                        : 'text-gray-500 border-gray-800 bg-gray-900/50 hover:text-cyan-400 hover:border-cyan-900/50 hover:bg-cyan-950/20'
                    }`}
                  >
                    {task.status === 'concluido' ? (
                      <>
                        <CheckCircle2 size={14} className="text-cyan-400" />
                        <span>Feito</span>
                      </>
                    ) : (
                      <>
                        <Circle size={14} />
                        <span>Concluir</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(task)}
                    className="p-1.5 text-gray-500 hover:text-cyan-400 border border-transparent hover:border-cyan-900/50 hover:bg-cyan-950/20 rounded-lg transition-all"
                    aria-label="Editar"
                    title="Editar"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => removeTask(task.id)}
                    className="p-1.5 text-gray-600 hover:text-red-400 border border-transparent hover:border-red-900/50 hover:bg-red-950/20 rounded-lg transition-all"
                    aria-label="Excluir"
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
