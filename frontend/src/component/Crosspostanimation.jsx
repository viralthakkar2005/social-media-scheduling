import React from 'react';
import {
  SiX,
  SiInstagram,
  SiFacebook,
  SiTiktok,
} from 'react-icons/si';
import { FaLinkedin as SiLinkedin } from 'react-icons/fa6';
import { User, Repeat } from 'lucide-react';

/**
 * CrossPostAnimation (v2)
 * ------------------------
 * Same drop-in usage as before. Changes from v1:
 * - Curved fan-out connectors instead of straight lines (feels less like a wireframe)
 * - Radial glow anchored behind the hub for a focal point
 * - Bigger, punchier hub with a slow-rotating dashed "sync" ring
 * - Platform nodes are larger, have real depth (layered shadow), and drift in with a
 *   slight overshoot + settle instead of a flat pop
 * - Traveling dots now follow the curve and fade smoothly at both ends
 * - Card has a subtle inner border + vignette so it doesn't look like flat gray paper
 */

const PLATFORMS = [
  { key: 'facebook', bg: 'bg-blue-500', Icon: SiFacebook, top: '6%' },
  { key: 'instagram', bg: 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500', Icon: SiInstagram, top: '28%' },
  { key: 'x', bg: 'bg-black', Icon: SiX, top: '50%' },
  { key: 'linkedin', bg: 'bg-blue-600', Icon: SiLinkedin, top: '72%' },
  { key: 'tiktok', bg: 'bg-black', Icon: SiTiktok, top: '94%' },
];

const HUB = { x: 40, y: 50 };
const USER = { x: 8, y: 50 };

export default function CrossPostAnimation() {
  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-slate-50 via-white to-slate-100 p-8 max-w-lg w-full mx-auto border border-gray-200/70 aspect-square shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">

      {/* radial glow anchored behind the hub */}
      <div
        className="absolute rounded-full bg-post-green/15 blur-2xl pointer-events-none"
        style={{ left: '30%', top: '40%', width: '30%', height: '30%' }}
      />

      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full p-8"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* user -> hub */}
        <Connector x1={USER.x} y1={USER.y} x2={HUB.x} y2={HUB.y} delay={0} />
        {/* hub -> each platform, curved fan-out */}
        {PLATFORMS.map((p, i) => (
          <Connector key={p.key} x1={HUB.x} y1={HUB.y} x2={88} y2={parseFloat(p.top)} delay={0.15 + i * 0.12} />
        ))}
      </svg>

      {/* user node */}
      <NodeHtml style={{ left: `${USER.x - 2}%`, top: `${USER.y}%` }} delay={0} size={9}>
        <User className="h-4 w-4 text-gray-500" strokeWidth={2} />
      </NodeHtml>

      {/* hub node, with rotating sync ring */}
      <div
        className="absolute rounded-full border border-dashed border-post-green/40 pointer-events-none"
        style={{
          left: `${HUB.x}%`,
          top: `${HUB.y}%`,
          width: '15%',
          height: '15%',
          transform: 'translate(-50%, -50%)',
          animation: 'spin 8s linear infinite',
        }}
      />
      <NodeHtml style={{ left: `${HUB.x}%`, top: `${HUB.y}%` }} delay={0.1} pulse bg="bg-white" size={12} ring>
        <Repeat className="h-5 w-5 text-navy" strokeWidth={2.2} />
      </NodeHtml>

      {/* platform nodes */}
      {PLATFORMS.map((p, i) => (
        <NodeHtml key={p.key} style={{ left: '85%', top: p.top }} delay={0.4 + i * 0.12} bg={p.bg} size={10}>
          <p.Icon className="h-4 w-4 text-white" />
        </NodeHtml>
      ))}

      <style>{`
        @keyframes popIn {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.3); }
          65% { opacity: 1; transform: translate(-50%, -50%) scale(1.12); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes hubPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(76,175,109,0.25); }
          50% { box-shadow: 0 0 0 10px rgba(76,175,109,0); }
        }
        @keyframes dashFlow {
          to { stroke-dashoffset: -10; }
        }
        @keyframes drawLine {
          from { stroke-dashoffset: var(--len); }
          to { stroke-dashoffset: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function Connector({ x1, y1, x2, y2, delay }) {
  // curved fan-out: pull the control point toward the hub's x so lines
  // leave the hub tightly together and bow outward toward each platform
  const cx = x1 + (x2 - x1) * 0.55;
  const path = `M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`;
  // approximate curve length for the draw-in animation
  const length = Math.hypot(x2 - x1, y2 - y1) * 1.08;

  return (
    <g>
      <path
        d={path}
        fill="none"
        stroke="#d7d9d4" strokeWidth="0.5" strokeLinecap="round"
        style={{
          '--len': length,
          strokeDasharray: length,
          strokeDashoffset: length,
          animation: 'drawLine 0.7s ease-out forwards',
          animationDelay: `${delay}s`,
        }}
      />
      <path
        d={path}
        fill="none"
        stroke="#8fdba0" strokeWidth="0.6" strokeLinecap="round"
        strokeDasharray="1.6 7" opacity="0"
        style={{
          animation: 'dashFlow 1.3s linear infinite, fadeIn 0.4s ease-out forwards',
          animationDelay: `${delay + 0.7}s, ${delay + 0.7}s`,
        }}
      />
      <circle r="1.1" fill="#4CAF6D" opacity="0">
        <animateMotion path={path} dur="1.6s" begin={`${delay + 0.7}s`} repeatCount="indefinite" />
        <animate
          attributeName="opacity"
          values="0;1;1;0"
          keyTimes="0;0.12;0.85;1"
          dur="1.6s"
          begin={`${delay + 0.7}s`}
          repeatCount="indefinite"
        />
      </circle>
    </g>
  );
}

function NodeHtml({ style, delay, children, bg = 'bg-white', pulse = false, size = 10, ring = false }) {
  return (
    <div
      className={`absolute flex items-center justify-center rounded-full ${bg} shadow-[0_4px_14px_rgba(15,23,42,0.14)] ${ring ? 'ring-2 ring-post-green/30' : 'ring-1 ring-black/5'}`}
      style={{
        ...style,
        width: `${size * 4}px`,
        height: `${size * 4}px`,
        opacity: 0,
        animation: `popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards${pulse ? ', hubPulse 2.6s ease-in-out infinite' : ''}`,
        animationDelay: pulse ? `${delay}s, ${delay + 0.7}s` : `${delay}s`,
      }}
    >
      {children}
    </div>
  );
}