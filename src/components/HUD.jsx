import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Activity, Database, Lock, FileText, Upload, Zap, Globe, Terminal } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { FILES_DB } from '../data/lore';

const LoreDecrypter = ({ text, russianText }) => {
  const [display, setDisplay] = useState(russianText || text);
  const [phase, setPhase] = useState(russianText ? 'rus' : 'eng');

  useEffect(() => {
    if (!russianText) return;
    const cyrillicChars = 'ЖДЛФПУЩЪЫЭЯБГЗИКМНОПРСТУФХЦЧШЩЬЮЯ';
    let isMounted = true;
    const timeout = setTimeout(() => {
      if (!isMounted) return;
      setPhase('scramble');
      let i = 0;
      const timer = setInterval(() => {
        if (!isMounted) return;
        setDisplay(() => {
          if (i >= text.length) { clearInterval(timer); setPhase('eng'); return text; }
          const char = cyrillicChars[Math.floor(Math.random() * cyrillicChars.length)];
          return text.substring(0, i) + char + text.substring(i + 1).replace(/./g, () => cyrillicChars[Math.floor(Math.random() * cyrillicChars.length)]);
        });
        i += 0.5;
      }, 40);
    }, 1000);
    return () => { isMounted = false; clearTimeout(timeout); };
  }, [text, russianText]);

  return <span className={`${phase === 'rus' ? 'text-red-500 font-black tracking-widest drop-shadow-[0_0_5px_rgba(255,0,0,1)]' : 'text-warmind-red/90'}`}>{display}</span>;
};

