
export enum ToolType {
  QR_GENERATOR = 'QR_GENERATOR',
  UNIT_CONVERTER = 'UNIT_CONVERTER',
  NUTRITION_LABEL = 'NUTRITION_LABEL',
  BARCODE_GENERATOR = 'BARCODE_GENERATOR',
  IMAGE_COMPRESSOR = 'IMAGE_COMPRESSOR',
  PDF_TOOLS = 'PDF_TOOLS',
  VAT_CALCULATOR = 'VAT_CALCULATOR',
  PANTONE_MATCH = 'PANTONE_MATCH',
  BMR_CALCULATOR = 'BMR_CALCULATOR',
  SVG_LIBRARY = 'SVG_LIBRARY',
  CALENDAR_CONVERTER = 'CALENDAR_CONVERTER',
  GRID_GENERATOR = 'GRID_GENERATOR',
  SOCIAL_SIZES = 'SOCIAL_SIZES',
  PRINT_SIZES = 'PRINT_SIZES',
  PATTERN_GENERATOR = 'PATTERN_GENERATOR',
  DIELINE_GENERATOR = 'DIELINE_GENERATOR',
  PALETTE_GENERATOR = 'PALETTE_GENERATOR',
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
