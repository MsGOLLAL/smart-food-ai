import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Sparkles, MapPin, Truck, CheckSquare, ChevronRight, Award, Flame, Users, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

// Reusable 3D Parallax Tilt Card Component
function TiltCard({ children, className }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;

    // Max 10 degrees 3D tilt
    setRotateY((x / (box.width / 2)) * 10);
    setRotateX(-(y / (box.height / 2)) * 10);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.15s ease-out'
      }}
      className={`${className} preserve-3d`}
    >
      {children}
    </div>
  );
}

// High-Fidelity AI Supply Chain Flow & CNN Freshness Chamber Simulator
function SupplyChainHub() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  const SIMULATION_ITEMS = {
    biryani: {
      id: 'biryani',
      name: 'Veg Biryani',
      donorId: 'cmcafe',
      donorName: 'CM Cafe',
      ngoId: 'agaashram',
      ngoName: 'Aga Ashram Center',
      baseFreshness: 94,
      decayRateAmbient: 1.5,
      decayRateRefrig: 0.4,
      decayRateFrozen: 0.1,
      imageDesc: 'Spiced basmati rice with mixed seasonal vegetables',
      icon: '🍛',
      moldIndex: 0.2,
      co2: 12.4,
      weight: 15.0,
      color: '#10B981', // Green
      label: '🍲 LUNCH ITEM'
    },
    salad: {
      id: 'salad',
      name: 'Fruit Salad',
      donorId: 'grandplaza',
      donorName: 'Grand Plaza',
      ngoId: 'carengo',
      ngoName: 'Malleshwaram Care',
      baseFreshness: 86,
      decayRateAmbient: 2.2,
      decayRateRefrig: 0.3,
      decayRateFrozen: 0.1,
      imageDesc: 'Chilled organic crisp apples and blueberries',
      icon: '🥗',
      moldIndex: 0.6,
      co2: 8.5,
      weight: 9.0,
      color: '#0D9488', // Teal
      label: '🥗 COLD RAW'
    },
    pastries: {
      id: 'pastries',
      name: 'Cream Pastries',
      donorId: 'indiranagar',
      donorName: 'Indiranagar Hub',
      ngoId: 'agaashram',
      ngoName: 'Aga Ashram Center',
      baseFreshness: 72,
      decayRateAmbient: 2.5,
      decayRateRefrig: 0.5,
      decayRateFrozen: 0.15,
      imageDesc: 'Custard cream pastries with glazed strawberry topping',
      icon: '🍰',
      moldIndex: 1.8,
      co2: 6.2,
      weight: 7.5,
      color: '#F97316', // Orange
      label: '🍰 SWEET BAKERY'
    },
    bananas: {
      id: 'bananas',
      name: 'Overripe Bananas',
      donorId: 'grandplaza',
      donorName: 'Grand Plaza',
      ngoId: 'biowaste',
      ngoName: 'Bio-Disposal Depot',
      baseFreshness: 24,
      decayRateAmbient: 3.5,
      decayRateRefrig: 1.2,
      decayRateFrozen: 0.3,
      imageDesc: 'Fuzzy gray surface mold patches and blackened skin',
      icon: '🍌',
      moldIndex: 26.4,
      co2: 0.0,
      weight: 12.0,
      color: '#EF4444', // Red
      label: '🚨 SPOILED BANANAS'
    }
  };

  const [activeId, setActiveId] = useState('biryani');
  const [storageMode, setStorageMode] = useState('ambient');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLineY, setScanLineY] = useState(0);
  const [co2Accumulated, setCo2Accumulated] = useState(1147300);
  const [mealsAccumulated, setMealsAccumulated] = useState(458920);
  
  const [logs, setLogs] = useState([
    "💡 Supply Chain Hub initialized. Direct flow pipelines online.",
    "🏢 Node Indiranagar listed surplus pastries (CNN Index: 72%).",
    "🧠 CNN ML Model evaluated pastries: Medium Urgency. Scheduled transit.",
    "🎉 Handover complete at Aga Ashram Center. [+6.2 kg CO₂ saved!]"
  ]);

  const activeItem = SIMULATION_ITEMS[activeId];

  // Dynamic calculations following CNN physical modeling rules
  let calculatedFreshness = activeItem.baseFreshness;
  if (activeId === 'bananas') {
    calculatedFreshness = Math.max(5, Math.round(activeItem.baseFreshness * (storageMode === 'frozen' ? 0.8 : storageMode === 'refrigerated' ? 0.6 : 0.4)));
  } else {
    const rate = storageMode === 'frozen' ? activeItem.decayRateFrozen : storageMode === 'refrigerated' ? activeItem.decayRateRefrig : activeItem.decayRateAmbient;
    // Simulate time elapsed of 2.2 hours
    calculatedFreshness = Math.max(5, Math.round(activeItem.baseFreshness * Math.exp(-0.15 * rate * 2.2)));
  }

  let calculatedUrgency = "Low";
  let pickupPriority = "Standard";
  if (calculatedFreshness > 75) {
    calculatedUrgency = "Low";
    pickupPriority = "Standard";
  } else if (calculatedFreshness >= 50) {
    calculatedUrgency = "Medium";
    pickupPriority = "Urgent";
  } else {
    calculatedUrgency = "High";
    pickupPriority = "Immediate";
  }

  // Scanner laser line animation
  useEffect(() => {
    let laserDir = 1;
    let frameId;
    const updateLaser = () => {
      setScanLineY(prev => {
        let next = prev + laserDir * 1.5;
        if (next >= 100) {
          next = 100;
          laserDir = -1;
        } else if (next <= 0) {
          next = 0;
          laserDir = 1;
        }
        return next;
      });
      frameId = requestAnimationFrame(updateLaser);
    };
    frameId = requestAnimationFrame(updateLaser);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Handle Dispatch Simulation triggers
  const handleDispatch = (itemId) => {
    if (isScanning) return;
    setActiveId(itemId);
    setIsScanning(true);
    setScanProgress(0);
    
    // Spawn transition particles: Donor to Scanner
    const item = SIMULATION_ITEMS[itemId];
    setLogs(prev => [...prev, `📝 SURPLUS listing uploaded: ${item.donorName} uploaded ${item.name}.`].slice(-4));
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setScanProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        
        // Scan completed -> Calculate & dispatch to target
        setIsScanning(false);
        const finalFreshness = itemId === 'bananas' ? 12 : Math.max(5, Math.round(item.baseFreshness * Math.exp(-0.15 * (storageMode === 'frozen' ? item.decayRateFrozen : storageMode === 'refrigerated' ? item.decayRateRefrig : item.decayRateAmbient) * 2.2)));
        const finalUrgency = finalFreshness > 75 ? "Low" : finalFreshness >= 50 ? "Medium" : "High";
        
        if (itemId === 'bananas' || finalFreshness < 25) {
          setLogs(prev => [
            ...prev,
            `🧠 CNN ML MODEL: Evaluated ${item.name} freshness at ${finalFreshness}% (${finalUrgency} Urgency).`,
            `🚨 INTERCEPTED: Bio-hazard surface mold index at ${item.moldIndex}%. Recycled to Bio-Disposal Depot.`
          ].slice(-4));
        } else {
          setMealsAccumulated(prev => prev + 1);
          setCo2Accumulated(prev => prev + item.co2);
          setLogs(prev => [
            ...prev,
            `🧠 CNN ML MODEL: Evaluated ${item.name} freshness at ${finalFreshness}% (${finalUrgency} Urgency).`,
            `🎯 MATCHED: Sent to ${item.ngoName}. Volunteer courier dispatched.`,
            `🎉 HANDOVER CONFIRMED: Completed rescue! [+${item.co2} kg CO₂ saved]`
          ].slice(-4));
        }
      }
    }, 80);
  };

  // Canvas Bezier Flow animation logic
  const particlesRef = useRef([]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frameId;

    let width = canvas.width = 400;
    let height = canvas.height = 400;

    const resize = () => {
      if (containerRef.current) {
        width = canvas.width = containerRef.current.clientWidth;
        height = canvas.height = containerRef.current.clientHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Define Node Coordinates relative to viewport size
      const nodes = {
        cmcafe: { x: width * 0.14, y: height * 0.22, color: '#10B981' },
        grandplaza: { x: width * 0.14, y: height * 0.50, color: '#0D9488' },
        indiranagar: { x: width * 0.14, y: height * 0.78, color: '#F97316' },
        scanner: { x: width * 0.50, y: height * 0.50, color: '#6366F1' },
        agaashram: { x: width * 0.86, y: height * 0.28, color: '#10B981' },
        carengo: { x: width * 0.86, y: height * 0.50, color: '#0D9488' },
        biowaste: { x: width * 0.86, y: height * 0.72, color: '#EF4444' }
      };

      // 1. Draw static grid flow routes (dotted)
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 6]);

      // Connect Donors to Scanner
      ['cmcafe', 'grandplaza', 'indiranagar'].forEach(donorKey => {
        const d = nodes[donorKey];
        const s = nodes.scanner;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.quadraticCurveTo((d.x + s.x)/2, (d.y + s.y)/2 - 15, s.x, s.y);
        ctx.stroke();
      });

      // Connect Scanner to NGOs
      ['agaashram', 'carengo', 'biowaste'].forEach(ngoKey => {
        const s = nodes.scanner;
        const n = nodes[ngoKey];
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.quadraticCurveTo((s.x + n.x)/2, (s.y + n.y)/2 + 15, n.x, n.y);
        ctx.stroke();
      });

      ctx.setLineDash([]); // Reset line dash

      // 2. Animate and clean up active flowing particles
      if (isScanning && Math.random() < 0.22) {
        // Spawn particle flowing from donor to scanner
        const donorKey = activeItem.donorId;
        particlesRef.current.push({
          x: nodes[donorKey].x,
          y: nodes[donorKey].y,
          targetX: nodes.scanner.x,
          targetY: nodes.scanner.y,
          progress: 0,
          speed: 0.045,
          color: activeItem.color,
          size: 4.5 + Math.random() * 2.5
        });
      }

      // Periodically spawn ambient background flow to keep screen alive
      if (!isScanning && Math.random() < 0.03) {
        const donorsList = ['cmcafe', 'grandplaza', 'indiranagar'];
        const ngosList = ['agaashram', 'carengo'];
        const randDonor = donorsList[Math.floor(Math.random() * donorsList.length)];
        const randNgo = ngosList[Math.floor(Math.random() * ngosList.length)];
        
        // Spawn flow to scanner first
        particlesRef.current.push({
          x: nodes[randDonor].x,
          y: nodes[randDonor].y,
          targetX: nodes.scanner.x,
          targetY: nodes.scanner.y,
          progress: 0,
          speed: 0.03,
          color: 'rgba(16, 185, 129, 0.35)',
          size: 3,
          nextStop: randNgo
        });
      }

      particlesRef.current.forEach((p, idx) => {
        p.progress += p.speed;

        // Compute Bezier cubic interpolation coordinates
        const startX = p.x;
        const startY = p.y;
        const endX = p.targetX;
        const endY = p.targetY;
        
        // Quad control point to create curvature
        const ctrlX = (startX + endX) / 2;
        const ctrlY = (startY + endY) / 2 + (endX === nodes.scanner.x ? -15 : 15);

        const t = p.progress;
        const curX = (1-t)*(1-t)*startX + 2*(1-t)*t*ctrlX + t*t*endX;
        const curY = (1-t)*(1-t)*startY + 2*(1-t)*t*ctrlY + t*t*endY;

        // Render glowing particle
        ctx.beginPath();
        ctx.arc(curX, curY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0; // reset

        // Chain to next stop (Scanner -> NGO)
        if (p.progress >= 1) {
          particlesRef.current.splice(idx, 1);
          if (p.nextStop) {
            // Spawn next leg
            particlesRef.current.push({
              x: nodes.scanner.x,
              y: nodes.scanner.y,
              targetX: nodes[p.nextStop].x,
              targetY: nodes[p.nextStop].y,
              progress: 0,
              speed: 0.03,
              color: 'rgba(16, 185, 129, 0.35)',
              size: 3
            });
          }
        }
      });

      frameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, [isScanning, activeId]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative flex flex-col justify-between p-4 bg-slate-900/[0.01]"
    >
      {/* Background Flow Particles Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* Supply Chain Node Rows */}
      <div className="grid grid-cols-12 gap-3 flex-1 items-stretch z-10 relative">
        
        {/* Left Column: Donors (Listing Sources) */}
        <div className="col-span-3 flex flex-col justify-between py-2 space-y-3">
          <div className="text-[9px] font-black tracking-widest text-slate-400 uppercase text-center border-b border-slate-100 pb-1.5 font-sans">
            🏢 SURPLUS SOURCES
          </div>

          <div 
            className={`glass-panel p-3 rounded-2xl border transition-all text-left flex flex-col justify-center flex-1 relative ${
              activeItem.donorId === 'cmcafe' ? 'border-emerald-500 bg-emerald-50/20 shadow-md scale-[1.02]' : 'border-slate-100'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl">🏢</span>
              <div>
                <h4 className="font-extrabold text-[11px] text-slate-800 leading-tight">CM Cafe</h4>
                <p className="text-[9px] text-slate-400 font-bold">Indiranagar</p>
              </div>
            </div>
            {activeItem.donorId === 'cmcafe' && (
              <div className="mt-2 text-[8.5px] bg-emerald-500/10 text-emerald-700 font-extrabold rounded-lg px-2 py-0.5 self-start animate-pulse">
                Listing: {activeItem.name}
              </div>
            )}
          </div>

          <div 
            className={`glass-panel p-3 rounded-2xl border transition-all text-left flex flex-col justify-center flex-1 relative ${
              activeItem.donorId === 'grandplaza' ? 'border-emerald-500 bg-emerald-50/20 shadow-md scale-[1.02]' : 'border-slate-100'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl">🏨</span>
              <div>
                <h4 className="font-extrabold text-[11px] text-slate-800 leading-tight">Grand Plaza</h4>
                <p className="text-[9px] text-slate-400 font-bold">Central MG Rd</p>
              </div>
            </div>
            {activeItem.donorId === 'grandplaza' && (
              <div className={`mt-2 text-[8.5px] font-extrabold rounded-lg px-2 py-0.5 self-start animate-pulse ${
                activeId === 'bananas' ? 'bg-red-500/10 text-red-700' : 'bg-emerald-500/10 text-emerald-700'
              }`}>
                Listing: {activeItem.name}
              </div>
            )}
          </div>

          <div 
            className={`glass-panel p-3 rounded-2xl border transition-all text-left flex flex-col justify-center flex-1 relative ${
              activeItem.donorId === 'indiranagar' ? 'border-emerald-500 bg-emerald-50/20 shadow-md scale-[1.02]' : 'border-slate-100'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl">🏬</span>
              <div>
                <h4 className="font-extrabold text-[11px] text-slate-800 leading-tight">Indiranagar Hub</h4>
                <p className="text-[9px] text-slate-400 font-bold">Defence Colony</p>
              </div>
            </div>
            {activeItem.donorId === 'indiranagar' && (
              <div className="mt-2 text-[8.5px] bg-emerald-500/10 text-emerald-700 font-extrabold rounded-lg px-2 py-0.5 self-start animate-pulse">
                Listing: {activeItem.name}
              </div>
            )}
          </div>
        </div>

        {/* Center Column: Holographic CNN Chamber */}
        <div className="col-span-6 flex flex-col justify-between py-2 px-1">
          <div className="text-[9px] font-black tracking-widest text-indigo-600 uppercase text-center border-b border-slate-100 pb-1.5 font-sans">
            🧠 LOCAL CNN FRESHNESS CHAMBER
          </div>

          {/* Glowing Viewfinder Box */}
          <div className="flex-1 my-3 bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl overflow-hidden relative flex flex-col justify-between p-3 font-mono text-[9px] text-emerald-400 select-none">
            
            {/* Holographic scanner mesh layer */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
            
            {/* Neon sweeping laser line */}
            <div 
              style={{ top: `${scanLineY}%` }}
              className="absolute left-0 w-full h-[2px] bg-emerald-400 shadow-[0_0_8px_#10B981,0_0_15px_#10B981] z-20 transition-all duration-75 pointer-events-none" 
            />

            {/* Viewfinder corner targets */}
            <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-emerald-500" />
            <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-emerald-500" />
            <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-emerald-500" />
            <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-emerald-500" />

            {/* Camera feed overlay info */}
            <div className="flex justify-between items-start z-10">
              <div className="flex flex-col text-[8px]">
                <span>[CAM FEED // NODE_SCAN]</span>
                <span className="text-slate-500">{activeItem.donorName} / ID: {activeId}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping inline-block" />
                <span className="text-[8px] text-red-500 font-bold">ANALYZING</span>
              </div>
            </div>

            {/* Simulated item camera shot preview */}
            <div className="flex-1 flex flex-col items-center justify-center relative my-2">
              {/* Bounding box target */}
              <div className="border border-emerald-500/20 bg-emerald-500/[0.02] p-4 rounded-xl flex items-center justify-center relative hover:scale-105 transition-transform">
                <span className="text-5xl drop-shadow-md filter select-none">{activeItem.icon}</span>
                <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t border-l border-emerald-400" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t border-r border-emerald-400" />
                <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b border-l border-emerald-400" />
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b border-r border-emerald-400" />
              </div>
              
              <div className="mt-2 text-[9px] text-slate-300 font-semibold px-6 text-center leading-tight">
                "{activeItem.imageDesc}"
              </div>
            </div>

            {/* ML Diagnostic parameters HUD panel */}
            <div className="border-t border-slate-800 pt-2 flex justify-between items-end z-10 text-[8.5px]">
              <div className="space-y-0.5 text-left font-bold text-slate-400">
                <div>CNN CONFIDENCE: <span className="text-emerald-400">97.82%</span></div>
                <div>SURFACE MOLD INDEX: <span className={activeItem.moldIndex > 5 ? 'text-red-400' : 'text-emerald-400'}>{activeItem.moldIndex}%</span></div>
                <div>URGENCY PRIORITY: <span className={calculatedUrgency === 'High' ? 'text-red-400' : calculatedUrgency === 'Medium' ? 'text-orange-400' : 'text-emerald-400'}>{pickupPriority.toUpperCase()}</span></div>
              </div>

              {/* Glowing circular metric panel */}
              <div className="flex flex-col items-center justify-center pl-2 border-l border-slate-800">
                <div className="relative w-11 h-11 flex items-center justify-center">
                  {/* Clean SVG circular ring */}
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="22" cy="22" r="18" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                    <circle 
                      cx="22" 
                      cy="22" 
                      r="18" 
                      fill="transparent" 
                      stroke={calculatedUrgency === 'High' ? '#EF4444' : calculatedUrgency === 'Medium' ? '#F97316' : '#10B981'} 
                      strokeWidth="3.2" 
                      strokeDasharray={`${2 * Math.PI * 18}`}
                      strokeDashoffset={`${2 * Math.PI * 18 * (1 - calculatedFreshness / 100)}`}
                      className="transition-all duration-300"
                    />
                  </svg>
                  <span className="absolute text-[8.5px] font-black text-white">{calculatedFreshness}%</span>
                </div>
                <span className="text-[7.5px] text-slate-500 font-extrabold uppercase mt-1 font-sans">Freshness</span>
              </div>
            </div>
            
            {/* Linear scanning visual timeline */}
            {isScanning && (
              <div className="absolute inset-0 bg-slate-950/75 z-30 flex flex-col items-center justify-center p-4">
                <div className="w-32 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                  <div 
                    style={{ width: `${scanProgress}%` }}
                    className="bg-emerald-500 h-full shadow-[0_0_10px_#10B981] transition-all duration-75"
                  />
                </div>
                <span className="text-[9px] tracking-widest text-emerald-400 font-black uppercase mt-2 animate-pulse">
                  COMPUTING ML SPOILAGE INDEX ({scanProgress}%)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: NGO Targets (Delivery targets) */}
        <div className="col-span-3 flex flex-col justify-between py-2 space-y-3">
          <div className="text-[9px] font-black tracking-widest text-slate-400 uppercase text-center border-b border-slate-100 pb-1.5 font-sans">
            🏫 TARGET DESTINATIONS
          </div>

          <div 
            className={`glass-panel p-3 rounded-2xl border transition-all text-left flex flex-col justify-center flex-1 relative ${
              activeItem.ngoId === 'agaashram' ? 'border-emerald-500 bg-emerald-50/20 shadow-md scale-[1.02]' : 'border-slate-100'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl">🏫</span>
              <div>
                <h4 className="font-extrabold text-[11px] text-slate-800 leading-tight">Aga Ashram</h4>
                <p className="text-[9px] text-slate-400 font-bold">Capacity: Large</p>
              </div>
            </div>
            <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '42%' }} />
            </div>
            <div className="mt-1 text-[7.5px] text-slate-400 font-bold font-sans">Storage occupancy: 42%</div>
          </div>

          <div 
            className={`glass-panel p-3 rounded-2xl border transition-all text-left flex flex-col justify-center flex-1 relative ${
              activeItem.ngoId === 'carengo' ? 'border-emerald-500 bg-emerald-50/20 shadow-md scale-[1.02]' : 'border-slate-100'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl">🏥</span>
              <div>
                <h4 className="font-extrabold text-[11px] text-slate-800 leading-tight">Care Shelter</h4>
                <p className="text-[9px] text-slate-400 font-bold">Capacity: Medium</p>
              </div>
            </div>
            <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '68%' }} />
            </div>
            <div className="mt-1 text-[7.5px] text-slate-400 font-bold font-sans">Storage occupancy: 68%</div>
          </div>

          <div 
            className={`glass-panel p-3 rounded-2xl border transition-all text-left flex flex-col justify-center flex-1 relative ${
              activeItem.ngoId === 'biowaste' ? 'border-red-500 bg-red-50/20 shadow-md scale-[1.02]' : 'border-slate-100'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl">♻️</span>
              <div>
                <h4 className="font-extrabold text-[11px] text-slate-800 leading-tight">Bio-Depot</h4>
                <p className="text-[9px] text-slate-400 font-bold">Organic Recycling</p>
              </div>
            </div>
            <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-red-500 h-full rounded-full" style={{ width: '12%' }} />
            </div>
            <div className="mt-1 text-[7.5px] text-slate-400 font-bold font-sans">Disposal usage: 12%</div>
          </div>
        </div>

      </div>

      {/* Control Deck Overlay Panels */}
      <div className="w-full bg-white/95 backdrop-blur-md border border-eco-mint/20 rounded-2xl p-3 shadow-md text-left relative z-20 space-y-2.5 mt-2">
        
        {/* Interactive Simulation list tags */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2.5 border-b border-slate-100">
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider font-sans">Simulate Listing:</span>
            <button 
              disabled={isScanning}
              onClick={() => handleDispatch('biryani')}
              className={`px-3 py-1.5 rounded-xl text-[9.5px] font-extrabold transition-all border font-sans ${
                activeId === 'biryani' ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm scale-105' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              🍛 Biryani
            </button>
            <button 
              disabled={isScanning}
              onClick={() => handleDispatch('salad')}
              className={`px-3 py-1.5 rounded-xl text-[9.5px] font-extrabold transition-all border font-sans ${
                activeId === 'salad' ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm scale-105' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              🥗 Salad
            </button>
            <button 
              disabled={isScanning}
              onClick={() => handleDispatch('pastries')}
              className={`px-3 py-1.5 rounded-xl text-[9.5px] font-extrabold transition-all border font-sans ${
                activeId === 'pastries' ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm scale-105' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              🍰 Pastries
            </button>
            <button 
              disabled={isScanning}
              onClick={() => handleDispatch('bananas')}
              className={`px-3 py-1.5 rounded-xl text-[9.5px] font-extrabold transition-all border font-sans ${
                activeId === 'bananas' ? 'bg-red-600 text-white border-red-600 shadow-sm scale-105' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              🍌 Rotten Banana
            </button>
          </div>

          {/* Temperature controls */}
          <div className="flex items-center space-x-1 border border-slate-200 rounded-xl p-0.5 bg-slate-50 shrink-0 self-end sm:self-auto">
            <button 
              onClick={() => setStorageMode('ambient')}
              className={`px-2 py-1 rounded-lg text-[9px] font-black transition-all font-sans ${
                storageMode === 'ambient' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              🌡️ AMBIENT
            </button>
            <button 
              onClick={() => setStorageMode('refrigerated')}
              className={`px-2 py-1 rounded-lg text-[9px] font-black transition-all font-sans ${
                storageMode === 'refrigerated' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              ❄️ CHILLED
            </button>
            <button 
              onClick={() => setStorageMode('frozen')}
              className={`px-2 py-1 rounded-lg text-[9px] font-black transition-all font-sans ${
                storageMode === 'frozen' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              🧊 FROZEN
            </button>
          </div>
        </div>

        {/* Live event logs ticker */}
        <div className="flex flex-col justify-end text-[10px] space-y-1 h-[72px] overflow-hidden font-sans">
          {logs.map((log, idx) => (
            <div 
              key={idx} 
              className={`font-semibold transition-all duration-300 leading-tight py-0.5 ${
                idx === logs.length - 1 ? 'text-slate-800 font-extrabold translate-x-1' :
                idx === logs.length - 2 ? 'text-slate-500' : 'text-slate-300'
              }`}
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { user } = useApp();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden pt-20 bg-[#FAFDFB]">
      
      {/* 3D scrolling perspective grid backdrop */}
      <div className="absolute inset-0 perspective-container z-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 perspective-grid w-full h-[200%]" />
      </div>
      
      {/* Light soft mint gradients and floating circles */}
      <div className="absolute top-[-10%] left-[-20%] w-[600px] h-[600px] rounded-full bg-eco-mint/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-[25%] right-[-10%] w-[500px] h-[500px] rounded-full bg-eco-teal/8 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[10%] w-[700px] h-[700px] rounded-full bg-eco-mint/5 blur-[120px] pointer-events-none" />

      {/* Cinematic Bright Hero Section with Light-Styled Canvas interactive planet */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 pt-16 pb-20 relative text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column - Headline details */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 lg:col-span-7 flex flex-col justify-center"
          >
            {/* Badge indicator */}
            <motion.div 
              variants={itemVariants}
              className="self-start inline-flex items-center space-x-2 bg-eco-mint/15 border border-eco-emerald/15 px-4.5 py-1.5 rounded-full text-xs font-bold text-eco-emerald tracking-wider hover:scale-105 transition-transform"
            >
              <Sparkles className="w-4 h-4 text-eco-emerald animate-pulse" />
              <span>AI-Driven Zero Food Waste Initiative</span>
            </motion.div>

            {/* Eco Main Headline */}
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-800"
            >
              Rescuing Food. <br />
              Fighting Hunger. <br />
              <span className="bg-gradient-to-r from-eco-sage via-eco-emerald to-eco-teal bg-clip-text text-transparent drop-shadow-sm">
                Powered by AI.
              </span>
            </motion.h1>

            {/* Core supporting details */}
            <motion.p 
              variants={itemVariants}
              className="text-slate-500 text-base md:text-lg max-w-2xl font-semibold leading-relaxed"
            >
              Smart Food Network connects restaurants, NGOs, and volunteers using real-time spatial mapping and advanced food decay forecasting to feed families instead of landfills.
            </motion.p>

            {/* Action CTAs */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row justify-start items-center gap-4.5 pt-4 w-full"
            >
              <Link 
                to={user ? "/donor-dashboard" : "/auth"}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-eco-emerald to-eco-teal text-white font-extrabold rounded-full hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/10 transition-all flex items-center justify-center space-x-2 text-sm uppercase tracking-wider"
              >
                <span>Initialize Rescue Mission</span>
                <ChevronRight className="w-5 h-5 text-white" />
              </Link>
              <a 
                href="#workflow"
                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 shadow-sm rounded-full hover:bg-slate-50 hover:scale-105 transition-all font-bold flex items-center justify-center space-x-2 text-sm"
              >
                <span>See How It Works</span>
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column - Light theme interactive canvas AI Smart Supply Chain Hub */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, type: 'spring' }}
            className="lg:col-span-5 relative w-full h-[460px] md:h-[530px] rounded-3xl overflow-hidden glass-panel border border-eco-mint/25 shadow-xl flex items-center justify-center bg-white/70"
          >
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/30 to-eco-mint/5" />
            
            {/* 100% Reliable Native Light-Styled Canvas Smart Supply Chain Flow Visualizer */}
            <div className="w-full h-full relative z-10 flex items-center justify-center">
              <SupplyChainHub />
            </div>
            
            {/* Glass glow indicator badge */}
            <div className="absolute bottom-4 left-4 z-20 glass-panel px-3.5 py-2 rounded-xl border border-eco-emerald/10 text-[10px] uppercase font-black tracking-widest text-slate-700 flex items-center space-x-1.5 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-eco-emerald animate-ping" />
              <span>AI Supply Chain Online</span>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Premium Light Metrics Section */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-10 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          
          <TiltCard className="glass-panel p-6 rounded-2xl text-center shadow-soft-card border-eco-border/30 relative group overflow-hidden bg-white/80 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-eco-mint/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-3xl lg:text-4xl font-extrabold text-eco-sage mb-1" style={{ transform: 'translateZ(30px)' }}>458,920+</div>
            <div className="text-xs lg:text-sm font-bold text-slate-500 uppercase tracking-widest" style={{ transform: 'translateZ(20px)' }}>Meals Saved</div>
            <div className="mt-2 text-[10px] text-eco-emerald bg-eco-mint/10 px-2.5 py-0.5 rounded-full inline-block font-extrabold" style={{ transform: 'translateZ(25px)' }}>100% Retained</div>
          </TiltCard>

          <TiltCard className="glass-panel p-6 rounded-2xl text-center shadow-soft-card border-eco-border/30 relative group overflow-hidden bg-white/80 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-eco-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-3xl lg:text-4xl font-extrabold text-eco-emerald mb-1" style={{ transform: 'translateZ(30px)' }}>1,147,300 kg</div>
            <div className="text-xs lg:text-sm font-bold text-slate-500 uppercase tracking-widest" style={{ transform: 'translateZ(20px)' }}>CO₂ Reduced</div>
            <div className="mt-2 text-[10px] text-eco-teal bg-eco-teal/10 px-2.5 py-0.5 rounded-full inline-block font-extrabold" style={{ transform: 'translateZ(25px)' }}>Net Climate Positive</div>
          </TiltCard>

          <TiltCard className="glass-panel p-6 rounded-2xl text-center shadow-soft-card border-eco-border/30 relative group overflow-hidden bg-white/80 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-eco-mint/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-3xl lg:text-4xl font-extrabold text-[#0D9488] mb-1" style={{ transform: 'translateZ(30px)' }}>1,480+</div>
            <div className="text-xs lg:text-sm font-bold text-slate-500 uppercase tracking-widest" style={{ transform: 'translateZ(20px)' }}>NGOs Connected</div>
            <div className="mt-2 text-[10px] text-eco-emerald bg-eco-mint/10 px-2.5 py-0.5 rounded-full inline-block font-extrabold" style={{ transform: 'translateZ(25px)' }}>Proximity Optimized</div>
          </TiltCard>

          <TiltCard className="glass-panel p-6 rounded-2xl text-center shadow-soft-card border-eco-border/30 relative group overflow-hidden bg-white/80 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-eco-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-3xl lg:text-4xl font-extrabold text-eco-orange mb-1" style={{ transform: 'translateZ(30px)' }}>12 Mins</div>
            <div className="text-xs lg:text-sm font-bold text-slate-500 uppercase tracking-widest" style={{ transform: 'translateZ(20px)' }}>Avg Rescue ETA</div>
            <div className="mt-2 text-[10px] text-eco-orange bg-eco-orange/10 px-2.5 py-0.5 rounded-full inline-block font-extrabold" style={{ transform: 'translateZ(25px)' }}>Super-Fast Dispatch</div>
          </TiltCard>

        </div>
      </section>

      {/* Core Innovation Features grid */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-20 relative">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-800">AI & Geolocation Integrations</h2>
          <p className="text-slate-500 font-semibold">We deploy cutting-edge tech nodes at each phase of the food logistics network.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          <TiltCard className="glass-panel p-8 rounded-3xl border-eco-border/30 space-y-4 bg-white/90 shadow-soft-card hover:border-eco-emerald/30 hover:shadow-lg transition-all text-left cursor-pointer">
            <div className="w-12 h-12 bg-eco-mint/10 rounded-2xl flex items-center justify-center text-eco-emerald border border-eco-mint/20 mb-4 shadow-sm" style={{ transform: 'translateZ(25px)' }}>
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-800" style={{ transform: 'translateZ(20px)' }}>CNN Freshness Evaluation</h3>
            <p className="text-slate-500 text-sm leading-relaxed" style={{ transform: 'translateZ(10px)' }}>
              Upload a snapshot of the food item. Our built-in CNN image classification model computes spoilage indexes, safe hour counters, storage conditions, and immediate priority scales.
            </p>
          </TiltCard>

          <TiltCard className="glass-panel p-8 rounded-3xl border-eco-border/30 space-y-4 bg-white/90 shadow-soft-card hover:border-eco-emerald/30 hover:shadow-lg transition-all text-left cursor-pointer">
            <div className="w-12 h-12 bg-eco-mint/10 rounded-2xl flex items-center justify-center text-[#0D9488] border border-eco-mint/20 mb-4 shadow-sm" style={{ transform: 'translateZ(25px)' }}>
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-800" style={{ transform: 'translateZ(20px)' }}>Proximity Smart NGO Matching</h3>
            <p className="text-slate-500 text-sm leading-relaxed" style={{ transform: 'translateZ(10px)' }}>
              No manual scrolling required. Our custom algorithms match local hot meals list to the nearest registered shelter based on capacity, distance matrix, and emergency levels.
            </p>
          </TiltCard>

          <TiltCard className="glass-panel p-8 rounded-3xl border-eco-border/30 space-y-4 bg-white/90 shadow-soft-card hover:border-eco-emerald/30 hover:shadow-lg transition-all text-left cursor-pointer">
            <div className="w-12 h-12 bg-eco-mint/10 rounded-2xl flex items-center justify-center text-eco-orange border border-eco-mint/20 mb-4 shadow-sm" style={{ transform: 'translateZ(25px)' }}>
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-800" style={{ transform: 'translateZ(20px)' }}>Simulated GPS Live Tracking</h3>
            <p className="text-slate-500 text-sm leading-relaxed" style={{ transform: 'translateZ(10px)' }}>
              Volunteers navigate active delivery routes displayed on clean light maps, showing real-time ETA markers, dispatch notifications, and secure digital Handover locks.
            </p>
          </TiltCard>

        </div>
      </section>

      {/* Interactive Workflow timeline */}
      <section id="workflow" className="max-w-7xl mx-auto px-4 lg:px-8 py-20 relative bg-white/60 border-y border-gray-100">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs uppercase font-extrabold text-eco-emerald tracking-widest bg-eco-mint/10 px-3.5 py-1.5 rounded-full border border-eco-mint/15">
            Logistics Pipeline
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-800">A Unified Rescue Loop</h2>
        </div>

        <div className="grid md:grid-cols-5 gap-6 relative text-left">
          
          <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-xs font-black text-eco-emerald tracking-widest uppercase">Step 01</div>
            <div className="font-extrabold text-base text-slate-800 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-eco-mint/10 border border-eco-mint/20 text-xs flex items-center justify-center text-eco-emerald font-bold">1</span>
              <span>List Surplus</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              Restaurants or event organizers take 30 seconds to upload details, time, and photo.
            </p>
          </div>

          <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-xs font-black text-eco-emerald tracking-widest uppercase">Step 02</div>
            <div className="font-extrabold text-base text-slate-800 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-eco-mint/10 border border-eco-mint/20 text-xs flex items-center justify-center text-eco-emerald font-bold">2</span>
              <span>AI Evaluation</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              Our CNN model diagnoses freshness, safe food consumption hours, and carbon impact points.
            </p>
          </div>

          <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-xs font-black text-eco-emerald tracking-widest uppercase">Step 03</div>
            <div className="font-extrabold text-base text-slate-800 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-eco-mint/10 border border-eco-mint/20 text-xs flex items-center justify-center text-eco-emerald font-bold">3</span>
              <span>NGO Dispatch</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              System alerts the closest shelter, reserves storage slots, and generates unique security OTPs.
            </p>
          </div>

          <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-xs font-black text-eco-emerald tracking-widest uppercase">Step 04</div>
            <div className="font-extrabold text-base text-slate-800 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-eco-mint/10 border border-eco-mint/20 text-xs flex items-center justify-center text-eco-emerald font-bold">4</span>
              <span>Volunteer Radar</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              Nearby couriers accept the mission, update stages en route, and navigate using digital maps.
            </p>
          </div>

          <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-xs font-black text-eco-emerald tracking-widest uppercase">Step 05</div>
            <div className="font-extrabold text-base text-slate-800 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-eco-mint/10 border border-eco-mint/20 text-xs flex items-center justify-center text-eco-emerald font-bold">5</span>
              <span>OTP Handover</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              The NGO shares a unique passcode, triggering successful points, leaderboard updates, and admin charts.
            </p>
          </div>

        </div>
      </section>

      {/* Gamified Social Impact story */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-20 relative">
        <div className="glass-panel p-8 md:p-12 rounded-3xl border-eco-border/30 bg-white/90 shadow-soft-card relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-eco-mint/5 blur-3xl pointer-events-none" />
          
          <div className="space-y-6 max-w-2xl text-left">
            <div className="inline-flex items-center space-x-2 bg-eco-mint/15 text-eco-emerald px-3.5 py-1.5 rounded-full text-xs font-bold border border-eco-emerald/20">
              <Award className="w-4 h-4" />
              <span>Volunteering & Donor Leaderboards</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-800">
              Get Rewarded for Environmental and Social Stewardship
            </h3>
            <p className="text-slate-500 text-base leading-relaxed">
              Smart Food Network gamifies corporate listings and individual volunteer support. Earn XP, receive verified carbon certifications, move up regional rank tables, and qualify for emergency relief badges.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-600">
              <span className="bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200/60 flex items-center space-x-1 shadow-sm">
                <Flame className="w-3.5 h-3.5 text-eco-orange animate-pulse" />
                <span>CO₂ Badges</span>
              </span>
              <span className="bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200/60 flex items-center space-x-1 shadow-sm">
                <Users className="w-3.5 h-3.5 text-eco-emerald" />
                <span>Relief Champion</span>
              </span>
              <span className="bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200/60 flex items-center space-x-1 shadow-sm">
                <Heart className="w-3.5 h-3.5 text-red-500" />
                <span>Community Star</span>
              </span>
            </div>
          </div>

          <TiltCard className="shrink-0 flex flex-col items-center justify-center glass-panel p-8 rounded-2xl border-eco-mint/30 shadow-md bg-white text-center w-full md:w-80 cursor-pointer">
            <span className="text-5xl mb-2" style={{ transform: 'translateZ(30px)' }}>🏆</span>
            <div className="font-extrabold text-lg text-slate-800" style={{ transform: 'translateZ(20px)' }}>Global Leaderboard</div>
            <div className="text-xs text-eco-emerald font-bold mb-4" style={{ transform: 'translateZ(25px)' }}>Rank 1: +8,420 XP</div>
            <div className="w-full space-y-2 text-left" style={{ transform: 'translateZ(15px)' }}>
              <div className="flex justify-between items-center text-xs py-1.5 border-b border-gray-100">
                <span className="text-slate-600 font-semibold">1. Rakesh (Volunteer)</span>
                <span className="text-eco-emerald font-bold">8,420 XP</span>
              </div>
              <div className="flex justify-between items-center text-xs py-1.5 border-b border-gray-100">
                <span className="text-slate-600 font-semibold">2. Grand Plaza (Donor)</span>
                <span className="text-eco-emerald font-bold">7,150 XP</span>
              </div>
              <div className="flex justify-between items-center text-xs py-1.5">
                <span className="text-slate-600 font-semibold">3. Anjali (Volunteer)</span>
                <span className="text-eco-emerald font-bold">6,900 XP</span>
              </div>
            </div>
            <Link 
              to="/auth" 
              className="mt-6 w-full text-center py-2.5 bg-gradient-to-r from-eco-emerald to-eco-teal text-white font-extrabold rounded-xl shadow-sm transition-all text-xs"
              style={{ transform: 'translateZ(20px)' }}
            >
              Claim Your Profile
            </Link>
          </TiltCard>

        </div>
      </section>

      {/* Premium Light Theme footer */}
      <footer className="max-w-7xl mx-auto px-4 lg:px-8 py-10 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4 mt-20">
        <div>&copy; 2026 Smart Food Network. Sustainability Hackathon Edition.</div>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-slate-600 transition-colors">Privacy</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Github Repo</a>
        </div>
      </footer>

    </div>
  );
}
