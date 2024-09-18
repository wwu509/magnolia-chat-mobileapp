import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

type SvgProps = {
  fill?: string;
  height?: number;
  width?: number;
};

const SvgComponent: React.FC<SvgProps> = ({
  fill = '#000',
  height = 40,
  width = 40,
}) => (
  <Svg width={height} height={width} fill="none">
    <Path
      fill={fill}
      d="M12.5 17.224a.618.618 0 0 1-.441-.183l-5.434-5.433a2.283 2.283 0 0 1 0-3.217l5.434-5.433a.629.629 0 0 1 .883 0 .629.629 0 0 1 0 .883L7.51 9.274c-.4.4-.4 1.05 0 1.45l5.433 5.434a.629.629 0 0 1 0 .883.655.655 0 0 1-.442.183Z"
    />
  </Svg>
);
export default SvgComponent;
