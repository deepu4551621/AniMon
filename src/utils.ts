import { Dimensions, PixelRatio } from "react-native";
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const BASE_WIDTH = 375; // Base width for scaling (iPhone 6/7/8)
 const scaleSize = (size: number): number => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};
export const scaleFont = (size: number): number => {
  return Math.round(PixelRatio.roundToNearestPixel(scaleSize(size)));
}
export const isSmallDevice = SCREEN_WIDTH < 320;
