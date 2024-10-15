import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

type SvgProps = {
  fill?: string;
  height?: number;
  width?: number;
};

const SvgComponent: React.FC<SvgProps> = ({
  fill = '#fff',
  height = 20,
  width = 20,
}) => (
  <Svg width={height} height={width} fill="none" viewBox="0 0 512 512">
    <Path
      fill={fill}
      d="M62 1c-7.1 1.5-15.1 6-20.6 11.5C32.8 21 27.7 33.5 26 50c-1.3 12.9-1.3 399.1 0 412 1.7 16.5 6.8 29 15.4 37.5 14.9 14.9 37.3 16.3 61.9 3.9 7.6-3.7 345.7-197.5 354.6-203.1 3.1-2 9-7 13.1-11.2 15.9-16.1 19.6-34 10.7-52.1-3.7-7.6-15.2-19.8-23.8-25.3-8.9-5.6-347-199.4-354.6-203.1C99.6 6.7 93.6 4.2 90 3 82.6.6 68.6-.4 62 1z"
    />
  </Svg>
);
export default SvgComponent;
