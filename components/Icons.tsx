import React from 'react';

// Base props for consistency
interface IconProps {
  className?: string;
}

// Logo: Abstract geometric shape representing design/creativity
export const LogoIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3ZM10 17H7V7H10V17ZM17 17H13V13H17V17ZM17 11H13V7H17V11Z" />
  </svg>
);

// Code: Brackets representing coding
export const CodeIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM8 16H6V14.5L7.5 13L6 11.5V10H8L10.5 12.5L8 16ZM12 17H10L12 7H14L12 17ZM18 14.5V16H16L13.5 12.5L16 9H18V10.5L16.5 12L18 14.5Z" />
  </svg>
);

// Image: Picture frame landscape
export const ImageIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM5 19L8.5 14.5L11 17.5L14.5 13L19 19H5Z" />
  </svg>
);

// Palette: Artist palette
export const PaletteIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C12.98 22 13.88 21.57 14.49 20.89C14.77 20.57 14.92 20.16 14.92 19.74C14.92 18.78 15.7 18 16.66 18H17.5C19.98 18 22 15.98 22 13.5V12C22 6.48 17.52 2 12 2ZM6.5 13C5.67 13 5 12.33 5 11.5C5 10.67 5.67 10 6.5 10C7.33 10 8 10.67 8 11.5C8 12.33 7.33 13 6.5 13ZM9.5 9C8.67 9 8 8.33 8 7.5C8 6.67 8.67 6 9.5 6C10.33 6 11 6.67 11 7.5C11 8.33 10.33 9 9.5 9ZM14.5 9C13.67 9 13 8.33 13 7.5C13 6.67 13.67 6 14.5 6C15.33 6 16 6.67 16 7.5C16 8.33 15.33 9 14.5 9ZM17.5 13C16.67 13 16 12.33 16 11.5C16 10.67 16.67 10 17.5 10C18.33 10 19 10.67 19 11.5C19 12.33 18.33 13 17.5 13Z" />
  </svg>
);

// QR: Modern pixelated style
export const QrIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M3 5V9H7V5H3ZM9 9H11V11H9V9ZM3 15V19H7V15H3ZM15 3V7H19V3H15ZM19 11H17V9H19V11ZM17 15V13H15V15H13V17H15V19H17V21H19V19H21V15H17ZM21 9H23V11H21V9ZM9 5H11V7H9V5ZM13 3V5H11V3H13ZM5 7H7V5H5V7ZM5 17H7V15H5V17ZM17 5H19V7H17V5ZM13 7H15V9H13V7ZM13 13H15V11H17V9H15V7H13V13ZM9 13H11V15H9V13ZM9 17H11V19H9V17ZM3 3H9V11H3V3ZM3 13H9V21H3V13ZM13 21H15V19H13V21ZM15 3H21V9H15V3Z" />
  </svg>
);

// Unit: Ruler and weight
export const UnitIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M4 18H20C21.1 18 22 17.1 22 16V8C22 6.9 21.1 6 20 6H4C2.9 6 2 6.9 2 8V16C2 17.1 2.9 18 4 18ZM6 8H8V11H6V8ZM10 8H12V11H10V8ZM14 8H16V11H14V8ZM18 8H20V11H18V8Z" />
  </svg>
);

// Nutrition: Apple/Leaf
export const NutritionIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.0001 2C12.0001 2 12.0001 5.99999 15.9999 6.00003C12.6371 6.55998 10.228 9.2079 9.61397 12.592C10.793 11.233 12.529 10.373 14.471 10.373C18.618 10.373 21.993 13.687 22 17.821C22 17.881 22 17.94 22 18C22 20.209 20.209 22 18 22H6C3.791 22 2 20.209 2 18C2 12.833 5.373 8.32 10.024 6.581C10.008 6.39 10 6.196 10 6C10 3.791 12.0001 2 12.0001 2Z" />
  </svg>
);

// PDF: Document file
export const PdfIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M8 2H16L20 6V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V4C4 2.9 4.9 2 6 2H8ZM15 13H12V16H15V13ZM15 9H11V11H15V9ZM13 18H11V16H13V18Z" />
  </svg>
);

// Barcode: Solid bars
export const BarcodeIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M2 5H4V19H2V5ZM6 5H8V19H6V5ZM10 5H13V19H10V5ZM15 5H17V19H15V5ZM19 5H22V19H19V5Z" />
  </svg>
);

// Compress: Arrows squeezing
export const CompressIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M4 11H9V6H11V13H4V11ZM15 13V18H13V11H20V13H15ZM4 3H20C21.1 3 22 3.9 22 5V19C22 20.1 21.1 21 20 21H4C2.9 21 2 20.1 2 19V5C2 3.9 2.9 3 4 3Z" opacity="0.2"/>
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM8 13H11V16H13V13H16V11H13V8H11V11H8V13Z" />
  </svg>
);

// Calculator: Solid body with buttons
export const CalculatorIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2ZM8 18H6V16H8V18ZM14 18H10V16H14V18ZM18 18H16V16H18V18ZM8 14H6V12H8V14ZM14 14H10V12H14V14ZM18 14H16V12H18V14ZM8 10H6V8H8V10ZM18 10H10V8H18V10ZM18 6H6V4H18V6Z" />
  </svg>
);