export const HUD = ({ logs, state, onCommand, playSound }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [logs]);

  const hexData = useMemo(() => [
    { hex: '0x1A2', status: 'OK' }, { hex: '0x3B4', status: '..' }, { hex: '0x5C6', status: 'OK' },
    { hex: '0x7D8', status: 'OK' }, { hex: '0x9E0', status: '..' }, { hex: '0xA1B', status: 'OK' },
    { hex: '0xC2D', status: 'OK' }, { hex: '0xE3F', status: '..' }, { hex: '0xF40', status: 'OK' },
    { hex: '0x152', status: '..' }, { hex: '0x263', status: 'OK' }, { hex: '0x374', status: 'OK' },
    { hex: '0x485', status: '..' }, { hex: '0x596', status: 'OK' }, { hex: '0x6A7', status: 'OK' },
    { hex: '0x7B8', status: '..' }, { hex: '0x8C9', status: 'OK' }, { hex: '0x9DA', status: '..' },
    { hex: '0xAEB', status: 'OK' }, { hex: '0xBFC', status: 'OK' }, { hex: '0xC0D', status: '..' },
    { hex: '0xD1E', status: 'OK' }, { hex: '0xE2F', status: 'OK' }, { hex: '0xF30', status: '..' },
    { hex: '0x041', status: 'OK' }, { hex: '0x152', status: '..' }, { hex: '0x263', status: 'OK' },
    { hex: '0x374', status: 'OK' }, { hex: '0x485', status: '..' }, { hex: '0x596', status: 'OK' },
    { hex: '0x6A7', status: 'OK' }, { hex: '0x7B8', status: '..' }, { hex: '0x8C9', status: 'OK' },
    { hex: '0x9DA', status: '..' }, { hex: '0xAEB', status: 'OK' }, { hex: '0xBFC', status: 'OK' },
    { hex: '0xC0D', status: '..' }, { hex: '0xD1E', status: 'OK' }, { hex: '0xE2F', status: 'OK' },
    { hex: '0xF30', status: '..' }, { hex: '0x041', status: 'OK' }
  ], []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onCommand(input);
    setInput('');
  };

  return (
    <div className="absolute inset-0 z-20 flex flex-col h-full pointer-events-none p-6">
      {/* HEADER */}
      <header className="flex justify-between items-center pb-4 border-b border-warmind-red/30 bg-gradient-to-b from-black/90 to-transparent pointer-events-auto">
        <h1 className="text-5xl font-black tracking-tighter text-warmind-red drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]">RASPUTIN</h1>
        <div className={`px-2 py-1 border border-warmind-red/50 text-[10px] font-bold tracking-[0.3em] ${state === 'siva' ? 'bg-red-600 text-black animate-pulse' : 'text-warmind-red'}`}>
           {state === 'siva' ? '!!! CRITICAL !!!' : 'SYSTEM ONLINE'}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden mt-4 gap-4">
        {/* ARCHIVES */}
        <div className="hidden md:flex flex-col w-64 bg-black/50 backdrop-blur-md border-r border-warmind-red/20 p-4 gap-4 pointer-events-auto">
           <div className="flex items-center gap-2 text-warmind-red border-b border-warmind-red/30 pb-2"><Database size={16} /> <span className="text-xs font-bold tracking-[0.2em]">ARCHIVES</span></div>
           <div className="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
              {FILES_DB.map((f, i) => (
                 <div key={i} className="group relative p-3 border border-warmind-red/10 bg-warmind-red/5 hover:bg-warmind-red/20 cursor-pointer overflow-hidden" onMouseEnter={() => playSound('type')}>
                    <div className="flex items-center gap-3 relative z-10">
                       {f.secure ? <Lock size={12} className="text-warmind-red" /> : <FileText size={12} className="opacity-50"/>}
                       <div><div className="text-[10px] font-bold text-warmind-red group-hover:text-white">{f.name}</div><div className="text-[8px] opacity-50 text-warmind-red">{f.size}</div></div>
                    </div>
                 </div>
              ))}
           </div>
           <button className="border border-warmind-red/50 py-3 text-[10px] font-bold tracking-widest uppercase hover:bg-warmind-red hover:text-black flex items-center justify-center gap-2 text-warmind-red"><Upload size={12} /> Ingest Data</button>
        </div>

        {/* CHAT */}
        <div className="flex-1 flex flex-col relative pointer-events-auto">
           <div className="flex-1 overflow-y-auto px-4 lg:px-20 py-4 space-y-4 scrollbar-hide">
              <AnimatePresence>
                 {logs.map((log) => (
                    <motion.div key={log.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={`flex flex-col ${log.type === 'user' ? 'items-end' : 'items-start'}`}>
                       <div className={`max-w-xl p-3 border-l-2 backdrop-blur-sm ${log.type === 'user' ? 'border-white/50 bg-white/5 text-right' : 'border-warmind-red bg-warmind-red/10'}`}>
                          <div className="text-[9px] uppercase tracking-widest opacity-50 mb-1 flex items-center gap-2 text-warmind-red">{log.type === 'user' ? 'OPERATOR' : 'WARMIND'} {log.type === 'ai' && <Zap size={8} />}</div>
                          <div className="font-bold text-sm md:text-lg text-warmind-red">{log.type === 'ai' ? <LoreDecrypter text={log.text} russianText={log.ru} /> : log.text}</div>
                       </div>
                    </motion.div>
                 ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
           </div>
           <form onSubmit={handleSubmit} className="p-4 bg-black/80 border border-warmind-red/30 flex items-center gap-4">
              <Terminal size={20} className={`text-warmind-red ${state === 'processing' ? 'animate-bounce' : ''}`} />
              <input type="text" value={input} onChange={(e) => { setInput(e.target.value); playSound('type'); }} placeholder={state === 'siva' ? "SYSTEM UNSTABLE..." : "ENTER DIRECTIVE..."} className="flex-1 bg-transparent border-none outline-none text-warmind-red placeholder-warmind-red/30 font-bold tracking-widest uppercase h-10" autoFocus />
              <button type="submit" className="text-[10px] font-bold bg-warmind-red/10 px-4 py-2 border border-warmind-red/50 hover:bg-warmind-red hover:text-black transition-all text-warmind-red">EXECUTE</button>
           </form>
        </div>

        {/* TELEMETRY */}
        <div className="hidden lg:flex flex-col w-64 bg-black/50 backdrop-blur-md border-l border-warmind-red/20 p-4 gap-4 pointer-events-auto">
           <div className="flex items-center gap-2 text-warmind-red border-b border-warmind-red/30 pb-2"><Activity size={16} /> <span className="text-xs font-bold tracking-[0.2em]">TELEMETRY</span></div>
           <div className="space-y-1">
              <div className="flex justify-between text-[9px] opacity-70 text-warmind-red"><span>NEURAL_LOAD</span><span className={state === 'siva' ? 'text-red-500 animate-pulse' : ''}>{state === 'siva' ? 'CRITICAL' : state === 'processing' ? 'COMPUTING' : 'STABLE'}</span></div>
              <div className="h-1 bg-warmind-red/20 w-full overflow-hidden"><motion.div className="h-full bg-warmind-red" animate={{ width: state === 'siva' ? '100%' : state === 'processing' ? '80%' : '10%' }} /></div>
           </div>

           {/* RESTORED SCROLLING HEX DATA */}
           <div className="flex-1 overflow-hidden opacity-40 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
              <div className="text-[8px] font-mono leading-tight text-warmind-red">
                 {hexData.map((item, i) => (
                    <div key={i} className="flex justify-between">
                       <span>{item.hex}</span>
                       <span>{item.status}</span>
                    </div>
                 ))}
              </div>
           </div>

           <div className={`border p-2 ${state === 'siva' ? 'border-red-500 bg-red-900/20' : 'border-warmind-red/30'}`}>
              <div className="flex items-center gap-2 mb-1 text-warmind-red"><Globe size={12} className={state === 'siva' ? 'animate-spin' : ''} /><span className="text-[9px] font-bold">GLOBAL THREAT</span></div>
              <div className="text-xs font-black tracking-widest text-warmind-red">{state === 'siva' ? 'MIDNIGHT EXIGENT' : 'DEFCON 4'}</div>
           </div>
        </div>
      </div>
    </div>
  );
};