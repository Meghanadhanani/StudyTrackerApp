import * as React from "react";
import Svg, { Circle, Path, Rect, Line } from "react-native-svg";
const SplashIllustration = (props) => (
  <Svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" {...props}>
    <Circle cx={200} cy={200} r={150} fill="#EAF5F2" opacity={0.5} />
    <Circle cx={320} cy={100} r={30} fill="#FFE3E0" opacity={0.6} />
    <Circle cx={80} cy={320} r={40} fill="#4B9F89" opacity={0.1} />
    <Path d="M100 280 L300 280 L320 300 L80 300 Z" fill="#4B9F89" />
    <Rect x={150} y={150} width={100} height={80} rx={4} fill="#333333" />
    <Rect x={155} y={155} width={90} height={70} rx={2} fill="#FFFFFF" />
    <Rect x={160} y={160} width={60} height={4} rx={2} fill="#4B9F89" />
    <Rect x={160} y={170} width={40} height={4} rx={2} fill="#F63E38" />
    <Rect x={160} y={180} width={50} height={4} rx={2} fill="#4B9F89" />
    <Rect x={260} y={200} width={40} height={80} rx={2} fill="#F63E38" />
    <Rect x={265} y={190} width={40} height={80} rx={2} fill="#4B9F89" />
    <Rect x={270} y={180} width={40} height={80} rx={2} fill="#FFE3E0" />
    <Rect x={100} y={200} width={30} height={40} rx={4} fill="#F63E38" />
    <Path
      d="M100 210 C100 205, 130 205, 130 210"
      stroke="#FFFFFF"
      fill="none"
      strokeWidth={2}
    />
    <Circle
      cx={200}
      cy={100}
      r={25}
      fill="#FFFFFF"
      stroke="#4B9F89"
      strokeWidth={3}
    />
    <Line x1={200} y1={100} x2={200} y2={85} stroke="#333333" strokeWidth={2} />
    <Line
      x1={200}
      y1={100}
      x2={210}
      y2={100}
      stroke="#333333"
      strokeWidth={2}
    />
    <Circle cx={320} cy={150} r={8} fill="#F63E38" />
    <Circle cx={80} cy={150} r={6} fill="#4B9F89" />
    <Circle cx={350} cy={250} r={10} fill="#FFE3E0" />
  </Svg>
);
export default SplashIllustration;
