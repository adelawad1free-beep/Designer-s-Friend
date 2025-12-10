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
  MOCKUP_GENERATOR = 'MOCKUP_GENERATOR',
  SVG_LIBRARY = 'SVG_LIBRARY',
  BUSINESS_CARD = 'BUSINESS_CARD',
  CALENDAR_CONVERTER = 'CALENDAR_CONVERTER',
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