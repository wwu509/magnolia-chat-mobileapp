import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

type SvgProps = {
  fill?: string;
  height?: number;
  width?: number;
};

const SvgComponent: React.FC<SvgProps> = ({
  fill = '#9E9E9E',
  height = 20,
  width = 20,
}) => (
  <Svg width={height} height={width} viewBox="0 0 980 582">
    <Path d="M466 .7c-3 .2-11.8 1-19.5 1.8C325.3 15.8 199.7 82.2 78.2 197.2c-25.5 24.1-63.7 65.6-73 78.9-6.1 9-6.6 18.1-1.4 27.1 5.6 9.7 33.1 40.7 59.4 66.8C177.4 483.9 302.8 556 421 575.9c25.3 4.3 40.6 5.5 69.5 5.5 29.9 0 44.4-1.2 71.7-5.9 101.8-17.8 210.1-75.3 313.3-166.4 35.6-31.5 92.1-90.6 101.1-105.8 3.4-5.6 4.2-13.5 2-20-5-15-74.4-87-122.6-127.2-65.4-54.5-125.6-91.9-193-119.9C599 9.6 529-3 466 .7zM530 53c47 5.7 97 20.9 143.7 43.5 71.8 34.8 141.2 85.4 206.7 151 19.3 19.3 40.8 42.5 40.4 43.7-1.6 4.3-56.4 59.6-79.3 79.9-75.1 66.7-153.7 114.4-228.9 139.1-26.9 8.8-59.8 16.1-84.6 18.7-17.2 1.9-43.9 2.4-61 1.2-109.5-7.6-224.6-64.6-337.5-167.1-14-12.7-57.9-56.9-65.8-66.2-4.4-5.2-4.7-5.9-3.5-7.7 3.8-5.4 38.2-41.2 52.8-55 70.7-66.6 133.4-110.4 205.6-143.6 44.8-20.7 99.2-35.1 146.9-38.9 8.8-.7 55.7.3 64.5 1.4z" />
    <Path d="M471 134c-35.6 4.9-67.6 20.5-91.5 44.5-23.3 23.3-38.1 50.9-44.7 83.7-3.3 16.1-3.2 44.4.1 59.8 4.6 21.6 11.9 39 23.5 56.5 31 46.5 83.7 72.9 140 70.1 29.5-1.4 54.5-9.6 79.1-26 35.8-23.9 60.7-61.6 68-103.1 2.6-14.2 3-35.9 1.1-49.7-5.1-35.9-19.7-65-45.6-90.8-12.3-12.2-25.2-21.4-41.5-29.5-23.3-11.6-39-15.4-65-16-9.3-.2-19.9 0-23.5.5zm39.2 51.5c22.2 4.6 40.5 14.5 56 30.2 19.6 19.9 29.4 42.8 30.5 70.7.6 15.7-.3 23.1-4.9 37.6-3.7 11.5-5.9 16-13.7 27.7-25.2 37.7-73.5 54.6-118.9 41.7-48.1-13.7-81.1-62.2-76.2-112.2 1.1-11.3 1.2-11.7 5.2-24.2 3.7-11.4 5.4-14.9 12.4-25.7 13.8-21.3 37.1-37.8 62.8-44.4 9.6-2.4 13.1-2.8 25.3-2.9 9 0 16.8.6 21.5 1.5z" />
  </Svg>
);
export default SvgComponent;