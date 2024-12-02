import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

type SvgProps = {
  fill?: string;
  height?: number;
  width?: number;
};

const SvgComponent: React.FC<SvgProps> = ({
  fill = '#fff',
  height = 30,
  width = 30,
}) => (
  <Svg width={height} height={width} fill="none" viewBox="0 0 16 16">
    <Path
      fill={fill}
      d="M4.162 3.255a.844.844 0 0 0-.6.235.857.857 0 0 0 0 1.198l5.235 5.234-5.234 5.234a.857.857 0 0 0 0 1.199.858.858 0 0 0 1.198 0l5.234-5.235 5.235 5.235a.858.858 0 0 0 1.198 0 .857.857 0 0 0 0-1.199l-5.235-5.234 5.235-5.234a.858.858 0 0 0 0-1.198.844.844 0 0 0-.6-.235.844.844 0 0 0-.598.235L9.995 8.724 4.761 3.49a.844.844 0 0 0-.6-.235Z"
    />
  </Svg>
);
export default SvgComponent;
