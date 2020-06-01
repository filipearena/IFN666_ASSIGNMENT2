import { Dimensions } from 'react-native';

export function scaleSize(fontSize) {
  const window = Dimensions.get('window');
  return Math.round((fontSize / 375) * Math.min(window.width, window.height));
}

export function getPercentageSinceOpen(close, open) {
  return ((100 * (close - open)) / open).toFixed(2);
}

export const RED_COLOR = '#f44336';

export const GREEN_COLOR = '#4CD964';

export const DARK_GREY = '#111'

export const MEDIUM_GREY = '#444'
