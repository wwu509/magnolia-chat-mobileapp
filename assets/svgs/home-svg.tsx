import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

type SvgProps = {
  fill?: string;
  height?: number;
  width?: number;
};

const SvgComponent: React.FC<SvgProps> = ({
  fill = '#127146',
  height = 48,
  width = 48,
}) => (
  <Svg width={height} height={width} fill="none">
    <Path
      fill="#283FCE"
      d="M18.233 6.675 12.775 2.31c-1.067-.85-2.733-.859-3.792-.009L3.525 6.675C2.742 7.3 2.267 8.55 2.433 9.534l1.05 6.283c.242 1.408 1.55 2.517 2.975 2.517h8.834c1.408 0 2.741-1.134 2.983-2.525l1.05-6.284c.15-.975-.325-2.225-1.092-2.85ZM11.5 15a.63.63 0 0 1-.625.625.63.63 0 0 1-.625-.625v-2.5a.63.63 0 0 1 .625-.625.63.63 0 0 1 .625.625V15Z"
    />
  </Svg>
);
export default SvgComponent;
