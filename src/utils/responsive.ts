import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base design dimensions — iPhone 14 Pro Max logical points
const BASE_WIDTH = 430;
const BASE_HEIGHT = 932;

/**
 * Scale a value proportionally to the device's screen width.
 * Capped at 1.15× so tablets don't over-inflate sizes.
 */
export const scale = (size: number): number => {
    const ratio = Math.min(SCREEN_WIDTH / BASE_WIDTH, 1.15);
    return Math.round(PixelRatio.roundToNearestPixel(size * ratio));
};

/**
 * Scale with a dampening factor so the result stays closer to the
 * original design value on both small and large screens.
 * factor = 0 → no scaling, factor = 1 → full scale()
 */
export const moderateScale = (size: number, factor = 0.45): number => {
    const scaled = scale(size);
    return Math.round(PixelRatio.roundToNearestPixel(size + (scaled - size) * factor));
};

/**
 * Scale a value proportionally to the device's screen height.
 * Capped at 1.15× to avoid over-scaling on taller tablets.
 */
export const verticalScale = (size: number): number => {
    const ratio = Math.min(SCREEN_HEIGHT / BASE_HEIGHT, 1.15);
    return Math.round(PixelRatio.roundToNearestPixel(size * ratio));
};

/** Width as a percentage of screen width. */
export const wp = (percentage: number): number =>
    (percentage / 100) * SCREEN_WIDTH;

/** Height as a percentage of screen height. */
export const hp = (percentage: number): number =>
    (percentage / 100) * SCREEN_HEIGHT;

/** True on phones narrower than 375 pt (e.g. iPhone SE, small Android). */
export const isSmallDevice = SCREEN_WIDTH < 375;

/** True on tablets (>= 768 pt wide). */
export const isTablet = SCREEN_WIDTH >= 768;

export const screenWidth = SCREEN_WIDTH;
export const screenHeight = SCREEN_HEIGHT;
