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

    if (pass === 'GOVNUM1') {
      setError('');
      onLogin(name.trim());
    } else {
      setError('كلمة المرور غير صحيحة.');
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen overflow-hidden bg-black">
      <motion.div
        className="absolute rounded-full -top-20 -right-16 size-72 bg-yellow-500/10 blur-3xl"
        animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.55, 0.25] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full -bottom-20 -left-16 size-80 bg-blue-500/10 blur-3xl"
        animate={{ scale: [1.15, 1, 1.15], opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="w-full max-w-sm p-8 border shadow-2xl bg-zinc-900 rounded-2xl border-zinc-800"
      >
        <Branding />
        <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-right">
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="text" placeholder="اسم القائد..." required
            className="w-full p-3 text-right rounded-lg outline-none bg-zinc-800 focus:ring-1 focus:ring-gold"
            onChange={(e) => setName(e.target.value)}
          />
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="password" placeholder="كلمة المرور..." required
            className="w-full p-3 text-right rounded-lg outline-none bg-zinc-800 focus:ring-1 focus:ring-gold"
            onChange={(e) => setPass(e.target.value)}
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center w-full gap-2 py-3 font-bold bg-yellow-600 rounded-lg hover:bg-yellow-700"
          >
            <ShieldCheck size={20} /> دخول النظام
          </motion.button>
          {error ? (
            <motion.p
              className="text-sm text-center text-red-400"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.p>
          ) : null}
        </form>
      </motion.div>
    </div>
  );
};