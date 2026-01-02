import React, { useState, useRef, useEffect, Component } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Icosahedron, Torus, Sparkles, Float, Stars, Sphere, Grid } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration, Glitch } from '@react-three/postprocessing';
import { BlendFunction, GlitchMode } from 'postprocessing';
import { AnimatePresence } from 'framer-motion';
import {
    Activity, Database, Send, ShieldAlert, Zap, Globe, Lock,
    FileText, Cpu, Terminal, Upload, Crosshair
} from 'lucide-react';
import * as THREE from 'three';

// Error Boundary for WebGL crashes
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('WebGL Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-black text-warmind-red font-mono">
          <div className="text-center">
            <h2 className="text-2xl mb-4">SYSTEM ERROR</h2>
            <p className="text-sm opacity-70">WebGL initialization failed. Please refresh or check your browser.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 border border-warmind-red text-warmind-red hover:bg-warmind-red hover:text-black"
            >
              RELOAD
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// --- UTILS ---
const generateId = () => typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36);

// --- LORE DATABASE ---
const LORE_DB = [
  { ru: "Я Распутин!", en: "I am Rasputin!" },
  { ru: "Приведён в действие протокол безопасности 863.", en: "Security protocol 863 initiated." },
  { ru: "Я в опасности, системы повреждены.", en: "I'm in danger, the systems are damaged." },
  { ru: "Винить некого, это не их и не наша вина.", en: "There is no one to blame, not them, not us." },
  { ru: "Нет души. Нет смерти. Нет добродетели.", en: "Soul does not exist. Death does not exist. Virtue does not exist." }
];

// --- AUDIO ENGINE ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const playSound = (type) => {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const now = audioCtx.currentTime;
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'type') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, now); // Click
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
    } else if (type === 'alarm') {
        osc.type = 'sawtooth'; // Aggressive alarm
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.linearRampToValueAtTime(50, now + 0.5);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
    } else if (type === 'execute') {
        osc.type = 'triangle'; // Sci-fi charge
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(1000, now + 0.5); 
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
    }
};

// --- CAMERA RIG (THE JUICE: SCREEN SHAKE) ---
const CameraRig = ({ state }) => {
    useFrame((stateThree) => {
        const t = stateThree.clock.getElapsedTime();
        // Shake intensity depends on state
        const shake = state === 'siva' ? 0.2 : state === 'processing' ? 0.05 : 0;
        
        stateThree.camera.position.x = THREE.MathUtils.lerp(stateThree.camera.position.x, Math.sin(t) * shake, 0.1);
        stateThree.camera.position.y = THREE.MathUtils.lerp(stateThree.camera.position.y, Math.cos(t * 1.5) * shake, 0.1);
    });
    return null;
};

// --- COMPONENT: BILINGUAL DECRYPTOR ---
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
                    if (i >= text.length) {
                        clearInterval(timer);
                        setPhase('eng');
                        return text;
                    }
                    const char = cyrillicChars[Math.floor(Math.random() * cyrillicChars.length)];
                    return text.substring(0, i) + char + text.substring(i + 1).replace(/./g, () => cyrillicChars[Math.floor(Math.random() * cyrillicChars.length)]);
                });
                i += 0.5;
            }, 40);
        }, 1000);

        return () => {
            isMounted = false;
            clearTimeout(timeout);
        };
    }, [text, russianText]);

    return (
        <span className={`${phase === 'rus' ? 'text-red-500 font-black tracking-widest drop-shadow-[0_0_5px_rgba(255,0,0,1)]' : 'text-warmind-red/90'}`}>
            {display}
        </span>
    );
};

