import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

type SvgProps = {
  fill?: string;
  height?: number;
  width?: number;
};

const SvgComponent: React.FC<SvgProps> = ({height = 40, width = 40, fill}) => (
  <Svg width={height} height={width} fill={fill} viewBox="0 0 512 512">
    <Path d="M231.5 1.1C174 6.6 115.8 34 76.3 74.2L69 81.5l43.9 76c24.1 41.8 44.2 76 44.6 76 .8 0 133.9-230.4 133.4-231-.2-.2-5.6-.8-11.9-1.4-13.2-1.2-34.3-1.2-47.5 0zM269.4 83.5 225.2 160h133.9c81.2 0 133.9-.4 133.9-.9 0-2.3-17.2-34.6-23.2-43.6-20.2-30.2-48-57.5-77.4-76-12.2-7.7-30.1-16.7-43.6-22-11-4.3-31.1-10.5-33.9-10.5-.8 0-20.6 33.3-45.5 76.5zM48.3 106.7c-11.8 15.9-25.2 41-32.7 61.4C.5 209.1-3.8 257.8 4 300.8c1.8 9.6 2.8 14 6.1 26.4l1 3.8h88.4c48.7 0 88.5-.2 88.5-.4 0-.4-132.9-230.8-133.5-231.4-.2-.2-3 3.1-6.2 7.5zM324.2 181.9c.2.5 30.2 52.7 66.8 116l66.5 115.2 2.8-3.3c11-12.9 27.9-44 35.9-65.8 10.9-29.5 15.2-55.1 15.2-88.5 0-28-1.9-42.6-9.5-70.8l-1-3.7h-88.5c-50.2 0-88.4.4-88.2.9zM353.7 278.7c-9.5 16.1-131.9 228.7-132.3 229.7-.8 2.1 11 3.1 36.1 3 43.1-.1 78.2-8.7 116.5-28.5 22.5-11.7 44.8-27.9 61.2-44.6l7.8-7.8-43.6-75.5c-24-41.5-43.9-75.9-44.4-76.3-.4-.5-1-.5-1.3 0zM19 352.9c0 2.3 17.2 34.6 23.2 43.6 30.6 45.8 75.3 81.2 126.2 100 10.3 3.8 29.3 9.1 30 8.4.2-.2 20.2-34.7 44.4-76.7l44-76.2H152.9c-81.2 0-133.9.4-133.9.9z" />
  </Svg>
);
export default SvgComponent;