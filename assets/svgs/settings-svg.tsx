import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

type SvgProps = {
  fill?: string;
  height?: number;
  width?: number;
};

const SvgComponent: React.FC<SvgProps> = ({
  fill = '#000',
  height = 24,
  width = 24,
}) => (
  <Svg width={height} height={width} fill="none">
    <Path
      fill={fill}
      d="M12 3.08 9.787 5.368a1.25 1.25 0 0 1-.899.381H5.75v3.138c0 .34-.138.664-.381.9L3.079 12l2.29 2.213c.243.235.381.56.381.899v3.138h3.138c.34 0 .664.138.9.381L12 20.921l2.213-2.29a1.25 1.25 0 0 1 .899-.381h3.138v-3.138c0-.34.138-.664.381-.9L20.921 12l-2.29-2.213a1.25 1.25 0 0 1-.381-.899V5.75h-3.138a1.25 1.25 0 0 1-.9-.381L12 3.079Zm-.899-1.23a1.25 1.25 0 0 1 1.798 0l2.319 2.4H18.5c.69 0 1.25.56 1.25 1.25v3.282l2.4 2.32a1.25 1.25 0 0 1 0 1.797l-2.4 2.319V18.5c0 .69-.56 1.25-1.25 1.25h-3.282l-2.32 2.4a1.25 1.25 0 0 1-1.797 0l-2.319-2.4H5.5c-.69 0-1.25-.56-1.25-1.25v-3.282l-2.4-2.32a1.25 1.25 0 0 1 0-1.797l2.4-2.319V5.5c0-.69.56-1.25 1.25-1.25h3.282l2.32-2.4Z"
      clipRule="evenodd"
    />
    <Path
      fill={fill}
      d="M7.25 12a4.75 4.75 0 1 1 9.5 0 4.75 4.75 0 0 1-9.5 0ZM12 8.75a3.25 3.25 0 1 0 0 6.5 3.25 3.25 0 0 0 0-6.5Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default SvgComponent;