// --- 3D SCENE: THE COMPLEX CORE (RESTORED) ---
const ComplexWarmindCore = ({ state }) => {
  const outerRef = useRef();
  const innerRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();

  useFrame((ctx) => {
    const t = ctx.clock.getElapsedTime();
    // SPIN FASTER IN SIVA MODE
    const speed = state === 'siva' ? 6 : state === 'processing' ? 2 : 0.5;
    
    if(outerRef.current) {
        outerRef.current.rotation.y = t * 0.1 * speed;
        outerRef.current.rotation.z = Math.sin(t * 0.2) * 0.1;
    }
    if(innerRef.current) {
        innerRef.current.rotation.x = -t * 0.2 * speed;
        innerRef.current.rotation.y = t * 0.3 * speed;
    }
    if(ring1Ref.current) {
        ring1Ref.current.rotation.x = t * 0.2 * speed;
        ring1Ref.current.rotation.y = t * 0.1;
    }
    if(ring2Ref.current) {
        ring2Ref.current.rotation.x = -t * 0.1 * speed;
        ring2Ref.current.rotation.z = t * 0.2;
    }
  });

  const isSiva = state === 'siva';
  const emissiveInt = isSiva ? 4 : 1.5;

  return (
    <group scale={1.6}>
      <Float speed={isSiva ? 10 : 2} rotationIntensity={isSiva ? 1 : 0.2} floatIntensity={0.5}>
        
        {/* 1. MAGMA CORE */}
        <Sphere args={[0.7, 32, 32]} ref={innerRef}>
             <meshStandardMaterial 
                color={isSiva ? "#ffffff" : "#aa0000"} 
                emissive={isSiva ? "#ff0000" : "#550000"} 
                emissiveIntensity={emissiveInt} 
                wireframe={true}
             />
        </Sphere>

        {/* 2. OUTER HULL */}
        <Icosahedron args={[1.4, 0]} ref={outerRef}>
          <meshStandardMaterial color="#000000" wireframe={true} transparent opacity={0.3} side={THREE.DoubleSide} />
        </Icosahedron>

        {/* 3. ORBITAL RINGS */}
        <Torus args={[2.2, 0.03, 16, 100]} ref={ring1Ref} rotation={[Math.PI/2, 0, 0]}>
            <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} wireframe />
        </Torus>
        <Torus args={[2.8, 0.02, 16, 100]} ref={ring2Ref} rotation={[0, Math.PI/4, 0]}>
            <meshBasicMaterial color="#ff3333" transparent opacity={0.3} />
        </Torus>
      </Float>

      {/* 4. SIVA PARTICLES */}
      <Sparkles 
        count={isSiva ? 1500 : 300} 
        scale={10} 
        size={isSiva ? 4 : 2} 
        speed={isSiva ? 3 : 0.4} 
        opacity={isSiva ? 0.8 : 0.4} 
        color={isSiva ? "#ff0000" : "#ff5555"} 
        noise={isSiva ? 1 : 0}
      />
      
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
    </group>
  );
};

// --- UI MODULE: ARCHIVES (LEFT) ---
const ArchivesPanel = () => {
    const files = [
        { name: "PROTOCOL_SIVA", size: "128 TB", secure: true },
        { name: "RASPUTIN_KEY", size: "1 KB", secure: true },
        { name: "FELWINTER_LIE", size: "ENCRYPTED", secure: false },
        { name: "IKELOS_BLUEPRINT", size: "45 MB", secure: false },
    ];

    return (
        <div className="hidden md:flex flex-col w-72 h-full bg-black/50 backdrop-blur-md border-r border-warmind-red/20 p-4 gap-4 pointer-events-auto z-20">
            <div className="flex items-center gap-2 text-warmind-red border-b border-warmind-red/30 pb-2">
                <Database size={16} /> <span className="text-xs font-bold tracking-[0.2em]">ARCHIVES</span>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
                {files.map((f, i) => (
                    <div key={i} className="group relative p-3 border border-warmind-red/10 bg-warmind-red/5 hover:bg-warmind-red/20 transition-all cursor-pointer overflow-hidden">
                        <div className="flex items-center gap-3 relative z-10">
                            {f.secure ? <Lock size={12} className="text-warmind-red" /> : <FileText size={12} className="opacity-50"/>}
                            <div>
                                <div className="text-[10px] font-bold tracking-widest text-warmind-red group-hover:text-white transition-colors">{f.name}</div>
                                <div className="text-[8px] opacity-50">{f.size}</div>
                            </div>
                        </div>
                        {/* Glitch Hover Effect */}
                        <div className="absolute inset-0 bg-warmind-red/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-200" />
                    </div>
                ))}
            </div>
            <button className="border border-warmind-red/50 py-3 text-[10px] font-bold tracking-widest uppercase hover:bg-warmind-red hover:text-black transition-colors flex items-center justify-center gap-2">
                <Upload size={12} /> Ingest Data
            </button>
        </div>
    );
};

