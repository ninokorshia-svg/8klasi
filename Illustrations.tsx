import React from 'react';
import { RawQuestion } from '../types';

interface IllustrationProps {
  type: RawQuestion['illustrationType'];
  className?: string;
}

export const PhysicsIllustration: React.FC<IllustrationProps> = ({ type, className = '' }) => {
  return (
    <div className={`relative w-full aspect-video sm:aspect-[21/9] max-h-52 rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-50 flex items-center justify-center p-2 select-none ${className}`}>
      {type === 'kinetic_motion' && <KineticMotionIllustration />}
      {type === 'natural_light' && <NaturalLightIllustration />}
      {type === 'stretched_bow' && <StretchedBowIllustration />}
      {type === 'coal_energy' && <CoalEnergyIllustration />}
      {type === 'battery_chemistry' && <BatteryChemistryIllustration />}
      {type === 'wind_turbine' && <WindTurbineIllustration />}
      {type === 'solar_panels' && <SolarPanelsIllustration />}
      {type === 'fossil_fuels' && <FossilFuelsIllustration />}
      {type === 'hydro_dam' && <HydroDamIllustration />}
      {type === 'greenhouse_effect' && <GreenhouseEffectIllustration />}
      {type === 'thermal_power' && <ThermalPowerIllustration />}
      {type === 'energy_chain' && <EnergyChainIllustration />}
    </div>
  );
};

/* 1. Kinetic Motion (Moving book to shelf - completely neutral, no green book) */
function KineticMotionIllustration() {
  return (
    <svg viewBox="0 0 420 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="420" height="180" fill="#F8FAFC" rx="12" />
      <line x1="20" y1="150" x2="400" y2="150" stroke="#CBD5E1" strokeWidth="3" />
      
      {/* Bookshelf */}
      <rect x="250" y="30" width="14" height="120" fill="#78350F" rx="3" />
      <rect x="370" y="30" width="14" height="120" fill="#78350F" rx="3" />
      <rect x="240" y="55" width="150" height="10" fill="#92400E" rx="2" />
      <rect x="240" y="105" width="150" height="10" fill="#92400E" rx="2" />

      {/* Books on lower shelf (neutral blue, amber, slate - NO green) */}
      <rect x="270" y="70" width="16" height="35" fill="#3B82F6" rx="2" />
      <rect x="288" y="75" width="14" height="30" fill="#EF4444" rx="2" />
      <rect x="304" y="68" width="18" height="37" fill="#64748B" rx="2" />

      {/* Table on left */}
      <rect x="40" y="115" width="100" height="10" fill="#D97706" rx="2" />
      <rect x="50" y="125" width="8" height="25" fill="#B45309" />
      <rect x="122" y="125" width="8" height="25" fill="#B45309" />

      {/* Motion trajectory arc */}
      <path d="M 90 110 Q 170 20 270 45" stroke="#F59E0B" strokeWidth="3" strokeDasharray="6 4" />

      {/* Moving Book */}
      <g transform="translate(175, 42) rotate(18)">
        <rect x="-15" y="-22" width="30" height="44" fill="#6366F1" rx="4" stroke="#4338CA" strokeWidth="2" />
        <rect x="-12" y="-18" width="24" height="36" fill="#818CF8" rx="2" />
        <line x1="-10" y1="-8" x2="8" y2="-8" stroke="#E0E7FF" strokeWidth="2" />
        <line x1="-10" y1="0" x2="6" y2="0" stroke="#E0E7FF" strokeWidth="2" />
        <path d="M -22 -10 L -32 -14 M -24 0 L -36 0 M -22 10 L -32 14" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Hand lifting book */}
      <path d="M 160 85 Q 175 65 185 60 Q 192 68 185 80 Z" fill="#FBBF24" opacity="0.8" />
    </svg>
  );
}

