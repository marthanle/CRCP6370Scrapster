import Svg, { Circle, Path, Rect } from "react-native-svg";

interface IconProps {
  color: string;
  size?: number;
}

const common = { fill: "none", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function HomeIcon({ color, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...common} stroke={color}>
      <Path d="M3.5 10.2 12 3.5l8.5 6.7V19a1.5 1.5 0 0 1-1.5 1.5h-4.2v-6h-5.6v6H5A1.5 1.5 0 0 1 3.5 19z" />
    </Svg>
  );
}

export function ScanIcon({ color, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...common} stroke={color}>
      <Path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2.2l1.5-2.2h5.6L16.3 7h2.2A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z" />
      <Circle cx="12" cy="12.8" r="3.4" />
    </Svg>
  );
}

export function KitchenIcon({ color, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...common} stroke={color}>
      <Rect x="5.5" y="2.8" width="13" height="18.4" rx="2.2" />
      <Path d="M5.5 9.5h13" />
      <Path d="M8.6 5.6v1.6" />
      <Path d="M8.6 12.3v3" />
    </Svg>
  );
}

export function FeedIcon({ color, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...common} stroke={color}>
      <Circle cx="9" cy="8.2" r="3.2" />
      <Path d="M3.2 19.5c.6-3.2 2.9-5 5.8-5s5.2 1.8 5.8 5" />
      <Path d="M15.6 5.3a3 3 0 0 1 0 5.8" />
      <Path d="M17.4 14.8c1.9.6 3.1 2.2 3.4 4.7" />
    </Svg>
  );
}

export function SavedIcon({ color, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...common} stroke={color}>
      <Path d="M4.5 11.2c0-3.6 3.3-6.2 7.6-6.2 1.3 0 2.5.2 3.6.7l2.6-1.4-.5 3.1c1 .9 1.7 2 2 3.3h1.2v3.6h-1.6c-.6 1.1-1.5 2-2.6 2.6V20h-3v-2.2h-3.3V20h-3v-2.6c-1.9-1.1-3-3.4-3-6.2z" />
      <Circle cx="15.6" cy="10.4" r="0.4" fill={color} />
      <Path d="M9.5 8.3h3.4" />
    </Svg>
  );
}

export function BookmarkIcon({ color, size = 18, filled = false }: IconProps & { filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M6.5 3.5h11a1 1 0 0 1 1 1v16l-6.5-4-6.5 4v-16a1 1 0 0 1 1-1z" />
    </Svg>
  );
}

export function CommentIcon({ color, size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...common} stroke={color}>
      <Path d="M20 11.5a7.5 7.5 0 0 1-11 6.6L4 19.5l1.4-4.6A7.5 7.5 0 1 1 20 11.5z" />
    </Svg>
  );
}

export function ChevronDownIcon({ color, size = 12 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <Path d="m6 9 6 6 6-6" />
    </Svg>
  );
}

export function SendIcon({ color, size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M5 12h14" />
      <Path d="m13 6 6 6-6 6" />
    </Svg>
  );
}
