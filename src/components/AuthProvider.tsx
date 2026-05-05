import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithGoogle, signOut } from '../firebase';
import { LayoutDashboard, LogIn, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Error signing in", error);
    }
  };

  const logOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan-400" size={48} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-50 flex items-center justify-center p-4">
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full glass-panel p-8 rounded-2xl border border-cyan-900/30 text-center"
          >
            <div className="flex justify-center mb-6 text-cyan-400">
               <LayoutDashboard size={48} />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-cyan-50 mb-2">Omni Dashboard</h1>
            <p className="text-cyan-500/70 mb-8 font-mono uppercase tracking-wider text-sm">Autenticação Necessária_</p>
            
            <button 
              onClick={signIn}
              className="w-full flex items-center justify-center gap-3 bg-cyan-950 border border-cyan-500 text-cyan-300 py-3 rounded-xl font-bold tracking-widest uppercase hover:bg-cyan-900 transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            >
              <LogIn size={20} />
              Acessar Sistema
            </button>
         </motion.div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}
