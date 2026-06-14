import { Circle, Path, Svg } from 'react-native-svg';

type Props = {
  size?: number;
  variant?: 'dark' | 'light' | 'mono';
};

const WEDGE_COUNT = 6;
const R_INNER = 14;
const R_OUTER = 34;
const WEDGE_FRACTION = 0.42;

function makeWedgePath(index: number): string {
  const cx = 50;
  const cy = 50;
  const sector = (2 * Math.PI) / WEDGE_COUNT;
  const θ = index * sector - Math.PI / 2;
  const half = (sector * WEDGE_FRACTION) / 2;

  const x1i = (cx + R_INNER * Math.cos(θ - half)).toFixed(2);
  const y1i = (cy + R_INNER * Math.sin(θ - half)).toFixed(2);
  const x2i = (cx + R_INNER * Math.cos(θ + half)).toFixed(2);
  const y2i = (cy + R_INNER * Math.sin(θ + half)).toFixed(2);
  const x1o = (cx + R_OUTER * Math.cos(θ - half)).toFixed(2);
  const y1o = (cy + R_OUTER * Math.sin(θ - half)).toFixed(2);
  const x2o = (cx + R_OUTER * Math.cos(θ + half)).toFixed(2);
  const y2o = (cy + R_OUTER * Math.sin(θ + half)).toFixed(2);

  return `M ${x1i} ${y1i} A ${R_INNER} ${R_INNER} 0 0 1 ${x2i} ${y2i} L ${x2o} ${y2o} A ${R_OUTER} ${R_OUTER} 0 0 0 ${x1o} ${y1o} Z`;
}

const WEDGE_PATHS = Array.from({ length: WEDGE_COUNT }, (_, i) => makeWedgePath(i));

const DOT_POSITIONS = Array.from({ length: WEDGE_COUNT }, (_, i) => {
  const angle = ((i + 0.5) * 2 * Math.PI) / WEDGE_COUNT - Math.PI / 2;
  return {
    x: +(50 + 40 * Math.cos(angle)).toFixed(2),
    y: +(50 + 40 * Math.sin(angle)).toFixed(2),
  };
});

export function FortunaLogo({ size = 80, variant = 'dark' }: Props) {
  const bg = variant === 'light' ? '#F0FDF4' : variant === 'mono' ? '#065F46' : '#042F20';
  const ring = variant === 'light' ? '#D97706' : '#F59E0B';
  const wedge = variant === 'light' ? '#065F46' : '#F0FDF4';

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Background */}
      <Circle cx="50" cy="50" r="50" fill={bg} />

      {/* Outer double ring — coin edge detail */}
      <Circle cx="50" cy="50" r="47.5" fill="none" stroke={ring} strokeWidth="1.8" />
      <Circle cx="50" cy="50" r="43.5" fill="none" stroke={ring} strokeWidth="0.7" opacity="0.45" />

      {/* 6 arc-wedge spokes — the Wheel of Fortuna */}
      {WEDGE_PATHS.map((d, i) => (
        <Path key={i} d={d} fill={wedge} />
      ))}

      {/* 6 gold dots between spokes — coin markings / laurel hints */}
      {DOT_POSITIONS.map((p, i) => (
        <Circle key={i} cx={p.x} cy={p.y} r="2.8" fill={ring} />
      ))}

      {/* Central hub */}
      <Circle cx="50" cy="50" r="10" fill={ring} />
    </Svg>
  );
}
