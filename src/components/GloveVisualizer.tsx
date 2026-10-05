import React from 'react';
import { FlexSensors, IMUSensors } from '../types/glove';
import { Cpu, Wifi, BatteryCharging, Compass, Hand, Sparkles } from 'lucide-react';

interface GloveVisualizerProps {
  sensors: FlexSensors;
  imu: IMUSensors;
  touchContact: boolean;
  isConnected: boolean;
  deviceName: string;
  batteryLevel: number;
  activeGestureName?: string;
}

export const GloveVisualizer: React.FC<GloveVisualizerProps> = ({
  sensors,
  imu,
  touchContact,
  isConnected,
  deviceName,
  batteryLevel,
  activeGestureName
}) => {
  // Helper to get color based on flex amount
  const getFlexColor = (val: number) => {
    if (val < 30) return '#06b6d4'; // Cyan (open/straight)
    if (val < 70) return '#10b981'; // Emerald (partially bent)
    return '#f59e0b'; // Amber (fully bent)
  };

  // Convert flex value to SVG finger height/scale or transform
  // Higher flex means finger curls downward
  const getFingerCurvature = (val: number) => {
    const scaleY = Math.max(0.35, 1 - (val / 100) * 0.65);
    return scaleY;
  };

  return (
    <div className="relative bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-cyan-500/20 rounded-2xl p-5 shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Background cyber grid */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#0891b2_1px,transparent_1px),linear-gradient(to_bottom,#0891b2_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />

      {/* Top Glove Status Bar */}
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className={`w-3 h-3 rounded-full inline-block ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            {isConnected && <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-50" />}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" />
              {deviceName}
            </h3>
            <span className="text-[11px] text-cyan-400/80 font-mono">
              {isConnected ? 'متصل بالبلوتوث (نشط)' : 'وضع المحاكاة الذكية'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-md border border-slate-700/60 font-mono text-slate-300">
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
            <span>{batteryLevel}%</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-md border border-slate-700/60 font-mono text-slate-300">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>{Math.round(imu.pitch)}° / {Math.round(imu.roll)}°</span>
          </div>
        </div>
      </div>

      {/* SVG Hand Skeleton with Real-time Flex Simulation */}
      <div className="relative flex justify-center items-center py-4 my-2">
        <svg
          viewBox="0 0 400 380"
          className="w-full max-w-[340px] h-auto drop-shadow-[0_0_25px_rgba(6,182,212,0.18)]"
          style={{
            transform: `rotate(${imu.roll * 0.25}deg) scale(${1 + (imu.pitch * 0.001)})`,
            transition: 'transform 0.25s ease-out'
          }}
        >
          <defs>
            <linearGradient id="cyberGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="palmGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <filter id="neon" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Palm Base Blueprint */}
          <path
            d="M 110,210 C 100,280 120,330 200,340 C 280,330 300,280 290,210 C 285,185 270,180 260,180 C 240,180 220,185 200,185 C 180,185 160,180 140,180 C 130,180 115,185 110,210 Z"
            fill="url(#palmGrad)"
            stroke="#0ea5e9"
            strokeWidth="2.5"
            strokeDasharray="4 2"
            opacity="0.95"
          />

          {/* Microcontroller MCU Box in Palm */}
          <rect
            x="165"
            y="235"
            width="70"
            height="75"
            rx="8"
            fill="#090d16"
            stroke="#06b6d4"
            strokeWidth="2"
          />
          {/* Chip IC Details */}
          <circle cx="200" cy="272" r="14" fill="#06b6d4" fillOpacity="0.15" stroke="#06b6d4" strokeWidth="1" />
          <text x="200" y="275" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold" fontFamily="monospace">
            ESP32
          </text>
          {/* MCU Pins */}
          <line x1="165" y1="245" x2="155" y2="245" stroke="#38bdf8" strokeWidth="2" />
          <line x1="165" y1="258" x2="155" y2="258" stroke="#38bdf8" strokeWidth="2" />
          <line x1="165" y1="272" x2="155" y2="272" stroke="#38bdf8" strokeWidth="2" />
          <line x1="165" y1="285" x2="155" y2="285" stroke="#38bdf8" strokeWidth="2" />

          <line x1="235" y1="245" x2="245" y2="245" stroke="#38bdf8" strokeWidth="2" />
          <line x1="235" y1="258" x2="245" y2="258" stroke="#38bdf8" strokeWidth="2" />
          <line x1="235" y1="272" x2="245" y2="272" stroke="#38bdf8" strokeWidth="2" />
          <line x1="235" y1="285" x2="245" y2="285" stroke="#38bdf8" strokeWidth="2" />

          {/* Wrist band connector */}
          <path d="M 150,335 L 250,335 L 245,365 L 155,365 Z" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          <line x1="170" y1="350" x2="230" y2="350" stroke="#06b6d4" strokeWidth="2" strokeDasharray="3 3" />

          {/* 1. THUMB (الإبهام) */}
          <g
            transform={`translate(100, 220) rotate(${sensors.thumb * 0.4 - 35}) scale(1, ${getFingerCurvature(sensors.thumb)}) translate(-100, -220)`}
            style={{ transition: 'transform 0.15s ease-out' }}
          >
            {/* Flex sensor ribbon */}
            <path
              d="M 125,230 Q 80,210 60,170 Q 55,145 75,135 Q 95,145 105,175 Q 120,205 135,220"
              fill="#1e293b"
              stroke={getFlexColor(sensors.thumb)}
              strokeWidth="2.5"
              filter="url(#neon)"
            />
            {/* Joints */}
            <circle cx="85" cy="180" r="4" fill={getFlexColor(sensors.thumb)} />
            <circle cx="68" cy="148" r="4" fill={getFlexColor(sensors.thumb)} />
            {/* Wiring back to chip */}
            <path d="M 130,225 Q 145,240 165,250" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
          </g>

          {/* 2. INDEX FINGER (السبابة) */}
          <g
            transform={`translate(150, 185) scale(1, ${getFingerCurvature(sensors.index)}) translate(-150, -185)`}
            style={{ transition: 'transform 0.15s ease-out' }}
          >
            <path
              d="M 138,185 L 138,80 C 138,62 162,62 162,80 L 162,185 Z"
              fill="#1e293b"
              stroke={getFlexColor(sensors.index)}
              strokeWidth="2.5"
              filter="url(#neon)"
            />
            {/* Sensor track along finger */}
            <line x1="150" y1="180" x2="150" y2="78" stroke={getFlexColor(sensors.index)} strokeWidth="2.5" strokeDasharray="6 3" />
            <circle cx="150" cy="150" r="4" fill={getFlexColor(sensors.index)} />
            <circle cx="150" cy="115" r="4" fill={getFlexColor(sensors.index)} />
            <circle cx="150" cy="80" r="4" fill={getFlexColor(sensors.index)} />
            {/* Wiring */}
            <path d="M 150,185 L 175,235" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
          </g>

          {/* 3. MIDDLE FINGER (الوسطى) */}
          <g
            transform={`translate(187, 185) scale(1, ${getFingerCurvature(sensors.middle)}) translate(-187, -185)`}
            style={{ transition: 'transform 0.15s ease-out' }}
          >
            <path
              d="M 175,185 L 175,55 C 175,37 201,37 201,55 L 201,185 Z"
              fill="#1e293b"
              stroke={getFlexColor(sensors.middle)}
              strokeWidth="2.5"
              filter="url(#neon)"
            />
            <line x1="188" y1="180" x2="188" y2="53" stroke={getFlexColor(sensors.middle)} strokeWidth="2.5" strokeDasharray="6 3" />
            <circle cx="188" cy="145" r="4" fill={getFlexColor(sensors.middle)} />
            <circle cx="188" cy="105" r="4" fill={getFlexColor(sensors.middle)} />
            <circle cx="188" cy="55" r="4" fill={getFlexColor(sensors.middle)} />
            {/* Wiring */}
            <path d="M 188,185 L 195,235" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
          </g>

          {/* 4. RING FINGER (البنصر) */}
          <g
            transform={`translate(225, 185) scale(1, ${getFingerCurvature(sensors.ring)}) translate(-225, -185)`}
            style={{ transition: 'transform 0.15s ease-out' }}
          >
            <path
              d="M 213,185 L 213,72 C 213,54 237,54 237,72 L 237,185 Z"
              fill="#1e293b"
              stroke={getFlexColor(sensors.ring)}
              strokeWidth="2.5"
              filter="url(#neon)"
            />
            <line x1="225" y1="180" x2="225" y2="70" stroke={getFlexColor(sensors.ring)} strokeWidth="2.5" strokeDasharray="6 3" />
            <circle cx="225" cy="148" r="4" fill={getFlexColor(sensors.ring)} />
            <circle cx="225" cy="110" r="4" fill={getFlexColor(sensors.ring)} />
            <circle cx="225" cy="72" r="4" fill={getFlexColor(sensors.ring)} />
            {/* Wiring */}
            <path d="M 225,185 L 205,235" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
          </g>

          {/* 5. PINKY FINGER (الخنصر) */}
          <g
            transform={`translate(262, 195) scale(1, ${getFingerCurvature(sensors.pinky)}) translate(-262, -195)`}
            style={{ transition: 'transform 0.15s ease-out' }}
          >
            <path
              d="M 250,195 L 250,105 C 250,90 274,90 274,105 L 274,195 Z"
              fill="#1e293b"
              stroke={getFlexColor(sensors.pinky)}
              strokeWidth="2.5"
              filter="url(#neon)"
            />
            <line x1="262" y1="190" x2="262" y2="103" stroke={getFlexColor(sensors.pinky)} strokeWidth="2.5" strokeDasharray="6 3" />
            <circle cx="262" cy="165" r="4" fill={getFlexColor(sensors.pinky)} />
            <circle cx="262" cy="135" r="4" fill={getFlexColor(sensors.pinky)} />
            <circle cx="262" cy="105" r="4" fill={getFlexColor(sensors.pinky)} />
            {/* Wiring */}
            <path d="M 262,195 Q 240,225 220,245" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
          </g>

          {/* Touch Contact Sensor between Thumb and Index tip */}
          {touchContact && (
            <g>
              <line x1="75" y1="145" x2="145" y2="150" stroke="#f43f5e" strokeWidth="3" strokeDasharray="2 2" />
              <circle cx="110" cy="148" r="8" fill="#f43f5e" fillOpacity="0.4" />
              <circle cx="110" cy="148" r="4" fill="#f43f5e" />
              <text x="110" y="132" textAnchor="middle" fill="#fb7185" fontSize="9" fontWeight="bold">
                تلامس
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* 5 Finger Flex Percentages Bar */}
      <div className="grid grid-cols-5 gap-1.5 pt-2 border-t border-slate-800/80">
        {[
          { name: 'الإبهام', key: 'thumb', val: sensors.thumb },
          { name: 'السبابة', key: 'index', val: sensors.index },
          { name: 'الوسطى', key: 'middle', val: sensors.middle },
          { name: 'البنصر', key: 'ring', val: sensors.ring },
          { name: 'الخنصر', key: 'pinky', val: sensors.pinky },
        ].map((f) => (
          <div key={f.key} className="flex flex-col items-center bg-slate-900/90 border border-slate-800 rounded-lg p-1.5">
            <span className="text-[10px] text-slate-400 mb-0.5">{f.name}</span>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden my-1">
              <div
                className="h-full rounded-full transition-all duration-150"
                style={{
                  width: `${f.val}%`,
                  backgroundColor: getFlexColor(f.val)
                }}
              />
            </div>
            <span className="text-[11px] font-mono font-semibold text-slate-200">{Math.round(f.val)}%</span>
          </div>
        ))}
      </div>

      {/* Active Gesture indicator footer */}
      {activeGestureName && (
        <div className="mt-3 flex items-center justify-center gap-2 py-1.5 px-3 bg-cyan-950/60 border border-cyan-500/40 rounded-lg">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
          <span className="text-xs text-cyan-200 font-medium">
            تطابق وضعية: <strong className="text-white font-bold">{activeGestureName}</strong>
          </span>
        </div>
      )}
    </div>
  );
};
