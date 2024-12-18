import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

type SvgProps = {
  fill?: string;
  height?: number;
  width?: number;
};

const SvgComponent: React.FC<SvgProps> = ({
  fill = '#fff',
  height = 40,
  width = 40,
}) => (
  <Svg width={height} height={width} fill="none" viewBox="0 0 512 512">
    <Path
      fill={fill}
      d="M93 65.6C70.1 70.5 49.9 90.2 44.6 113c-1.4 5.7-1.6 26.1-1.6 162.5 0 148.7.1 156.2 1.9 160 3.7 8.2 12.9 13.4 21.6 12.1 2.2-.3 27.2-9.9 55.5-21.3l51.5-20.8L296 405l122.5-.5 6.5-2.2c19.2-6.6 34.7-22.1 41.3-41.3l2.2-6.5.3-117.3c.3-130.5.6-123.6-6.6-138.2-5.4-11-16.8-22.3-28.2-27.9-15.4-7.5-4.5-7.1-178.5-7-129.6 0-157.1.3-162.5 1.5zm172.8 86.3c4.7 2.4 7.7 5.6 9.7 10.3 1.2 3 1.5 8.3 1.5 27.2v23.5l24.3.3c22.5.3 24.5.4 28.2 2.5 2.2 1.1 5 3.2 6.2 4.5 7.5 8 6.8 22.4-1.3 30-5.8 5.4-8.3 5.8-33.9 5.8H277v23.7c0 21-.3 24.3-1.9 27.8-7.6 16.4-29.8 16.6-38.2.3-1.7-3.4-1.9-6.1-1.9-27.8v-24h-23.5c-19 0-24.3-.3-27.3-1.6-7.9-3.3-13.2-11-13.2-19.4 0-8.8 3.8-15.2 11.5-19.3 3.7-2.1 5.7-2.2 28.3-2.5l24.2-.3v-23.5c0-18.9.3-24.2 1.5-27.2 4.8-11.3 18.1-16 29.3-10.3z"
    />
  </Svg>
);
export default SvgComponent;
