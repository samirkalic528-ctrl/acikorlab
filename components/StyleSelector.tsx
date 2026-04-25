import React from 'react';
import { Scissors, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export type StyleOption = {
  id: string;
  name: string;
  prompt: string;
};

// Innovative Hairstyles including 2027 trends
const HAIRSTYLES: StyleOption[] = [
  { id: 'neo-shag', name: '2027: Neo-Shag', prompt: 'Change hairstyle to Neo-shag heavily textured haircut, highly layered, modern 2027 trend. Maintain face exactly.' },
  { id: 'cyber-bob', name: '2027: Cyber Bob', prompt: 'Change hairstyle to sleek futuristic short cyber bob, sharp geometric edges, 2027 hair trend. Maintain face exactly.' },
  { id: 'holo-highlights', name: '2027: Holografik', prompt: 'Change hairstyle to have subtle iridescent holographic highlights, futuristic 2027 trend style. Maintain face exactly.' },
  { id: 'liquid-hair', name: '2027: Liquid Hair', prompt: 'Change hairstyle to ultra glossy, reflective long straight liquid hair, hyper-smooth 2027 trend. Maintain face exactly.' },
  { id: 'soft-mullet', name: '2027: Soft Mullet', prompt: 'Change hairstyle to a modern soft mullet, blended layers, fashion-forward 2027 trend. Maintain face exactly.' },
  { id: 'long-wavy', name: 'Dugi Talasi', prompt: 'Change hairstyle to long, loose beach waves. Keep natural hair color or make it slightly richer. Maintain face exactly.' },
  { id: 'pixie', name: 'Pixie Cut', prompt: 'Change hairstyle to a stylish, short pixie cut. Textured and modern. Maintain face exactly.' },
  { id: 'curtain-bangs', name: 'Curtain Bangs', prompt: 'Add trendy curtain bangs to the current hairstyle, framing the face softly. Maintain face exactly.' },
  { id: 'butterfly-cut', name: 'Butterfly Cut', prompt: 'Change hairstyle to a voluminous butterfly cut, bouncy layers framing the face. Maintain face exactly.' },
  { id: 'french-crop', name: 'French Crop', prompt: 'Change hairstyle to a modern textured french crop haircut for men. Maintain face exactly.' },
];

interface StyleSelectorProps {
  selectedStyleId: string | null;
  onSelectStyle: (styleId: string, prompt: string) => void;
  customPrompt: string;
  onCustomPromptChange: (text: string) => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ 
  selectedStyleId, 
  onSelectStyle,
  customPrompt,
  onCustomPromptChange
}) => {

  const handleCustomClick = () => {
    onSelectStyle('custom', customPrompt);
  };

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        {HAIRSTYLES.map((style) => (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            key={style.id}
            onClick={() => onSelectStyle(style.id, style.prompt)}
            className={`
              relative p-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 h-24 shadow-sm
              ${selectedStyleId === style.id 
                ? 'border-indigo-500 bg-indigo-500/20 shadow-indigo-500/20 shadow-lg' 
                : 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10'}
            `}
          >
            <span className={`font-semibold text-sm ${selectedStyleId === style.id ? 'text-white' : 'text-slate-300'}`}>
                {style.name}
            </span>
          </motion.button>
        ))}
      </div>

      <div className="relative pt-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center justify-center w-full">
            <div className="h-px bg-white/5 w-full absolute top-1/2 -translate-y-1/2"></div>
            <span className="bg-slate-900 px-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest relative z-10 glass-card rounded-full border border-white/5 py-1">
                ili kreiraj svoj stil
            </span>
        </div>
        
        <div 
          onClick={handleCustomClick}
          className={`
            p-6 rounded-3xl border-2 transition-all duration-300 cursor-pointer mt-6 shadow-sm
            ${selectedStyleId === 'custom' 
              ? 'border-purple-500/50 bg-purple-500/10 shadow-purple-500/20 shadow-lg' 
              : 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10'}
          `}
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className={`
                p-4 rounded-2xl transition-colors shrink-0 shadow-inner
                ${selectedStyleId === 'custom' ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white' : 'bg-white/5 text-slate-400 border border-white/5'}
                `}>
                  <Sparkles className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div className="w-full">
                    <h3 className="font-display font-bold text-lg text-white mb-1">Custom zahtev</h3>
                    <p className="text-sm text-slate-400 mb-4 font-light">
                        Opiši tačno kakvu frizuru ili boju želiš (npr. "Roze paž sa šiškama", "Ćelav sa bradom").
                    </p>
                    <textarea 
                        value={customPrompt}
                        onChange={(e) => {
                            onCustomPromptChange(e.target.value);
                            if (selectedStyleId === 'custom') {
                                onSelectStyle('custom', e.target.value);
                            }
                        }}
                        onFocus={() => onSelectStyle('custom', customPrompt)}
                        placeholder="Napiši tekstualni opis..."
                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm resize-none placeholder:text-slate-600"
                        rows={2}
                    />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StyleSelector;