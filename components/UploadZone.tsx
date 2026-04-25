import React, { useRef, useState } from 'react';
import { UploadCloud, Camera } from 'lucide-react';
import { motion } from 'motion/react';

interface UploadZoneProps {
  onImageSelected: (base64: string) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      onImageSelected(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`
        w-full max-w-2xl mx-auto p-12 border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center transition-all duration-300
        ${isDragging 
          ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_50px_-12px_rgba(99,102,241,0.3)]' 
          : 'border-white/10 hover:border-white/20 glass-card'}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="user"
        className="hidden"
      />

      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg mb-8">
        <button
          onClick={() => cameraInputRef.current?.click()}
          className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 rounded-3xl transition-all text-white shadow-xl shadow-indigo-900/20 group transform hover:-translate-y-1"
        >
          <div className="bg-white/20 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner">
            <Camera className="w-8 h-8 text-white" strokeWidth={1.5} />
          </div>
          <span className="font-display font-bold tracking-wide text-lg">Uslikaj se</span>
          <span className="text-xs text-indigo-400 mt-2 font-mono bg-black/20 px-2 py-0.5 rounded-full">Kamera</span>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 flex flex-col items-center justify-center p-8 bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl transition-all text-white shadow-xl group transform hover:-translate-y-1"
        >
          <div className="bg-slate-800 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner border border-white/5">
            <UploadCloud className="w-8 h-8 text-slate-300" strokeWidth={1.5} />
          </div>
          <span className="font-display font-bold tracking-wide text-lg text-slate-200">Izaberi sliku</span>
          <span className="text-xs text-slate-500 mt-2 font-mono bg-black/20 px-2 py-0.5 rounded-full">Galerija</span>
        </button>
      </div>

      <div className="flex items-center gap-4 w-full max-w-md my-4">
         <div className="h-px bg-white/5 flex-1"></div>
         <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest whitespace-nowrap">ili prevuci sliku</span>
         <div className="h-px bg-white/5 flex-1"></div>
      </div>

      <p className="text-slate-400 mt-4 text-sm text-center px-4 font-light leading-relaxed max-w-md">
        <span className="text-slate-500">Za najbolje rezultate, koristi dobro osvetljeno lice (gledajući u kameru).</span>
      </p>
    </motion.div>
  );
};

export default UploadZone;