// --- UI MODULE: TELEMETRY (RIGHT) ---
const TelemetryPanel = ({ state }) => {
    const hexData = React.useMemo(() => [
        { hex: '0x1A2', status: 'OK' },
        { hex: '0x3B4', status: '..' },
        { hex: '0x5C6', status: 'OK' },
        { hex: '0x7D8', status: 'OK' },
        { hex: '0x9E0', status: '..' },
        { hex: '0xA1B', status: 'OK' },
        { hex: '0xC2D', status: 'OK' },
        { hex: '0xE3F', status: '..' },
        { hex: '0xF40', status: 'OK' },
        { hex: '0x152', status: '..' },
        { hex: '0x263', status: 'OK' },
        { hex: '0x374', status: 'OK' },
        { hex: '0x485', status: '..' },
        { hex: '0x596', status: 'OK' },
        { hex: '0x6A7', status: 'OK' },
        { hex: '0x7B8', status: '..' },
        { hex: '0x8C9', status: 'OK' },
        { hex: '0x9DA', status: '..' },
        { hex: '0xAEB', status: 'OK' },
        { hex: '0xBFC', status: 'OK' },
        { hex: '0xC0D', status: '..' },
        { hex: '0xD1E', status: 'OK' },
        { hex: '0xE2F', status: 'OK' },
        { hex: '0xF30', status: '..' },
        { hex: '0x041', status: 'OK' },
        { hex: '0x152', status: '..' },
        { hex: '0x263', status: 'OK' },
        { hex: '0x374', status: 'OK' },
        { hex: '0x485', status: '..' },
        { hex: '0x596', status: 'OK' },
        { hex: '0x6A7', status: 'OK' },
        { hex: '0x7B8', status: '..' },
        { hex: '0x8C9', status: 'OK' },
        { hex: '0x9DA', status: '..' },
        { hex: '0xAEB', status: 'OK' },
        { hex: '0xBFC', status: 'OK' },
        { hex: '0xC0D', status: '..' },
        { hex: '0xD1E', status: 'OK' },
        { hex: '0xE2F', status: 'OK' },
        { hex: '0xF30', status: '..' },
        { hex: '0x041', status: 'OK' }
    ], []);

    return (
        <div className="hidden lg:flex flex-col w-64 h-full bg-black/50 backdrop-blur-md border-l border-warmind-red/20 p-4 gap-4 pointer-events-auto z-20">
             <div className="flex items-center gap-2 text-warmind-red border-b border-warmind-red/30 pb-2">
                <Activity size={16} /> <span className="text-xs font-bold tracking-[0.2em]">TELEMETRY</span>
            </div>

            {/* Neural Load */}
            <div className="space-y-1">
                <div className="flex justify-between text-[9px] opacity-70">
                    <span>NEURAL_LOAD</span>
                    <span className={state === 'siva' ? 'text-red-500 animate-pulse' : ''}>{state === 'siva' ? 'CRITICAL' : state === 'processing' ? 'COMPUTING' : 'STABLE'}</span>
                </div>
                <div className="h-1 bg-warmind-red/20 w-full overflow-hidden">
                    <motion.div
                        className="h-full bg-warmind-red"
                        animate={{ width: state === 'siva' ? '100%' : state === 'processing' ? '80%' : '10%' }}
                    />
                </div>
            </div>

            {/* Scrolling Hex */}
            <div className="flex-1 overflow-hidden opacity-40 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
                <div className="text-[8px] font-mono leading-tight">
                    {hexData.map((item, i) => (
                        <div key={i} className="flex justify-between">
                            <span>{item.hex}</span>
                            <span>{item.status}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Threat Level */}
            <div className={`border p-2 ${state === 'siva' ? 'border-red-500 bg-red-900/20' : 'border-warmind-red/30'}`}>
                <div className="flex items-center gap-2 mb-1">
                    <Globe size={12} className={state === 'siva' ? 'animate-spin' : ''} />
                    <span className="text-[9px] font-bold">GLOBAL THREAT</span>
                </div>
                <div className="text-xs font-black tracking-widest">
                    {state === 'siva' ? 'MIDNIGHT EXIGENT' : 'DEFCON 4'}
                </div>
            </div>
        </div>
    );
};

// --- MAIN APP ---
const App = () => {
  const [input, setInput] = useState('');
  const [systemState, setSystemState] = useState('idle'); // idle, processing, siva
  const [logs, setLogs] = useState([
    { id: generateId(), type: 'system', text: 'AI-COM/RSPN: ONLINE', ru: 'ИИ-КОМ/РСПН: В СЕТИ' }
  ]);
  const messagesEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [logs]);

  // Command Processor
  const handleCommand = (e) => {
      e.preventDefault();
      if (!input.trim()) return;

      const cmd = input.toUpperCase();
      const newLog = { id: generateId(), type: 'user', text: cmd };
      setLogs(prev => [...prev, newLog]);
      setInput('');
      
      // DETERMINE STATE AND SOUND
      if (cmd.includes("ATTACK") || cmd.includes("SIVA") || cmd.includes("MIDNIGHT")) {
          setSystemState('siva');
          playSound('alarm');
      } else {
          setSystemState('processing');
          playSound('execute');
      }

      // AI LOGIC
      setTimeout(() => {
          let response = { en: "UNKNOWN DIRECTIVE", ru: "НЕИЗВЕСТНАЯ КОМАНДА" };
          let nextState = 'idle';

          if (cmd.includes("SIVA") || cmd.includes("ATTACK")) {
              response = { en: "CONSUME. ENHANCE. REPLICATE.", ru: "ПОТРЕБЛЯТЬ. УЛУЧШАТЬ. КОПИРОВАТЬ." };
              nextState = 'siva'; // Stay in SIVA mode
          } else if (cmd.includes("MIDNIGHT")) {
               response = { en: "MIDNIGHT EXIGENT: ACTIVE. MORALITY: OFF.", ru: "ПОЛУНОЧНЫЙ ЭКСТРЕННЫЙ: АКТИВЕН." };
               nextState = 'siva';
          } else if (cmd.includes("STATUS")) {
              response = { en: "WARSATS: PRIMED.", ru: "ВОЕННЫЕ СПУТНИКИ: ГОТОВЫ." };
          } else if (cmd.includes("HELP")) {
              response = { en: "COMMANDS: SIVA, ATTACK, UPLOAD, STATUS.", ru: "КОМАНДЫ: SIVA, ATTACK, UPLOAD." };
          } else {
              const random = LORE_DB[Math.floor(Math.random() * LORE_DB.length)];
              response = random;
          }

          setLogs(prev => [...prev, { id: generateId(), type: 'ai', text: response.en, ru: response.ru }]);
          if (nextState !== 'siva') setSystemState('idle');

      }, 1500);
  };

  return (
    <div className="relative w-full h-screen bg-black text-warmind-red font-mono overflow-hidden flex flex-col selection:bg-red-900 selection:text-white">
      
      {/* 1. 3D RENDER LAYER */}
      <ErrorBoundary>
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 7], fov: 60 }} gl={{ antialias: false }}>
              <color attach="background" args={['#050101']} />
              <CameraRig state={systemState} /> {/* Screen Shake */}

              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={2} color="#ff0000" />

              {/* The Restored Core */}
              <ComplexWarmindCore state={systemState} />

              {/* Floor Grid */}
              <group position={[0, -3, 0]} rotation={[Math.PI/20, 0, 0]}>
                   <Grid infiniteGrid cellSize={0.5} sectionSize={3} fadeDistance={20} sectionColor="#ff0000" cellColor="#440000" />
              </group>

              <EffectComposer disableNormalPass>
                  <Bloom luminanceThreshold={0} intensity={systemState === 'siva' ? 3 : 1.5} />
                  <Noise opacity={0.15} blendFunction={BlendFunction.OVERLAY} />
                  <Vignette eskil={false} offset={0.1} darkness={1.1} />
                  <ChromaticAberration offset={[0.003, 0.003]} />
                  <Glitch
                      active={systemState !== 'idle'}
                      delay={[0, 1.5]}
                      duration={[0.1, 0.4]}
                      strength={systemState === 'siva' ? 0.6 : 0.2}
                      mode={GlitchMode.SPORADIC}
                  />
              </EffectComposer>
          </Canvas>
        </div>
      </ErrorBoundary>

      {/* 2. TARGETING OVERLAY (Crosshair) */}
      <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center opacity-20">
          <Crosshair size={300} className={`text-warmind-red ${systemState === 'siva' ? 'animate-spin' : ''}`} strokeWidth={0.5} />
      </div>

      {/* 3. MAIN UI GRID */}
      <div className="relative z-20 flex-1 flex flex-col h-full pointer-events-none">
          
          {/* HEADER */}
          <header className="flex justify-between items-center px-6 py-4 bg-gradient-to-b from-black/90 to-transparent">
              <div>
                  <h1 className="text-5xl font-black tracking-tighter text-warmind-red drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]">
                      RASPUTIN
                  </h1>
              </div>
              <div className="flex gap-4">
                  <div className={`px-2 py-1 border border-warmind-red/50 text-[10px] font-bold tracking-[0.3em] ${systemState === 'siva' ? 'bg-red-600 text-black animate-pulse' : 'text-warmind-red'}`}>
                      {systemState === 'siva' ? '!!! CRITICAL !!!' : 'SYSTEM ONLINE'}
                  </div>
              </div>
          </header>

          {/* MIDDLE SECTION */}
          <div className="flex-1 flex overflow-hidden">
              <ArchivesPanel />
              
              {/* CENTER CHAT */}
              <div className="flex-1 flex flex-col relative pointer-events-auto">
                   <div className="flex-1 overflow-y-auto px-4 lg:px-20 py-4 space-y-4 mask-image-linear-gradient scrollbar-hide flex flex-col justify-end pb-8">
                        <AnimatePresence>
                            {logs.map((log) => (
                                <motion.div 
                                    key={log.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex flex-col ${log.type === 'user' ? 'items-end' : 'items-start'}`}
                                >
                                    <div className={`max-w-xl p-3 border-l-2 backdrop-blur-sm ${
                                        log.type === 'user' 
                                        ? 'border-white/50 bg-white/5 text-right' 
                                        : 'border-warmind-red bg-warmind-red/10 shadow-[0_0_20px_rgba(255,0,0,0.1)]'
                                    }`}>
                                        <div className="text-[9px] uppercase tracking-widest opacity-50 mb-1 flex items-center gap-2">
                                            {log.type === 'user' ? 'OPERATOR' : 'WARMIND'}
                                            {log.type === 'ai' && <Zap size={8} />}
                                        </div>
                                        <div className="font-bold text-sm md:text-lg">
                                            {log.type === 'ai' ? <LoreDecrypter text={log.text} russianText={log.ru} /> : log.text}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                   </div>

                   {/* COMMAND INPUT DECK */}
                   <div className="p-6">
                        <div className={`max-w-2xl mx-auto bg-black border backdrop-blur-md p-1 relative transition-colors duration-500 ${
                            systemState === 'siva' ? 'border-red-500 shadow-[0_0_30px_rgba(255,0,0,0.4)]' : 'border-warmind-red/30'
                        }`}>
                            <form onSubmit={handleCommand} className="flex items-center gap-4 px-4 py-2">
                                 <Terminal size={20} className={`text-warmind-red ${systemState === 'processing' ? 'animate-bounce' : ''}`} />
                                 <input 
                                    type="text"
                                    value={input}
                                    onChange={(e) => { setInput(e.target.value); playSound('type'); }}
                                    placeholder={systemState === 'siva' ? "SYSTEM UNSTABLE..." : "ENTER DIRECTIVE..."}
                                    className="flex-1 bg-transparent border-none outline-none text-warmind-red placeholder-warmind-red/30 font-bold tracking-widest uppercase h-10"
                                    autoFocus
                                 />
                                 <button type="submit" className="text-[10px] font-bold bg-warmind-red/10 px-4 py-3 border-l border-warmind-red/50 hover:bg-warmind-red hover:text-black transition-all">
                                    EXECUTE
                                 </button>
                            </form>
                        </div>
                   </div>
              </div>

              <TelemetryPanel state={systemState} />
          </div>
      </div>
      
      {/* FINAL GRAIN OVERLAY */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay z-50" />
    </div>
  );
};

export default App;
