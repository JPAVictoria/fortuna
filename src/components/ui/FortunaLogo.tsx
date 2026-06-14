import {
  Circle,
  Defs,
  LinearGradient,
  Line,
  Stop,
  Svg,
  Text as SvgText,
} from 'react-native-svg';

type Props = {
  size?: number;
  variant?: 'dark' | 'light' | 'mono';
};

const SPOKES = 8;

export function FortunaLogo({ size = 80, variant = 'dark' }: Props) {
  const c = size / 2;

  const bg = variant === 'dark' ? '#064E3B' : variant === 'light' ? '#F0FDF4' : '#10B981';
  const emerald = variant === 'mono' ? '#FFFFFF' : '#10B981';
  const emeraldLight = variant === 'mono' ? 'rgba(255,255,255,0.7)' : '#34D399';
  const gold = variant === 'mono' ? '#FFFFFF' : '#F59E0B';
  const letterFill = variant === 'dark' ? '#064E3B' : variant === 'light' ? '#F0FDF4' : '#FFFFFF';

  const spokes = Array.from({ length: SPOKES }, (_, i) => {
    const angle = (i * 2 * Math.PI) / SPOKES - Math.PI / 2;
    const innerR = size * 0.205;
    const outerR = size * 0.415;
    const dotR = size * 0.445;
    return {
      x1: c + innerR * Math.cos(angle),
      y1: c + innerR * Math.sin(angle),
      x2: c + outerR * Math.cos(angle),
      y2: c + outerR * Math.sin(angle),
      dotX: c + dotR * Math.cos(angle),
      dotY: c + dotR * Math.sin(angle),
    };
  });

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        <LinearGradient id="emeraldGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={emeraldLight} />
          <Stop offset="1" stopColor={emerald} />
        </LinearGradient>
        <LinearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FCD34D" />
          <Stop offset="1" stopColor="#F59E0B" />
        </LinearGradient>
      </Defs>

      {/* Background */}
      <Circle cx={c} cy={c} r={c} fill={bg} />

      {/* Outer gold ring */}
      <Circle
        cx={c}
        cy={c}
        r={size * 0.47}
        fill="none"
        stroke="url(#goldGrad)"
        strokeWidth={size * 0.018}
      />

      {/* Inner emerald wheel band */}
      <Circle
        cx={c}
        cy={c}
        r={size * 0.34}
        fill="none"
        stroke={emerald}
        strokeWidth={size * 0.025}
        opacity={0.4}
      />

      {/* Spokes */}
      {spokes.map((s, i) => (
        <Line
          key={i}
          x1={s.x1}
          y1={s.y1}
          x2={s.x2}
          y2={s.y2}
          stroke={emerald}
          strokeWidth={size * 0.022}
          strokeLinecap="round"
          opacity={0.85}
        />
      ))}

      {/* Gold dots at spoke ends */}
      {spokes.map((s, i) => (
        <Circle
          key={`d${i}`}
          cx={s.dotX}
          cy={s.dotY}
          r={size * 0.028}
          fill={gold}
        />
      ))}

      {/* Inner emerald circle (hub) */}
      <Circle cx={c} cy={c} r={size * 0.205} fill="url(#emeraldGrad)" />

      {/* Subtle inner ring for depth */}
      <Circle
        cx={c}
        cy={c}
        r={size * 0.205}
        fill="none"
        stroke={emeraldLight}
        strokeWidth={size * 0.01}
        opacity={0.5}
      />

      {/* "F" lettermark */}
      <SvgText
        x={c + size * 0.01}
        y={c + size * 0.083}
        textAnchor="middle"
        fontSize={size * 0.23}
        fill={letterFill}
        fontWeight="bold"
        letterSpacing={-1}
      >
        F
      </SvgText>
    </Svg>
  );
}