/* 2. Natural vs Artificial Light (Firefly & Bulb - both warm golden light, NO green glow) */
function NaturalLightIllustration() {
  return (
    <svg viewBox="0 0 420 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="420" height="180" fill="#0F172A" rx="12" />
      
      {/* Stars */}
      <circle cx="40" cy="30" r="1.5" fill="#FEF08A" />
      <circle cx="120" cy="20" r="2" fill="#FEF08A" />
      <circle cx="80" cy="65" r="1" fill="#FEF08A" />
      <circle cx="210" cy="25" r="1.5" fill="#FEF08A" />

      {/* Moon */}
      <circle cx="65" cy="45" r="18" fill="#FEF08A" />
      <circle cx="72" cy="40" r="16" fill="#0F172A" />

      {/* Left side: Firefly (warm amber glow, NO green) */}
      <g transform="translate(115, 95)">
        <circle cx="0" cy="0" r="40" fill="#F59E0B" opacity="0.25" />
        <circle cx="0" cy="0" r="22" fill="#FBBF24" opacity="0.45" />
        <ellipse cx="-8" cy="-5" rx="12" ry="7" fill="#475569" transform="rotate(-20)" />
        <ellipse cx="8" cy="-4" rx="12" ry="7" fill="#475569" transform="rotate(20)" />
        <ellipse cx="0" cy="0" r="9" fill="#1E293B" />
        <ellipse cx="0" cy="10" rx="8" ry="12" fill="#FDE047" />
        <circle cx="0" cy="12" r="5" fill="#FFFFFF" />
        <ellipse cx="-12" cy="-14" rx="7" ry="16" fill="#F8FAFC" opacity="0.6" transform="rotate(-30)" />
        <ellipse cx="12" cy="-14" rx="7" ry="16" fill="#F8FAFC" opacity="0.6" transform="rotate(30)" />
        <path d="M -4 -8 Q -10 -18 -16 -20 M 4 -8 Q 10 -18 16 -20" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Divider */}
      <line x1="220" y1="20" x2="220" y2="160" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />

      {/* Right side: Light Bulb (same warm amber glow) */}
      <g transform="translate(320, 85)">
        <circle cx="0" cy="0" r="40" fill="#FBBF24" opacity="0.2" />
        <line x1="0" y1="-55" x2="0" y2="-20" stroke="#64748B" strokeWidth="2" />
        <rect x="-8" y="-20" width="16" height="12" fill="#94A3B8" rx="2" />
        <path d="M -16 -8 C -24 10 -14 26 0 28 C 14 26 24 10 16 -8 Z" fill="#FEF08A" opacity="0.85" stroke="#F59E0B" strokeWidth="1.5" />
        <path d="M -6 -4 L -3 10 L 0 5 L 3 10 L 6 -4" stroke="#DC2626" strokeWidth="1.5" fill="none" />
      </g>
    </svg>
  );
}

/* 3. Stretched Bow (Clean, no colored hints) */
function StretchedBowIllustration() {
  return (
    <svg viewBox="0 0 420 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="420" height="180" fill="#FEF3C7" rx="12" />
      
      {/* Target */}
      <g transform="translate(360, 90)">
        <ellipse cx="0" cy="0" rx="12" ry="45" fill="#EF4444" />
        <ellipse cx="0" cy="0" rx="9" ry="34" fill="#FFFFFF" />
        <ellipse cx="0" cy="0" rx="6" ry="22" fill="#EF4444" />
        <ellipse cx="0" cy="0" rx="3" ry="10" fill="#FBBF24" />
      </g>

      {/* Stretched Bow */}
      <g transform="translate(130, 90)">
        <path d="M 40 -65 Q -10 0 40 65" stroke="#78350F" strokeWidth="8" strokeLinecap="round" fill="none" />
        <path d="M 40 -65 Q -10 0 40 65" stroke="#B45309" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M 40 -65 L -35 0 L 40 65" stroke="#0284C7" strokeWidth="2.5" fill="none" />

        <line x1="-35" y1="0" x2="110" y2="0" stroke="#1E293B" strokeWidth="3.5" />
        <polygon points="110,-5 125,0 110,5" fill="#475569" />
        <polygon points="-30,-7 -18,-2 -25,0" fill="#DC2626" />
        <polygon points="-30,7 -18,2 -25,0" fill="#DC2626" />

        <path d="M -10 -25 Q -25 -10 -25 0 Q -25 10 -10 25" stroke="#E11D48" strokeWidth="2.5" strokeDasharray="3 3" fill="none" />
      </g>
    </svg>
  );
}

