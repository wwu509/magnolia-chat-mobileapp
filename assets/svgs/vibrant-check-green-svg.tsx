import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

type SvgProps = {
  fill?: string;
  height?: number;
  width?: number;
};

const SvgComponent: React.FC<SvgProps> = ({
  fill = '#9E9E9E',
  height = 260,
  width = 260,
}) => (
  <Svg width={height} height={width} fill="none">
    <Circle cx={130} cy={130} r={129.5} stroke="#8DD4B4" strokeOpacity={0.48} />
    <Circle cx={130} cy={130} r={99.5} stroke="#8DD4B4" strokeOpacity={0.32} />
    <Circle cx={130} cy={132} r={74.5} stroke="#8DD4B4" strokeOpacity={0.24} />
    <Path
      fill="#1BAA69"
      d="m166.034 118.409-40.125 40.125a4.997 4.997 0 0 1-7.068 0l-22.382-22.5a5 5 0 0 1 0-7.066l6.25-6.25a5.002 5.002 0 0 1 7.057 0l12.734 12.35 30.238-29.865a5 5 0 0 1 7.059 0l6.234 6.106a4.992 4.992 0 0 1 1.481 3.549 4.996 4.996 0 0 1-1.478 3.551Z"
    />
  </Svg>
);
export default SvgComponent;
