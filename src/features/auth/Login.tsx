import React, { useState } from 'react';
import { Branding } from '../../components/Branding';
import { ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoginProps {
  onLogin: (userName: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('يرجى إدخال اسم القائد.');
      return;
    }

    if (pass === 'GOV123') {
      setError('');
      onLogin(name.trim());
    } else {
      setError('كلمة المرور غير صحيحة.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm p-8 border shadow-2xl bg-zinc-900 rounded-2xl border-zinc-800"
      >
        <Branding />
        <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-right">
          <input 
            type="text" placeholder="اسم القائد..." required
            className="w-full p-3 text-right rounded-lg outline-none bg-zinc-800 focus:ring-1 focus:ring-gold"
            onChange={(e) => setName(e.target.value)}
          />
          <input 
            type="password" placeholder="كلمة المرور..." required
            className="w-full p-3 text-right rounded-lg outline-none bg-zinc-800 focus:ring-1 focus:ring-gold"
            onChange={(e) => setPass(e.target.value)}
          />
          <button className="flex items-center justify-center w-full gap-2 py-3 font-bold bg-yellow-600 rounded-lg hover:bg-yellow-700">
            <ShieldCheck size={20} /> دخول النظام
          </button>
          {error ? <p className="text-sm text-center text-red-400">{error}</p> : null}
        </form>
      </motion.div>
    </div>
  );
};