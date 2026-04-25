import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

const Processing: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 space-y-10"
    >
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute w-32 h-32 rounded-full border border-indigo-500/30 border-t-indigo-500 shadow-[0_0_30px_-5px_rgba(99,102,241,0.5)]"
        />
        {/* Inner reverse spin */}
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute w-24 h-24 rounded-full border border-transparent border-b-purple-500 border-l-purple-500/50"
        />
        {/* Center element */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="bg-slate-900 rounded-full p-4 border border-white/10 shadow-inner z-10"
        >
          <Sparkles className="w-8 h-8 text-indigo-400" />
        </motion.div>
      </div>
      
      <div className="text-center space-y-3">
        <h3 className="text-3xl font-display font-bold animated-gradient-text">
          Kreiramo tvoj novi stil...
        </h3>
        <p className="text-lg text-slate-400 font-light max-w-md mx-auto">
          Gemini 2.5 trenutno analizira crte tvog lica, osvetljenje i primenjuje izabranu frizuru.
        </p>
      </div>
    </motion.div>
  );
};

export default Processing;