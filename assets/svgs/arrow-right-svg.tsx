import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

type SvgProps = {
  fill?: string;
  height?: number;
  width?: number;
};

const SvgComponent: React.FC<SvgProps> = ({
  fill = '#0A0A0A',
  height = 20,
  width = 20 }) => (
  <Svg width={height} height={width}>
    <Path
      fill={fill}
      d="M7.425 17.224a.618.618 0 0 1-.442-.183.629.629 0 0 1 0-.883l5.433-5.434c.4-.4.4-1.05 0-1.45L6.983 3.841a.629.629 0 0 1 0-.883.629.629 0 0 1 .883 0L13.3 8.39c.425.425.666 1 .666 1.608 0 .609-.233 1.184-.666 1.609L7.866 17.04a.655.655 0 0 1-.441.183Z"
    />
  </Svg>
);
export default SvgComponent;
