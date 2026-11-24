import React, { useEffect, useMemo, useRef } from 'react';
import { RotateCw } from 'lucide-react';
import { PASTEL_THEMES, type ActivityItem } from '../data/activities';
import { soundEngine } from '../utils/sound';

interface SpinnerWheelProps {
  activities: ActivityItem[];
  isSpinning: boolean;
  onSpinStart: () => void;
  onSpinComplete: (activity: ActivityItem) => void;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeSlicePath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return [
    'M', cx, cy,
    'L', start.x, start.y,
    'A', r, r, 0, largeArcFlag, 0, end.x, end.y,
    'Z',
  ].join(' ');
}

export const SpinnerWheel: React.FC<SpinnerWheelProps> = ({
  activities,
  isSpinning,
  onSpinStart,
  onSpinComplete,
}) => {
  const wheelRef = useRef<HTMLDivElement | null>(null);
  const pointerRef = useRef<HTMLDivElement | null>(null);
  const currentRotationRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const clapperTimeoutRef = useRef<number | null>(null);

  // Keep wheel clean and legible on mobile (max 10 slices at a time)
  const wheelSlices = useMemo(() => {
    if (activities.length <= 10) return activities;
    return activities.slice(0, 10);
  }, [activities]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (clapperTimeoutRef.current) window.clearTimeout(clapperTimeoutRef.current);
    };
  }, []);

  const handleSpin = () => {
    if (isSpinning || wheelSlices.length === 0) return;

    onSpinStart();

    const sliceCount = wheelSlices.length;
    const sliceDeg = 360 / sliceCount;
    const targetIdx = Math.floor(Math.random() * sliceCount);
    const winner = wheelSlices[targetIdx];

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const startRotation = currentRotationRef.current;

    // Slice i center starts at i * sliceDeg clockwise from 12 o'clock.
    // Rotating clockwise by (360 - targetIdx * sliceDeg) brings slice targetIdx to 12 o'clock.
    const desiredMod = ((360 - targetIdx * sliceDeg) % 360 + 360) % 360;
    const currentMod = ((startRotation % 360) + 360) % 360;
    let deltaMod = desiredMod - currentMod;
    if (deltaMod <= 0) deltaMod += 360;

    const jitter = (Math.random() - 0.5) * sliceDeg * 0.42;
    const extraSpins = prefersReducedMotion ? 0 : (4 + Math.floor(Math.random() * 2)) * 360;
    const totalDelta = extraSpins + deltaMod + jitter;
    const endRotation = startRotation + totalDelta;

    if (prefersReducedMotion) {
      currentRotationRef.current = endRotation;
      if (wheelRef.current) {
        wheelRef.current.style.transform = `rotate(${endRotation}deg)`;
      }
      soundEngine.playWinFanfare();
      onSpinComplete(winner);
      return;
    }

    const duration = 3200;
    const startTime = performance.now();
    let lastSliceCrossing = Math.floor((startRotation + sliceDeg / 2) / sliceDeg);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // Smooth quintic ease-out for realistic physical deceleration
      const eased = 1 - Math.pow(1 - t, 4.2);
      const currentRot = startRotation + totalDelta * eased;

      currentRotationRef.current = currentRot;
      if (wheelRef.current) {
        wheelRef.current.style.transform = `rotate(${currentRot}deg)`;
      }

      const crossing = Math.floor((currentRot + sliceDeg / 2) / sliceDeg);
      if (crossing !== lastSliceCrossing) {
        lastSliceCrossing = crossing;
        soundEngine.playTick(1 + (1 - t) * 0.18);

        if (pointerRef.current) {
          pointerRef.current.style.transform = 'translateX(-50%) rotate(-18deg)';
          if (clapperTimeoutRef.current) window.clearTimeout(clapperTimeoutRef.current);
          clapperTimeoutRef.current = window.setTimeout(() => {
            if (pointerRef.current) {
              pointerRef.current.style.transform = 'translateX(-50%) rotate(0deg)';
            }
          }, 70);
        }
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        rafRef.current = null;
        soundEngine.playWinFanfare();
        onSpinComplete(winner);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  };

  const count = Math.max(1, wheelSlices.length);
  const sliceDeg = 360 / count;
  const cx = 180;
  const cy = 180;
  const radius = 152;

  return (
    <div className="flex flex-col items-center w-full">
      {/* Large Focal Wheel Stage */}
      <div className="relative flex items-center justify-center select-none pt-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-4 rounded-full bg-amber-200/35 blur-3xl"
        />

        {/* Top Pointer Clapper */}
        <div
          ref={pointerRef}
          aria-hidden="true"
          style={{
            transform: 'translateX(-50%) rotate(0deg)',
            transition: 'transform 90ms cubic-bezier(0.22, 1, 0.36, 1)',
            transformOrigin: '50% 6px',
          }}
          className="absolute top-0 left-1/2 z-20 drop-shadow-sm"
        >
          <svg width="42" height="48" viewBox="0 0 38 44" fill="none">
            <path
              d="M19 41 L5 13 C3.5 9.5 6 4 10.5 4 L27.5 4 C32 4 34.5 9.5 33 13 Z"
              fill="#F97316"
              stroke="#1E293B"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <circle cx="19" cy="12" r="3.5" fill="#FFF7ED" />
          </svg>
        </div>

        {/* Interactive Wheel Container */}
        <button
          type="button"
          onClick={handleSpin}
          disabled={isSpinning || wheelSlices.length === 0}
          aria-label={isSpinning ? 'Wheel is spinning' : 'Tap to spin the activity wheel'}
          className="group relative rounded-full p-1.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/70 active:scale-[0.985] transition-transform duration-150 cursor-pointer disabled:cursor-wait"
        >
          <div className="relative w-[304px] h-[304px] sm:w-[390px] sm:h-[390px] lg:w-[432px] lg:h-[432px] rounded-full bg-white shadow-[0_22px_44px_-16px_rgba(180,120,40,0.26)] ring-4 ring-slate-800/90 overflow-hidden">
            {/* Rotating SVG Layer (GPU transform only) */}
            <div
              ref={wheelRef}
              className="w-full h-full will-change-transform"
              style={{ transform: 'rotate(0deg)' }}
            >
              <svg viewBox="0 0 360 360" className="w-full h-full">
                {/* Outer warm rim */}
                <circle cx={cx} cy={cy} r={176} fill="#FFFDF8" />

                {/* Activity Wedges */}
                {wheelSlices.map((item, idx) => {
                  const startAngle = idx * sliceDeg - sliceDeg / 2 - 90;
                  const endAngle = startAngle + sliceDeg;
                  const midAngle = startAngle + sliceDeg / 2;
                  const theme = PASTEL_THEMES[item.colorKey];
                  const pegPos = polarToCartesian(cx, cy, 164, startAngle);

                  const labelRadius = count <= 6 ? 98 : 104;
                  const labelPos = polarToCartesian(cx, cy, labelRadius, midAngle);

                  return (
                    <g key={item.id}>
                      <path
                        d={describeSlicePath(cx, cy, radius, startAngle, endAngle)}
                        fill={theme.slice}
                        stroke="#FFFFFF"
                        strokeWidth="2.5"
                      />
                      {/* Rim peg dot */}
                      <circle
                        cx={pegPos.x}
                        cy={pegPos.y}
                        r="4.5"
                        fill={theme.sliceStroke}
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                      />
                      {/* Radial slice label */}
                      <text
                        x={labelPos.x}
                        y={labelPos.y}
                        fill="#1E293B"
                        fontSize={count >= 9 ? '10.5' : '11.5'}
                        fontWeight="700"
                        fontFamily="Outfit, ui-rounded, sans-serif"
                        textAnchor="middle"
                        dominantBaseline="central"
                        transform={`rotate(${midAngle + 90}, ${labelPos.x}, ${labelPos.y})`}
                      >
                        {item.shortLabel.length > 13
                          ? `${item.shortLabel.slice(0, 12)}…`
                          : item.shortLabel}
                      </text>
                    </g>
                  );
                })}

                {/* Inner rim accent circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="none"
                  stroke="#1E293B"
                  strokeWidth="2.5"
                  strokeOpacity="0.14"
                />
              </svg>
            </div>

            {/* Center Tap Hub */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div
                className={`flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white border-4 border-slate-800 shadow-[inset_0_2px_0_rgba(255,255,255,0.9),0_4px_12px_rgba(30,41,59,0.14)] transition-transform duration-150 ${
                  isSpinning ? 'scale-95' : 'group-hover:scale-105'
                }`}
              >
                <RotateCw
                  className={`w-6 h-6 sm:w-7 sm:h-7 text-orange-500 ${isSpinning ? 'animate-spin' : ''}`}
                  strokeWidth={2.5}
                />
                <span className="font-display text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight mt-0.5">
                  {isSpinning ? '...' : 'SPIN'}
                </span>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Big Tactile Thumb-Zone Spin Button */}
      <button
        type="button"
        onClick={handleSpin}
        disabled={isSpinning || wheelSlices.length === 0}
        className="mt-6 w-full max-w-[280px] inline-flex items-center justify-center gap-2.5 min-h-[56px] px-8 py-3 rounded-full bg-slate-900 text-white font-display font-extrabold text-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_6px_0_0_rgba(15,23,42,0.22)] hover:bg-slate-800 active:translate-y-0.5 active:shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_2px_0_0_rgba(15,23,42,0.22)] transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-wait focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/70 whitespace-nowrap shrink-0"
      >
        <RotateCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} strokeWidth={2.6} />
        <span>{isSpinning ? 'Spinning...' : 'Spin!'}</span>
      </button>
    </div>
  );
};