/* 4. Coal & Fire */
function CoalEnergyIllustration() {
  return (
    <svg viewBox="0 0 420 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="420" height="180" fill="#FFF7ED" rx="12" />

      {/* Coal chunk */}
      <g transform="translate(110, 95)">
        <polygon points="-50,15 -35,-30 0,-45 45,-25 60,10 35,35 -25,38" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
        <polygon points="-25,-20 5,-35 30,-15 15,10 -15,15" fill="#334155" />
        <polygon points="5,10 35,10 25,30 -5,25" fill="#475569" />
      </g>

      <g transform="translate(205, 95)">
        <line x1="-15" y1="0" x2="25" y2="0" stroke="#EA580C" strokeWidth="4" />
        <polygon points="25,-8 40,0 25,8" fill="#EA580C" />
      </g>

      <g transform="translate(310, 95)">
        <path d="M 0 35 C -30 25 -40 -15 -20 -40 C -15 -15 0 -25 5 -45 C 20 -20 35 -10 35 15 C 35 35 15 35 0 35 Z" fill="#F97316" />
        <path d="M 0 30 C -18 20 -20 -5 -10 -25 C -5 -5 5 -15 8 -25 C 18 -10 20 0 20 15 C 20 30 10 30 0 30 Z" fill="#FACC15" />
        <circle cx="2" cy="10" r="8" fill="#FFFFFF" />
      </g>
    </svg>
  );
}