// Swatch: Color fan
export const SwatchIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20 10V4C20 2.9 19.1 2 18 2H12C10.9 2 10 2.9 10 4V10C10 11.1 10.9 12 12 12H18C19.1 12 20 11.1 20 10ZM12 4H18V7H12V4Z" />
    <path d="M4 14C4 15.1 4.9 16 6 16H19C19.55 16 20 16.45 20 17C20 17.55 19.55 18 19 18H6C3.79 18 2 16.21 2 14C2 11.79 3.79 10 6 10V12C4.9 12 4 12.9 4 14Z" />
  </svg>
);

// Fire: Flame shape for Calories
export const FireIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M13.5 0.669922C13.5 0.669922 14.24 3.31992 14.24 5.46992C14.24 7.52992 12.89 9.19992 10.83 9.19992C8.76 9.19992 7.2 7.63992 7.2 7.63992C7.2 7.63992 7.23 8.82992 6.94 10.3599C5.21 11.3799 4 13.2499 4 15.3999C4 19.8199 7.58 23.3999 12 23.3999C16.42 23.3999 20 19.8199 20 15.3999C20 11.5999 17.41 8.39992 13.5 0.669922ZM11.71 19.0001C9.93 19.0001 8.49 17.5999 8.49 15.8599C8.49 14.2399 9.54 13.1999 10.28 12.2799C10.64 11.9199 11.77 12.6399 11.38 13.9299C12.67 13.5399 13.88 12.3399 13.97 10.9999C15.02 11.9199 15.74 13.5699 15.74 15.1499C15.74 17.2999 13.89 19.0001 11.71 19.0001Z" />
  </svg>
);

// Mockup: Phone/Device shape
export const MockupIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17 1H7C5.9 1 5 1.9 5 3V21C5 22.1 5.9 23 7 23H17C18.1 23 19 22.1 19 21V3C19 1.9 18.1 1 17 1ZM12 21C11.45 21 11 20.55 11 20C11 19.45 11.45 19 12 19C12.55 19 13 19.45 13 20C13 20.55 12.55 21 12 21ZM17 17H7V4H17V17Z" />
  </svg>
);

// Shapes: Geometric primitives
export const ShapesIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20 2H16C14.9 2 14 2.9 14 4V8C14 9.1 14.9 10 16 10H20C21.1 10 22 9.1 22 8V4C22 2.9 21.1 2 20 2ZM8 13C5.24 13 3 15.24 3 18C3 20.76 5.24 23 8 23C10.76 23 13 20.76 13 18C13 15.24 10.76 13 8 13ZM19 13H16C14.9 13 14 13.9 14 15V21C14 22.1 14.9 23 16 23H19C20.1 23 21 22.1 21 21V15C21 13.9 20.1 13 19 13ZM9 2L3 10H11L9 2Z" />
  </svg>
);

// ID Card: Business Card
export const IdCardIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V6H20V18ZM12 12C12 13.1 11.1 14 10 14C8.9 14 8 13.1 8 12C8 10.9 8.9 10 10 10C11.1 10 12 10.9 12 12ZM16 14H14V13H16V14ZM16 12H14V11H16V12ZM16 10H14V9H16V10Z" />
  </svg>
);

// Date/Calendar
export const DateIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5v-5z" />
  </svg>
);

// --- UI Navigation Icons (Keep simple strokes or filled based on preference) ---

export const BackIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
  </svg>
);

export const SunIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/>
  </svg>
);

export const MoonIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
  </svg>
);

export const LangIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
     <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
  </svg>
);

// Reused simple icons for internal tool UIs
export const LinkIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
  </svg>
);

export const TextIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
     <path d="M14 17H4v2h10v-2zm6-8H4v2h16V9zM4 15h16v-2H4v2zM4 5v2h16V5H4z"/>
  </svg>
);

export const WifiIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
  </svg>
);

export const EmailIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);

export const PhoneIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
  </svg>
);

export const SmsIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z"/>
  </svg>
);

export const ContactIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1z"/>
  </svg>
);

export const SwapIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z"/>
  </svg>
);

export const LockIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
  </svg>
);

export const SplitIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
  </svg>
);

export const RotateIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M7.11 8.53L5.7 7.11C4.8 8.27 4.24 9.61 4.07 11h2.02c.14-.87.49-1.72 1.02-2.47zM6.09 13H4.07c.17 1.39.72 2.73 1.62 3.89l1.41-1.42c-.52-.75-.87-1.59-1.01-2.47zm1.01 5.32c1.16.9 2.51 1.44 3.9 1.61V17.9c-.87-.15-1.71-.49-2.46-1.03L7.1 18.32zM13 4.07V1L8.45 5.55 13 10V6.09c2.84.48 5 2.94 5 5.91s-2.16 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93s-3.05-7.44-7-7.93z"/>
  </svg>
);

export const PenIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
);

export const EyeDropperIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.71 5.63l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-3.12 3.12-1.93-1.91-1.41 1.41 1.42 1.42L3 16.25V21h4.75l8.92-8.92 1.42 1.42 1.41-1.41-1.92-1.92 3.12-3.12c.4-.4.4-1.03.01-1.42zM5.21 18.96l6.06-6.06 1.72 1.72-6.06 6.06H5.21v-1.72z"/>
  </svg>
);