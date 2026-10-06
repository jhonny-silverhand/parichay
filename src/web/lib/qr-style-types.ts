export type ModuleShape = 'square' | 'rounded' | 'dots' | 'classy' | 'extra-rounded' | 'diamond';
export type EyeShape = 'square' | 'rounded' | 'circle';
export type CardLayout = 'qr-only' | 'hairline' | 'plaque' | 'tab' | 'ticket' | 'polaroid' | 'story' | 'square';

export interface ColorStop {
  color: string;
  offset: number; // 0 to 1
}

export interface QRStyle {
  id: string;
  name: string;
  isCustom?: boolean;

  // Modules (dots/matrix)
  moduleShape: ModuleShape;
  moduleColor: string; // solid color
  moduleGradient?: {
    enabled: boolean;
    type: 'linear' | 'radial';
    angle: number; // 0 - 360
    stops: [string, string];
  };

  // Eyes (Finder patterns)
  eyeOuterShape: EyeShape;
  eyeInnerShape: EyeShape;
  eyeOuterColor: string;
  eyeInnerColor: string;

  // Plate (the surface directly behind the QR)
  plateColor: string;
  plateBorderColor?: string;
  plateBorderWidth: number; // 0 to 4
  plateRadius: number; // 8 to 36
  quietZone: number; // 4 to 8

  // Backdrop / Overall card background
  backdropType: 'solid' | 'gradient';
  backdropColor: string;
  backdropGradient?: {
    type: 'linear' | 'radial';
    angle: number;
    stops: [string, string];
  };

  // Centre Element
  centerElement: {
    type: 'none' | 'photo' | 'monogram' | 'icon';
    sizePercent: number; // 15 to 26 percent of QR width
    shape: 'circle' | 'rounded-square';
    hasRing: boolean;
    ringColor: string;
    iconName?: string;
  };

  // Layout & Framing
  layout: CardLayout;
  showCaption: boolean;
  captionText?: string;
  captionFont: string; // font family name
  captionColor?: string;
}

export const PLAIN_DEFAULT_STYLE: QRStyle = {
  id: 'plain',
  name: 'Plain',
  moduleShape: 'square',
  moduleColor: '#111317',
  eyeOuterShape: 'square',
  eyeInnerShape: 'square',
  eyeOuterColor: '#111317',
  eyeInnerColor: '#111317',
  plateColor: '#FFFFFF',
  plateBorderWidth: 0,
  plateRadius: 16,
  quietZone: 4,
  backdropType: 'solid',
  backdropColor: '#FFFFFF',
  centerElement: {
    type: 'none',
    sizePercent: 20,
    shape: 'rounded-square',
    hasRing: true,
    ringColor: '#FFFFFF',
  },
  layout: 'hairline',
  showCaption: true,
  captionFont: 'Instrument Sans',
  captionColor: '#111317',
};