/* 5. Battery & Circuit (Neutral blue energy, NO green fill) */
function BatteryChemistryIllustration() {
  return (
    <svg viewBox="0 0 420 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="420" height="180" fill="#F8FAFC" rx="12" />

      <path d="M 175 60 L 175 35 L 290 35 L 290 65" stroke="#0284C7" strokeWidth="3" fill="none" />
      <path d="M 290 105 L 290 135 L 105 135 L 105 110" stroke="#0284C7" strokeWidth="3" fill="none" />

      <circle cx="230" cy="35" r="4" fill="#38BDF8" />

      {/* Battery (neutral blue/amber, NO green) */}
      <g transform="translate(85, 55)">
        <rect x="0" y="0" width="80" height="55" rx="6" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
        <rect x="80" y="18" width="8" height="18" rx="2" fill="#94A3B8" />
        <rect x="8" y="8" width="48" height="39" rx="3" fill="#38BDF8" />
        <text x="32" y="32" fill="#FFFFFF" fontSize="14" fontWeight="900" textAnchor="middle">⚡</text>
        <text x="68" y="32" fill="#EF4444" fontSize="14" fontWeight="800">+</text>
        <text x="-4" y="32" fill="#38BDF8" fontSize="14" fontWeight="800">-</text>
      </g>

      <g transform="translate(290, 85)">
        <circle cx="0" cy="0" r="30" fill="#FDE047" opacity="0.4" />
        <circle cx="0" cy="0" r="16" fill="#FEF08A" stroke="#EAB308" strokeWidth="2" />
        <rect x="-6" y="14" width="12" height="10" fill="#64748B" rx="1" />
        <path d="M -4 4 L 0 -4 L 4 4" stroke="#DC2626" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

/* 6. Wind Turbine (Clean, no text) */
function WindTurbineIllustration() {
  return (
    <svg viewBox="0 0 420 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="420" height="180" fill="#E0F2FE" rx="12" />
      <path d="M 0 150 Q 120 125 240 145 Q 340 130 420 155 L 420 180 L 0 180 Z" fill="#94A3B8" opacity="0.4" />
      <path d="M 0 160 Q 150 145 300 160 L 420 160 L 420 180 L 0 180 Z" fill="#64748B" opacity="0.5" />

      <path d="M 20 50 Q 80 40 140 55" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
      <path d="M 35 70 Q 95 60 155 75" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 15 90 Q 75 80 135 95" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />

      {/* Turbine */}
      <g transform="translate(210, 115)">
        <polygon points="-5,45 -3,-35 3,-35 5,45" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1" />
        <ellipse cx="0" cy="-35" rx="7" ry="5" fill="#E2E8F0" stroke="#64748B" strokeWidth="1" />
        <circle cx="0" cy="-35" r="4" fill="#0284C7" />
        <g transform="translate(0, -35)">
          <path d="M 0 0 C -4 -25 -2 -50 0 -55 C 2 -50 4 -25 0 0" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
          <path d="M 0 0 C -4 -25 -2 -50 0 -55 C 2 -50 4 -25 0 0" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" transform="rotate(120)" />
          <path d="M 0 0 C -4 -25 -2 -50 0 -55 C 2 -50 4 -25 0 0" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" transform="rotate(240)" />
        </g>
      </g>

      <g transform="translate(330, 120)">
        <line x1="0" y1="40" x2="0" y2="0" stroke="#475569" strokeWidth="3" />
        <line x1="-15" y1="10" x2="15" y2="10" stroke="#475569" strokeWidth="2.5" />
        <path d="M -120 -5 Q -40 20 0 10" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 3" />
      </g>
    </svg>
  );
}

/* 7. Solar Panels (Clean, neutral cables) */
function SolarPanelsIllustration() {
  return (
    <svg viewBox="0 0 420 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="420" height="180" fill="#FEF9C3" rx="12" />

      {/* Sun */}
      <g transform="translate(70, 50)">
        <circle cx="0" cy="0" r="28" fill="#F59E0B" />
        <circle cx="0" cy="0" r="22" fill="#FBBF24" />
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={i}
            x1="0"
            y1="0"
            x2="0"
            y2="-38"
            stroke="#F59E0B"
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${i * 45})`}
          />
        ))}
      </g>

      <path d="M 105 60 L 220 95" stroke="#F59E0B" strokeWidth="3" strokeDasharray="5 3" />
      <path d="M 100 75 L 210 115" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="5 3" />

      {/* Panel */}
      <g transform="translate(250, 105)">
        <polygon points="-40,40 -20,10 -15,10 -35,40" fill="#64748B" />
        <polygon points="40,40 20,10 25,10 45,40" fill="#64748B" />
        <polygon points="-75,-25 45,-25 75,25 -45,25" fill="#1E3A8A" stroke="#0F172A" strokeWidth="2.5" />
        <line x1="-35" y1="-25" x2="-5" y2="25" stroke="#93C5FD" strokeWidth="1.5" />
        <line x1="5" y1="-25" x2="35" y2="25" stroke="#93C5FD" strokeWidth="1.5" />
        <line x1="-60" y1="0" x2="60" y2="0" stroke="#93C5FD" strokeWidth="1.5" />
      </g>

      {/* Neutral cable (no green) */}
      <path d="M 320 130 Q 350 145 375 135" stroke="#475569" strokeWidth="3" />
      <g transform="translate(375, 125)">
        <polygon points="0,-18 16,-4 16,15 -16,15 -16,-4" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
        <rect x="-4" y="2" width="8" height="13" fill="#FEF08A" />
      </g>
    </svg>
  );
}

/* 8. Fossil Fuels vs Wood / Biomass - COMPLETELY NEUTRAL, NO RED VS GREEN BOXES! */
function FossilFuelsIllustration() {
  return (
    <svg viewBox="0 0 420 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="420" height="180" fill="#F8FAFC" rx="12" />

      {/* Neutral single frame for all items - NO red and NO green boxes! */}
      <rect x="20" y="20" width="380" height="140" rx="10" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />

      {/* Oil barrel */}
      <g transform="translate(70, 90)">
        <rect x="-16" y="-24" width="32" height="48" rx="4" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
        <line x1="-16" y1="-8" x2="16" y2="-8" stroke="#64748B" strokeWidth="1.5" />
        <line x1="-16" y1="8" x2="16" y2="8" stroke="#64748B" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="5" fill="#F59E0B" />
      </g>

      {/* Coal */}
      <g transform="translate(150, 90)">
        <polygon points="-20,12 -12,-18 14,-22 22,10 8,22 -12,20" fill="#334155" stroke="#1E293B" strokeWidth="2" />
      </g>

      {/* Gas Flame */}
      <g transform="translate(230, 90)">
        <path d="M 0 18 C -12 12 -14 -6 -7 -22 C -2 -10 5 -15 7 -25 C 16 -10 14 6 0 18 Z" fill="#0284C7" />
        <circle cx="0" cy="6" r="5" fill="#38BDF8" />
      </g>

      {/* Divider */}
      <line x1="285" y1="35" x2="285" y2="145" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 4" />

      {/* Tree / Wood logs (neutral timber/biomass, NO green answer hints) */}
      <g transform="translate(345, 90)">
        <polygon points="0,-40 22,-15 12,-15 28,10 -28,10 -12,-15 -22,-15" fill="#854D0E" />
        <rect x="-4" y="10" width="8" height="15" fill="#78350F" />
        <ellipse cx="25" cy="18" rx="8" ry="6" fill="#D97706" stroke="#92400E" strokeWidth="1" />
        <ellipse cx="25" cy="18" rx="5" ry="3" fill="#FDE68A" />
      </g>
    </svg>
  );
}

/* 9. Hydroelectric Dam (Clean, no text) */
function HydroDamIllustration() {
  return (
    <svg viewBox="0 0 420 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="420" height="180" fill="#E0F2FE" rx="12" />

      {/* Water Reservoir */}
      <path d="M 0 35 L 140 35 L 140 180 L 0 180 Z" fill="#0284C7" />

      {/* Dam */}
      <polygon points="140,35 190,70 190,180 140,180" fill="#64748B" stroke="#475569" strokeWidth="2" />

      {/* Pipe */}
      <path d="M 140 100 L 230 145" stroke="#334155" strokeWidth="16" strokeLinecap="round" />
      <path d="M 140 100 L 230 145" stroke="#38BDF8" strokeWidth="8" strokeLinecap="round" strokeDasharray="6 4" />

      {/* Turbine */}
      <rect x="220" y="125" width="45" height="40" fill="#E2E8F0" stroke="#475569" strokeWidth="2" rx="4" />
      <circle cx="242" cy="145" r="10" fill="#F59E0B" />
      <text x="242" y="149" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="900">⚙️</text>

      {/* River */}
      <path d="M 265 155 Q 340 150 420 160 L 420 180 L 265 180 Z" fill="#38BDF8" />

      <path d="M 255 125 L 340 60" stroke="#E11D48" strokeWidth="2.5" strokeDasharray="4 2" />
      <g transform="translate(355, 60)">
        <polygon points="0,-25 10,0 -10,0" fill="#475569" />
        <line x1="0" y1="0" x2="0" y2="30" stroke="#475569" strokeWidth="3" />
      </g>
    </svg>
  );
}

/* 10. Greenhouse Effect (Clean) */
function GreenhouseEffectIllustration() {
  return (
    <svg viewBox="0 0 420 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="420" height="180" fill="#0B132B" rx="12" />

      <g transform="translate(50, 45)">
        <circle cx="0" cy="0" r="22" fill="#F59E0B" />
        <circle cx="0" cy="0" r="16" fill="#FBBF24" />
      </g>

      <path d="M 72 45 L 210 100" stroke="#FBBF24" strokeWidth="3.5" />
      <polygon points="210,100 200,92 208,86" fill="#FBBF24" />

      <path d="M 80 180 Q 220 100 360 180 Z" fill="#334155" />
      <path d="M 140 180 Q 220 120 300 180 Z" fill="#0284C7" />

      <path d="M 70 170 Q 220 70 370 170" stroke="#EA580C" strokeWidth="10" strokeLinecap="round" opacity="0.45" fill="none" />
      <path d="M 70 170 Q 220 70 370 170" stroke="#EF4444" strokeWidth="2" strokeDasharray="5 5" fill="none" />

      <path d="M 220 115 Q 260 85 280 110 Q 300 135 320 115" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" fill="none" />
      <polygon points="320,115 315,123 310,117" fill="#EF4444" />
    </svg>
  );
}

/* 11. Thermal Power Plant */
function ThermalPowerIllustration() {
  return (
    <svg viewBox="0 0 420 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="420" height="180" fill="#FEF2F2" rx="12" />
      <rect x="0" y="145" width="420" height="35" fill="#475569" />

      <rect x="60" y="90" width="90" height="55" fill="#64748B" rx="3" />
      <rect x="80" y="105" width="20" height="25" fill="#F87171" opacity="0.4" />

      <polygon points="170,145 175,45 195,45 200,145" fill="#94A3B8" stroke="#64748B" strokeWidth="2" />
      <rect x="176" y="55" width="18" height="12" fill="#EF4444" />
      <rect x="177" y="80" width="17" height="12" fill="#EF4444" />

      <g transform="translate(185, 30)">
        <circle cx="5" cy="-5" r="14" fill="#64748B" opacity="0.65" />
        <circle cx="25" cy="-12" r="18" fill="#475569" opacity="0.75" />
        <circle cx="55" cy="-15" r="24" fill="#334155" opacity="0.8" />
      </g>

      <path d="M 280 145 Q 295 105 292 80 L 328 80 Q 325 105 340 145 Z" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="2" />
      <ellipse cx="310" cy="80" rx="18" ry="4" fill="#E2E8F0" />
      <path d="M 310 75 Q 315 50 330 40" stroke="#E2E8F0" strokeWidth="8" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

/* 12. Energy Chain (Neutral blue cycle, NO green) */
function EnergyChainIllustration() {
  return (
    <svg viewBox="0 0 420 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="420" height="180" fill="#F8FAFC" rx="12" />

      {/* Blue circular flow line */}
      <circle cx="210" cy="90" r="55" stroke="#0284C7" strokeWidth="3" strokeDasharray="6 4" fill="none" />

      {/* Sun */}
      <g transform="translate(210, 35)">
        <circle cx="0" cy="0" r="16" fill="#F59E0B" />
        <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="12">☀️</text>
      </g>

      {/* Wind */}
      <g transform="translate(265, 90)">
        <circle cx="0" cy="0" r="16" fill="#0284C7" />
        <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="12">💨</text>
      </g>

      {/* Water */}
      <g transform="translate(210, 145)">
        <circle cx="0" cy="0" r="16" fill="#3B82F6" />
        <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="12">💧</text>
      </g>

      {/* Plant */}
      <g transform="translate(155, 90)">
        <circle cx="0" cy="0" r="16" fill="#64748B" />
        <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="12">🌱</text>
      </g>

      {/* Center symbol */}
      <g transform="translate(210, 90)">
        <circle cx="0" cy="0" r="20" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
        <text x="0" y="5" textAnchor="middle" fill="#0284C7" fontSize="16" fontWeight="900">∞</text>
      </g>
    </svg>
  );
}
