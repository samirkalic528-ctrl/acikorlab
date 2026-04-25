import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Download, RefreshCw, X, ArrowRight, Scissors, Sparkles, Loader2 } from 'lucide-react';
import { generateHeadshot, generateStylistFeedback } from './services/geminiService';
import UploadZone from './components/UploadZone';
import StyleSelector from './components/StyleSelector';
import Processing from './components/Processing';

function App() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [customPromptText, setCustomPromptText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  const handleImageSelected = (base64: string) => {
    setOriginalImage(base64);
    setGeneratedImage(null);
    setSelectedStyleId(null);
    setFeedback(null);
    setError(null);
  };

  const handleStyleSelect = (styleId: string, prompt: string) => {
    setSelectedStyleId(styleId);
    setCurrentPrompt(prompt);
  };

  const executeGeneration = async (promptToUse: string) => {
    if (!originalImage || !promptToUse) return;

    setIsGenerating(true);
    setFeedback(null);
    setError(null);
    setGeneratedImage(null);

    let finalImage = null;
    try {
      finalImage = await generateHeadshot(originalImage, promptToUse);
      setGeneratedImage(finalImage);
    } catch (err: any) {
      setError(err.message || "Something went wrong while generating the image.");
    } finally {
      setIsGenerating(false);
    }

    if (finalImage) {
      setIsGeneratingFeedback(true);
      try {
        const feedbackText = await generateStylistFeedback(originalImage, finalImage, promptToUse);
        setFeedback(feedbackText);
      } catch (err) {
        console.error("Feedback generation failed:", err);
      } finally {
        setIsGeneratingFeedback(false);
      }
    }
  };

  const handleGenerate = () => executeGeneration(currentPrompt);

  const resetApp = () => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setSelectedStyleId(null);
    setCurrentPrompt('');
    setCustomPromptText('');
    setFeedback(null);
    setError(null);
  };

  const downloadImage = () => {
    if (!generatedImage) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        
        const fontSize = Math.max(24, Math.floor(canvas.width * 0.04));
        ctx.font = `bold ${fontSize}px Inter, sans-serif`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowBlur = 4;
        
        ctx.fillText('ACIKOR lab', canvas.width - (canvas.width * 0.04), canvas.height - (canvas.width * 0.04));
        
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `acikorlab-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };
    img.src = generatedImage;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="border-b border-white/5 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={resetApp}>
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg group-hover:scale-105 transition-transform">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-wide text-white">
              ACIKOR<span className="text-indigo-400 font-light">lab</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono text-slate-400 border border-white/10 bg-white/5 px-3 py-1.5 rounded-full shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Gemini 2.5 Flash
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-200 flex items-center justify-between shadow-xl"
            >
              <span className="text-sm font-medium">{error}</span>
              <button onClick={() => setError(null)} className="p-1 hover:bg-red-500/20 rounded-md transition-colors"><X className="w-5 h-5" /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 1: Upload */}
        {!originalImage && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-4">
              <Scissors className="w-4 h-4" />
              <span>AI Haircut & Styling</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 tracking-tight leading-tight">
              Tvoj novi <span className="animated-gradient-text">stil</span>.
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-12 font-light leading-relaxed">
              Isprobaj desetine popularnih frizura u sekundi. Ubaci sliku i otkrij kako ti stoji novi izgled uz stručne savete AI stiliste.
            </p>
            <UploadZone onImageSelected={handleImageSelected} />
          </motion.div>
        )}

        {/* Step 2: Configure & Generate */}
        {originalImage && !isGenerating && !generatedImage && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-12"
          >
            <div className="flex flex-col lg:flex-row gap-10 items-start justify-center">
              {/* Preview Original */}
              <div className="w-full lg:w-1/3 xl:w-1/4 space-y-4">
                <div className="aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 bg-slate-900 relative group shadow-2xl">
                  <img src={originalImage} alt="Original" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                    <button 
                      onClick={() => setOriginalImage(null)} 
                      className="bg-white text-slate-900 hover:scale-105 active:scale-95 px-6 py-3 rounded-full text-sm font-semibold transition-all shadow-xl"
                    >
                      Promeni sliku
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-slate-950/60 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg">
                    Originalna slika
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="w-full lg:w-2/3 xl:w-3/4 space-y-8 glass-card p-6 md:p-8 rounded-3xl">
                <div>
                  <h3 className="text-2xl font-display font-bold text-white mb-2">Izaberi stil</h3>
                  <p className="text-slate-400 text-sm">Pronađi savršenu frizuru za sebe</p>
                </div>
                
                <StyleSelector 
                  selectedStyleId={selectedStyleId}
                  onSelectStyle={handleStyleSelect}
                  customPrompt={customPromptText}
                  onCustomPromptChange={setCustomPromptText}
                />
                
                <div className="flex justify-end pt-8 border-t border-white/5 mt-8">
                  <button
                    onClick={handleGenerate}
                    disabled={!selectedStyleId || (selectedStyleId === 'custom' && !currentPrompt.trim())}
                    className={`
                      flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl
                      ${!selectedStyleId || (selectedStyleId === 'custom' && !currentPrompt.trim())
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white hover:scale-[1.02] active:scale-[0.98] hover:shadow-indigo-500/25'}
                    `}
                  >
                    <span>Generiši novi izgled</span>
                    <Sparkles className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Processing */}
        {isGenerating && (
          <Processing />
        )}

        {/* Step 4: Result */}
        {generatedImage && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <div className="text-center max-w-2xl mx-auto">
               <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Tvoj novi izgled</h2>
               <p className="text-lg text-slate-400">Pofesionalni kvalitet, AI generisano.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto items-center">
              <div className="space-y-4">
                 <div className="aspect-[4/5] rounded-3xl overflow-hidden border-2 border-white/5 bg-slate-900 relative shadow-2xl group cursor-crosshair">
                  <img src={originalImage!} alt="Original" className="w-full h-full object-cover opacity-70 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                  <div className="absolute top-4 left-4 bg-slate-950/60 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold text-slate-300 border border-white/10">
                    Pre
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                 <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-indigo-500/30 bg-slate-900 relative shadow-[0_0_40px_-15px_rgba(99,102,241,0.3)] group cursor-crosshair">
                  <img src={generatedImage} alt="Generated" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute top-4 left-4 bg-indigo-600/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg border border-white/10">
                    Posle
                  </div>
                  <div className="absolute bottom-4 right-6 pointer-events-none opacity-40 select-none mix-blend-overlay">
                    <span className="font-display font-bold text-white text-2xl drop-shadow-md tracking-wider">ACIKOR lab</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={downloadImage}
                    className="flex-1 bg-white text-slate-900 hover:bg-slate-200 py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors shadow-xl"
                  >
                    <Download className="w-5 h-5" />
                    Sačuvaj sliku
                  </button>
                  <button 
                    onClick={() => { setGeneratedImage(null); }}
                    className="flex-1 glass-card hover:bg-white/10 text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors border border-white/10 shadow-xl"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Probaj novu frizuru
                  </button>
                </div>
              </div>
            </div>
            
            {/* Feedback Section */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-4xl mx-auto mt-16 glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-purple-500" />
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-indigo-500/20 p-3 rounded-2xl text-indigo-400 border border-indigo-500/20 shadow-inner">
                  <Scissors className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-white">Stručni savet stiliste</h3>
                  <p className="text-slate-400 text-sm">Personalizovana analiza tvog oblika lica</p>
                </div>
              </div>
              
              {isGeneratingFeedback ? (
                <div className="space-y-4 animate-pulse pt-4">
                  <div className="flex items-center gap-3 text-indigo-400 mb-6 font-medium">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analiza lica u toku...
                  </div>
                  <div className="h-4 bg-white/5 rounded-full w-3/4"></div>
                  <div className="h-4 bg-white/5 rounded-full w-full"></div>
                  <div className="h-4 bg-white/5 rounded-full w-5/6"></div>
                  <div className="h-4 bg-white/5 rounded-full w-1/2 mt-6"></div>
                </div>
              ) : feedback ? (
                <div className="space-y-8">
                  <div className="text-slate-300 text-lg space-y-6 leading-relaxed [&>p]:mb-6 [&>strong]:text-white [&>strong]:font-semibold font-light">
                    <Markdown>{feedback}</Markdown>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 italic">Savet stiliste trenutno nije dostupan.</p>
              )}
            </motion.div>

            <div className="text-center pt-16 pb-12">
               <button 
                 onClick={resetApp}
                 className="text-slate-500 hover:text-slate-300 font-medium text-sm underline underline-offset-8 transition-colors"
               >
                 Vrati se na početak i učitaj novu sliku
               </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default App;