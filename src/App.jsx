import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Crosshair } from 'lucide-react';
import { Warmind3D } from './components/Warmind3D';
import { HUD } from './components/HUD';
import { useAudio } from './hooks/useAudio';
import { LORE_DB } from './data/lore';

// Fix for key error: Use a stable ID generator
const generateId = () => typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36);

const App = () => {
  const [state, setState] = useState('idle');
  const [logs, setLogs] = useState([
    { id: generateId(), type: 'system', text: 'AI-COM/RSPN: ONLINE', ru: 'ИИ-КОМ/РСПН: В СЕТИ' }
  ]);
  const { playSound } = useAudio();

  const handleCommand = (cmd) => {
    playSound('execute');
    const upperCmd = cmd.toUpperCase();
    setLogs(prev => [...prev, { id: generateId(), type: 'user', text: upperCmd }]);

    // Determine state
    if (upperCmd.includes("ATTACK") || upperCmd.includes("SIVA") || upperCmd.includes("MIDNIGHT")) {
      setState('siva');
      playSound('alarm');
    } else {
      setState('processing');
    }

    setTimeout(() => {
      let response = { en: "UNKNOWN DIRECTIVE", ru: "НЕИЗВЕСТНАЯ КОМАНДА" };
      let nextState = 'idle';

      if (upperCmd.includes("SIVA") || upperCmd.includes("ATTACK")) {
        response = { en: "CONSUME. ENHANCE. REPLICATE.", ru: "ПОТРЕБЛЯТЬ. УЛУЧШАТЬ. КОПИРОВАТЬ." };
        nextState = 'siva';
      } else if (upperCmd.includes("MIDNIGHT")) {
        response = { en: "MIDNIGHT EXIGENT: ACTIVE. MORALITY: OFF.", ru: "ПОЛУНОЧНЫЙ ЭКСТРЕННЫЙ: АКТИВЕН." };
        nextState = 'siva';
      } else if (upperCmd.includes("STATUS")) {
        response = { en: "WARSATS: PRIMED.", ru: "ВОЕННЫЕ СПУТНИКИ: ГОТОВЫ." };
      } else if (upperCmd.includes("HELP")) {
        response = { en: "COMMANDS: SIVA, ATTACK, UPLOAD, STATUS.", ru: "КОМАНДЫ: SIVA, ATTACK, UPLOAD." };
      } else {
        response = LORE_DB[Math.floor(Math.random() * LORE_DB.length)];
      }

      setLogs(prev => [...prev, { id: generateId(), type: 'ai', text: response.en, ru: response.ru }]);
      if (nextState !== 'siva') setState('idle');
    }, 1500);
  };

  return (
    <div className="relative w-full h-screen bg-black font-mono overflow-hidden selection:bg-red-900 selection:text-white">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 7], fov: 60 }} gl={{ antialias: false }}>
          <Warmind3D state={state} />
        </Canvas>
      </div>

      {/* Target Crosshair Layer */}
      <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center opacity-20">
         <Crosshair size={300} className={`text-warmind-red ${state === 'siva' ? 'animate-spin' : ''}`} strokeWidth={0.5} />
      </div>

      <HUD logs={logs} state={state} onCommand={handleCommand} playSound={playSound} />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay z-50" />
    </div>
  );
};

export default App;
