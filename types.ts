export enum ToolType {
  CODE_GENERATOR = 'CODE_GENERATOR',
  IMAGE_RESIZER = 'IMAGE_RESIZER',
  PALETTE_GENERATOR = 'PALETTE_GENERATOR',
  QR_GENERATOR = 'QR_GENERATOR',
  UNIT_CONVERTER = 'UNIT_CONVERTER',
  HOME = 'HOME'
}

export type Language = 'ar' | 'en';
export type Theme = 'light' | 'dark';

export interface NavItem {
  id: ToolType;
  label: string;
  icon: string;
  description: string;
}

export interface ColorPalette {
  name: string;
  colors: string[];
  description: string;
}

export interface GeneratedCode {
  html: string;
  explanation: string;
}