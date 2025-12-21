import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context';
import { SwatchIcon, BackIcon, EyeDropperIcon } from '../Icons';

interface PantoneMatchProps {
  onClose?: () => void;
}

// Type definitions for the experimental EyeDropper API
declare global {
  interface EyeDropper {
    open: () => Promise<{ sRGBHex: string }>;
  }
  interface Window {
    EyeDropper?: {
      prototype: EyeDropper;
      new (): EyeDropper;
    };
  }
}

// --- Color Math Helpers (CIELAB Conversion) ---
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

const rgbToXyz = (r: number, g: number, b: number) => {
  let r_ = r / 255;
  let g_ = g / 255;
  let b_ = b / 255;
  r_ = r_ > 0.04045 ? Math.pow((r_ + 0.055) / 1.055, 2.4) : r_ / 12.92;
  g_ = g_ > 0.04045 ? Math.pow((g_ + 0.055) / 1.055, 2.4) : g_ / 12.92;
  b_ = b_ > 0.04045 ? Math.pow((b_ + 0.055) / 1.055, 2.4) : b_ / 12.92;
  r_ *= 100; g_ *= 100; b_ *= 100;
  return {
    x: r_ * 0.4124 + g_ * 0.3576 + b_ * 0.1805,
    y: r_ * 0.2126 + g_ * 0.7152 + b_ * 0.0722,
    z: r_ * 0.0193 + g_ * 0.1192 + b_ * 0.9505
  };
};

const xyzToLab = (x: number, y: number, z: number) => {
  const refX = 95.047; const refY = 100.000; const refZ = 108.883;
  let x_ = x / refX; let y_ = y / refY; let z_ = z / refZ;
  x_ = x_ > 0.008856 ? Math.pow(x_, 1/3) : (7.787 * x_) + (16 / 116);
  y_ = y_ > 0.008856 ? Math.pow(y_, 1/3) : (7.787 * y_) + (16 / 116);
  z_ = z_ > 0.008856 ? Math.pow(z_, 1/3) : (7.787 * z_) + (16 / 116);
  return { l: (116 * y_) - 16, a: 500 * (x_ - y_), b: 200 * (y_ - z_) };
};

const hexToLab = (hex: string) => {
  const rgb = hexToRgb(hex);
  const xyz = rgbToXyz(rgb.r, rgb.g, rgb.b);
  return xyzToLab(xyz.x, xyz.y, xyz.z);
};

const calculateDeltaE = (lab1: {l:number, a:number, b:number}, lab2: {l:number, a:number, b:number}) => {
  return Math.sqrt(Math.pow(lab1.l - lab2.l, 2) + Math.pow(lab1.a - lab2.a, 2) + Math.pow(lab1.b - lab2.b, 2));
};

// --- Expanded Professional Pantone Dataset (approx 500+ colors) ---
const pantoneDataset = [
  // Yellows (100-119)
  { code: 'PMS Yellow C', hex: '#FEDD00' }, { code: 'PMS 100 C', hex: '#F6E500' }, { code: 'PMS 101 C', hex: '#F7EA48' }, { code: 'PMS 102 C', hex: '#FCE300' }, { code: 'PMS 103 C', hex: '#C6A900' }, { code: 'PMS 104 C', hex: '#AF9800' }, { code: 'PMS 105 C', hex: '#8C7700' }, { code: 'PMS 106 C', hex: '#F8E000' }, { code: 'PMS 107 C', hex: '#F9E200' }, { code: 'PMS 108 C', hex: '#FEDD00' }, { code: 'PMS 109 C', hex: '#FFD100' }, { code: 'PMS 110 C', hex: '#DAAA00' }, { code: 'PMS 111 C', hex: '#AA8A00' }, { code: 'PMS 112 C', hex: '#967800' }, { code: 'PMS 113 C', hex: '#F9E359' }, { code: 'PMS 114 C', hex: '#FBDD40' }, { code: 'PMS 115 C', hex: '#FDDA24' }, { code: 'PMS 116 C', hex: '#FFCD00' }, { code: 'PMS 117 C', hex: '#C99700' }, { code: 'PMS 118 C', hex: '#AC8B00' }, { code: 'PMS 119 C', hex: '#8C7300' },
  // Oranges (120-161)
  { code: 'PMS 120 C', hex: '#FBD872' }, { code: 'PMS 121 C', hex: '#FDD26E' }, { code: 'PMS 122 C', hex: '#FED141' }, { code: 'PMS 123 C', hex: '#FFC72C' }, { code: 'PMS 124 C', hex: '#EAAA00' }, { code: 'PMS 125 C', hex: '#B58500' }, { code: 'PMS 126 C', hex: '#977000' }, { code: 'PMS 127 C', hex: '#F3E38F' }, { code: 'PMS 128 C', hex: '#F3D03E' }, { code: 'PMS 129 C', hex: '#F3C500' }, { code: 'PMS 130 C', hex: '#F2A900' }, { code: 'PMS 131 C', hex: '#CC8A00' }, { code: 'PMS 132 C', hex: '#A07200' }, { code: 'PMS 133 C', hex: '#714B01' }, { code: 'PMS 134 C', hex: '#FFD98E' }, { code: 'PMS 135 C', hex: '#FFC966' }, { code: 'PMS 136 C', hex: '#FFBF3F' }, { code: 'PMS 137 C', hex: '#FFA400' }, { code: 'PMS 138 C', hex: '#DE7C00' }, { code: 'PMS 139 C', hex: '#B56300' }, { code: 'PMS 140 C', hex: '#744600' }, { code: 'PMS 141 C', hex: '#F2C75C' }, { code: 'PMS 142 C', hex: '#F3B23E' }, { code: 'PMS 143 C', hex: '#EDA420' }, { code: 'PMS 144 C', hex: '#ED8B00' }, { code: 'PMS 145 C', hex: '#CF7400' }, { code: 'PMS 146 C', hex: '#9F5C03' }, { code: 'PMS 147 C', hex: '#744F0F' }, { code: 'PMS 148 C', hex: '#FFD29D' }, { code: 'PMS 149 C', hex: '#FDC07F' }, { code: 'PMS 150 C', hex: '#FFB25B' }, { code: 'PMS 151 C', hex: '#FF8200' }, { code: 'PMS 152 C', hex: '#E57200' }, { code: 'PMS 153 C', hex: '#B85600' }, { code: 'PMS 154 C', hex: '#773500' }, { code: 'PMS 155 C', hex: '#F4D998' }, { code: 'PMS 156 C', hex: '#F2C685' }, { code: 'PMS 157 C', hex: '#EAA75F' }, { code: 'PMS 158 C', hex: '#E87722' }, { code: 'PMS 159 C', hex: '#CB6015' }, { code: 'PMS 160 C', hex: '#A15115' }, { code: 'PMS 161 C', hex: '#633719' }, { code: 'PMS Orange 021 C', hex: '#FE5000' },
  // Reds (162-202)
  { code: 'PMS 162 C', hex: '#FFBE9F' }, { code: 'PMS 163 C', hex: '#FF9D6E' }, { code: 'PMS 164 C', hex: '#FF7F41' }, { code: 'PMS 165 C', hex: '#FF6720' }, { code: 'PMS 166 C', hex: '#E35205' }, { code: 'PMS 167 C', hex: '#BE531C' }, { code: 'PMS 168 C', hex: '#6F2C11' }, { code: 'PMS 169 C', hex: '#FFB8A5' }, { code: 'PMS 170 C', hex: '#FF8674' }, { code: 'PMS 171 C', hex: '#FF5C39' }, { code: 'PMS 172 C', hex: '#FA4616' }, { code: 'PMS 173 C', hex: '#D0451C' }, { code: 'PMS 174 C', hex: '#8E3A1C' }, { code: 'PMS 175 C', hex: '#6B2C20' }, { code: 'PMS 176 C', hex: '#FFB1BB' }, { code: 'PMS 177 C', hex: '#FF808B' }, { code: 'PMS 178 C', hex: '#FF5E67' }, { code: 'PMS 179 C', hex: '#E03C31' }, { code: 'PMS 180 C', hex: '#C03328' }, { code: 'PMS 181 C', hex: '#7F2822' }, { code: 'PMS Warm Red C', hex: '#F9423A' }, { code: 'PMS 185 C', hex: '#E4002B' }, { code: 'PMS 186 C', hex: '#C8102E' }, { code: 'PMS 187 C', hex: '#A6192E' }, { code: 'PMS 188 C', hex: '#76232F' }, { code: 'PMS 189 C', hex: '#F9A3B0' }, { code: 'PMS 190 C', hex: '#F6768E' }, { code: 'PMS 191 C', hex: '#EF335D' }, { code: 'PMS 192 C', hex: '#E40046' }, { code: 'PMS 193 C', hex: '#BF0D3E' }, { code: 'PMS 194 C', hex: '#9B2743' }, { code: 'PMS 195 C', hex: '#782F40' }, { code: 'PMS 199 C', hex: '#D50032' }, { code: 'PMS 200 C', hex: '#BA0C2F' }, { code: 'PMS 201 C', hex: '#9D2235' }, { code: 'PMS 202 C', hex: '#862633' },
  // Pinks & Magentas (203-235)
  { code: 'PMS 203 C', hex: '#F6AAB9' }, { code: 'PMS 204 C', hex: '#E87EA1' }, { code: 'PMS 205 C', hex: '#DE5D83' }, { code: 'PMS 206 C', hex: '#CE0056' }, { code: 'PMS 207 C', hex: '#B4004E' }, { code: 'PMS 208 C', hex: '#8C1D40' }, { code: 'PMS 209 C', hex: '#6F263D' }, { code: 'PMS 210 C', hex: '#F99FC9' }, { code: 'PMS 211 C', hex: '#F57EB6' }, { code: 'PMS 212 C', hex: '#F55C97' }, { code: 'PMS 213 C', hex: '#E31C79' }, { code: 'PMS 214 C', hex: '#CE0F69' }, { code: 'PMS 215 C', hex: '#AB1358' }, { code: 'PMS 216 C', hex: '#792949' }, { code: 'PMS 217 C', hex: '#F4C6DE' }, { code: 'PMS 218 C', hex: '#EE88BF' }, { code: 'PMS 219 C', hex: '#DA1884' }, { code: 'PMS 220 C', hex: '#B5006C' }, { code: 'PMS 221 C', hex: '#930058' }, { code: 'PMS 222 C', hex: '#6B1C41' }, { code: 'PMS 223 C', hex: '#F89BC9' }, { code: 'PMS 224 C', hex: '#F074B5' }, { code: 'PMS 225 C', hex: '#DF469C' }, { code: 'PMS 226 C', hex: '#D7006D' }, { code: 'PMS 227 C', hex: '#AB005C' }, { code: 'PMS 228 C', hex: '#88004C' }, { code: 'PMS 229 C', hex: '#682444' }, { code: 'PMS 230 C', hex: '#F69AC9' }, { code: 'PMS 231 C', hex: '#F26DB6' }, { code: 'PMS 232 C', hex: '#F05898' }, { code: 'PMS 233 C', hex: '#CE007C' }, { code: 'PMS 234 C', hex: '#A20067' }, { code: 'PMS 235 C', hex: '#861858' }, { code: 'PMS Rubine Red C', hex: '#CE0058' }, { code: 'PMS Rhodamine Red C', hex: '#E10098' }, { code: 'PMS Magenta C', hex: '#D60C8C' },
  // Purples & Violets (236-276)
  { code: 'PMS 236 C', hex: '#F1BFD7' }, { code: 'PMS 237 C', hex: '#EA8FC7' }, { code: 'PMS 238 C', hex: '#DE59B4' }, { code: 'PMS 239 C', hex: '#D7179E' }, { code: 'PMS 240 C', hex: '#C1068E' }, { code: 'PMS 241 C', hex: '#9D0872' }, { code: 'PMS 242 C', hex: '#7C215A' }, { code: 'PMS 243 C', hex: '#F1BED8' }, { code: 'PMS 244 C', hex: '#E99CC3' }, { code: 'PMS 245 C', hex: '#E072AF' }, { code: 'PMS 246 C', hex: '#CC008C' }, { code: 'PMS 247 C', hex: '#B5007D' }, { code: 'PMS 248 C', hex: '#940069' }, { code: 'PMS 249 C', hex: '#712658' }, { code: 'PMS 250 C', hex: '#EAC3DC' }, { code: 'PMS 251 C', hex: '#DE9EC8' }, { code: 'PMS 252 C', hex: '#CC69AF' }, { code: 'PMS 253 C', hex: '#AF248D' }, { code: 'PMS 254 C', hex: '#962378' }, { code: 'PMS 255 C', hex: '#752662' }, { code: 'PMS 256 C', hex: '#DDC9E2' }, { code: 'PMS 257 C', hex: '#CBA3D3' }, { code: 'PMS 258 C', hex: '#9B5BA5' }, { code: 'PMS 259 C', hex: '#6D2077' }, { code: 'PMS 260 C', hex: '#670068' }, { code: 'PMS 261 C', hex: '#581957' }, { code: 'PMS 262 C', hex: '#512248' }, { code: 'PMS 263 C', hex: '#DCCCE6' }, { code: 'PMS 264 C', hex: '#C4A9D8' }, { code: 'PMS 265 C', hex: '#9063CD' }, { code: 'PMS 266 C', hex: '#753BBD' }, { code: 'PMS 267 C', hex: '#5F259F' }, { code: 'PMS 268 C', hex: '#582C83' }, { code: 'PMS 269 C', hex: '#4E2565' }, { code: 'PMS 270 C', hex: '#B8BDE4' }, { code: 'PMS 271 C', hex: '#9699D6' }, { code: 'PMS 272 C', hex: '#7572C6' }, { code: 'PMS 273 C', hex: '#37128E' }, { code: 'PMS 274 C', hex: '#26126E' }, { code: 'PMS 275 C', hex: '#24135E' }, { code: 'PMS 276 C', hex: '#23154C' }, { code: 'PMS Violet C', hex: '#440099' }, { code: 'PMS Purple C', hex: '#BB29BB' },
  // Blues (277-316)
  { code: 'PMS 277 C', hex: '#A5C9EA' }, { code: 'PMS 278 C', hex: '#8BB8E8' }, { code: 'PMS 279 C', hex: '#418FDE' }, { code: 'PMS 280 C', hex: '#012169' }, { code: 'PMS 281 C', hex: '#00205B' }, { code: 'PMS 282 C', hex: '#041E42' }, { code: 'PMS 283 C', hex: '#92C1E9' }, { code: 'PMS 284 C', hex: '#6CAAE2' }, { code: 'PMS 285 C', hex: '#0072CE' }, { code: 'PMS 286 C', hex: '#0033A0' }, { code: 'PMS 287 C', hex: '#003087' }, { code: 'PMS 288 C', hex: '#002D72' }, { code: 'PMS 289 C', hex: '#0C2340' }, { code: 'PMS 290 C', hex: '#B9D9EB' }, { code: 'PMS 291 C', hex: '#9BCBEB' }, { code: 'PMS 292 C', hex: '#69B3E7' }, { code: 'PMS 293 C', hex: '#003DA5' }, { code: 'PMS 294 C', hex: '#002F6C' }, { code: 'PMS 295 C', hex: '#002855' }, { code: 'PMS 296 C', hex: '#041C2C' }, { code: 'PMS 297 C', hex: '#71C5E8' }, { code: 'PMS 298 C', hex: '#41B6E6' }, { code: 'PMS 299 C', hex: '#00A3E0' }, { code: 'PMS 300 C', hex: '#005EB8' }, { code: 'PMS 301 C', hex: '#004B87' }, { code: 'PMS 302 C', hex: '#003B5C' }, { code: 'PMS 303 C', hex: '#002A3A' }, { code: 'PMS 304 C', hex: '#9ADBE8' }, { code: 'PMS 305 C', hex: '#59CBE8' }, { code: 'PMS 306 C', hex: '#00B5E2' }, { code: 'PMS 307 C', hex: '#006B95' }, { code: 'PMS 308 C', hex: '#004C6C' }, { code: 'PMS 309 C', hex: '#00374A' }, { code: 'PMS 310 C', hex: '#6DD2DE' }, { code: 'PMS 311 C', hex: '#05C3DE' }, { code: 'PMS 312 C', hex: '#009CDD' }, { code: 'PMS 313 C', hex: '#0084C9' }, { code: 'PMS 314 C', hex: '#007298' }, { code: 'PMS 315 C', hex: '#005972' }, { code: 'PMS 316 C', hex: '#00404C' }, { code: 'PMS Process Blue C', hex: '#0085CA' }, { code: 'PMS Reflex Blue C', hex: '#001489' }, { code: 'PMS Cyan C', hex: '#00B5E2' },
  // Teals & Greens (317-378)
  { code: 'PMS 317 C', hex: '#B4E1DC' }, { code: 'PMS 318 C', hex: '#8EE0D6' }, { code: 'PMS 319 C', hex: '#2CD5C4' }, { code: 'PMS 320 C', hex: '#009CA6' }, { code: 'PMS 321 C', hex: '#008C95' }, { code: 'PMS 322 C', hex: '#007377' }, { code: 'PMS 323 C', hex: '#005B5C' }, { code: 'PMS 324 C', hex: '#A3DCD4' }, { code: 'PMS 325 C', hex: '#64CCC9' }, { code: 'PMS 326 C', hex: '#00B2A9' }, { code: 'PMS 327 C', hex: '#00857D' }, { code: 'PMS 328 C', hex: '#007063' }, { code: 'PMS 329 C', hex: '#005B4F' }, { code: 'PMS 330 C', hex: '#00473F' }, { code: 'PMS 331 C', hex: '#B8E1D4' }, { code: 'PMS 332 C', hex: '#94D6C6' }, { code: 'PMS 333 C', hex: '#49C5B1' }, { code: 'PMS 334 C', hex: '#009473' }, { code: 'PMS 335 C', hex: '#00785B' }, { code: 'PMS 336 C', hex: '#00644B' }, { code: 'PMS 337 C', hex: '#9BD6C1' }, { code: 'PMS 338 C', hex: '#6ACCB0' }, { code: 'PMS 339 C', hex: '#00B388' }, { code: 'PMS 340 C', hex: '#00966C' }, { code: 'PMS 341 C', hex: '#007A53' }, { code: 'PMS 342 C', hex: '#006B44' }, { code: 'PMS 343 C', hex: '#115740' }, { code: 'PMS 344 C', hex: '#A7D9A4' }, { code: 'PMS 345 C', hex: '#8BD193' }, { code: 'PMS 346 C', hex: '#6CC24A' }, { code: 'PMS 347 C', hex: '#009A44' }, { code: 'PMS 348 C', hex: '#00843D' }, { code: 'PMS 349 C', hex: '#046A38' }, { code: 'PMS 350 C', hex: '#2C5234' }, { code: 'PMS 351 C', hex: '#BCE4CC' }, { code: 'PMS 352 C', hex: '#A3DAA7' }, { code: 'PMS 353 C', hex: '#8BC383' }, { code: 'PMS 354 C', hex: '#00B140' }, { code: 'PMS 355 C', hex: '#009639' }, { code: 'PMS 356 C', hex: '#007A33' }, { code: 'PMS 357 C', hex: '#215732' }, { code: 'PMS 358 C', hex: '#ACDFA3' }, { code: 'PMS 359 C', hex: '#9AD696' }, { code: 'PMS 360 C', hex: '#63C355' }, { code: 'PMS 361 C', hex: '#43B02A' }, { code: 'PMS 362 C', hex: '#509E2F' }, { code: 'PMS 363 C', hex: '#407D2C' }, { code: 'PMS 364 C', hex: '#4A7729' }, { code: 'PMS 365 C', hex: '#C9E198' }, { code: 'PMS 366 C', hex: '#B8DB86' }, { code: 'PMS 367 C', hex: '#A4D65E' }, { code: 'PMS 368 C', hex: '#78BE20' }, { code: 'PMS 369 C', hex: '#64A70B' }, { code: 'PMS 370 C', hex: '#658D1B' }, { code: 'PMS 371 C', hex: '#5D7420' }, { code: 'PMS 372 C', hex: '#DAEBA9' }, { code: 'PMS 373 C', hex: '#CFE68C' }, { code: 'PMS 374 C', hex: '#C2E173' }, { code: 'PMS 375 C', hex: '#97D700' }, { code: 'PMS 376 C', hex: '#84BD00' }, { code: 'PMS 377 C', hex: '#7A9A01' }, { code: 'PMS 378 C', hex: '#5D6711' }, { code: 'PMS Green C', hex: '#00AB84' },
  // Grays & Neutrals (Cool Gray, Warm Gray, Black)
  { code: 'PMS Cool Gray 1 C', hex: '#D9D9D6' }, { code: 'PMS Cool Gray 2 C', hex: '#D0D0CE' }, { code: 'PMS Cool Gray 3 C', hex: '#C8C9C7' }, { code: 'PMS Cool Gray 4 C', hex: '#BBBCBC' }, { code: 'PMS Cool Gray 5 C', hex: '#B1B3B3' }, { code: 'PMS Cool Gray 6 C', hex: '#A7A8AA' }, { code: 'PMS Cool Gray 7 C', hex: '#97999B' }, { code: 'PMS Cool Gray 8 C', hex: '#888B8D' }, { code: 'PMS Cool Gray 9 C', hex: '#75787B' }, { code: 'PMS Cool Gray 10 C', hex: '#63666A' }, { code: 'PMS Cool Gray 11 C', hex: '#53565A' }, { code: 'PMS Warm Gray 1 C', hex: '#D7D2CB' }, { code: 'PMS Warm Gray 2 C', hex: '#CBC5BF' }, { code: 'PMS Warm Gray 3 C', hex: '#BFB8AF' }, { code: 'PMS Warm Gray 4 C', hex: '#B6ADA5' }, { code: 'PMS Warm Gray 5 C', hex: '#ACA39A' }, { code: 'PMS Warm Gray 6 C', hex: '#A59C94' }, { code: 'PMS Warm Gray 7 C', hex: '#968F89' }, { code: 'PMS Warm Gray 8 C', hex: '#8C8279' }, { code: 'PMS Warm Gray 9 C', hex: '#83786F' }, { code: 'PMS Warm Gray 10 C', hex: '#796E65' }, { code: 'PMS Warm Gray 11 C', hex: '#6E6259' }, { code: 'PMS Black C', hex: '#2D2926' }, { code: 'PMS Black 2 C', hex: '#332F2C' }, { code: 'PMS Black 3 C', hex: '#212721' }, { code: 'PMS Black 4 C', hex: '#31261D' }, { code: 'PMS Black 5 C', hex: '#3C2F2F' }, { code: 'PMS Black 6 C', hex: '#101820' }, { code: 'PMS Black 7 C', hex: '#3D3935' },
  // High Numbers & Expanded (7400-7700)
  { code: 'PMS 7401 C', hex: '#F5E4B3' }, { code: 'PMS 7402 C', hex: '#F4E48F' }, { code: 'PMS 7403 C', hex: '#EDD178' }, { code: 'PMS 7404 C', hex: '#EDD03E' }, { code: 'PMS 7405 C', hex: '#E6C200' }, { code: 'PMS 7406 C', hex: '#F0C600' }, { code: 'PMS 7407 C', hex: '#CBA052' }, { code: 'PMS 7408 C', hex: '#F5BE00' }, { code: 'PMS 7409 C', hex: '#E8B200' }, { code: 'PMS 7410 C', hex: '#E3A15D' }, { code: 'PMS 7411 C', hex: '#E39345' }, { code: 'PMS 7412 C', hex: '#D28238' }, { code: 'PMS 7413 C', hex: '#D77A27' }, { code: 'PMS 7414 C', hex: '#CF6F20' }, { code: 'PMS 7415 C', hex: '#F38D82' }, { code: 'PMS 7416 C', hex: '#EF7D00' }, { code: 'PMS 7417 C', hex: '#E35F00' }, { code: 'PMS 7418 C', hex: '#CB4E08' }, { code: 'PMS 7419 C', hex: '#BA4316' }, { code: 'PMS 7420 C', hex: '#A30046' }, { code: 'PMS 7421 C', hex: '#6C003D' }, { code: 'PMS 7422 C', hex: '#F5C1D1' }, { code: 'PMS 7423 C', hex: '#F2A0BB' }, { code: 'PMS 7424 C', hex: '#F26194' }, { code: 'PMS 7425 C', hex: '#BB3E78' }, { code: 'PMS 7426 C', hex: '#9D0859' }, { code: 'PMS 7427 C', hex: '#9B1B30' }, { code: 'PMS 7428 C', hex: '#7D2A37' }, { code: 'PMS 7429 C', hex: '#E9D7D9' }, { code: 'PMS 7430 C', hex: '#DBBCC0' }, { code: 'PMS 7431 C', hex: '#CE9FA6' }, { code: 'PMS 7432 C', hex: '#B87B86' }, { code: 'PMS 7433 C', hex: '#7B4D7E' }, { code: 'PMS 7434 C', hex: '#6C3D61' }, { code: 'PMS 7435 C', hex: '#582B4F' }, { code: 'PMS 7443 C', hex: '#D9C6DE' }, { code: 'PMS 7444 C', hex: '#C7ACD1' }, { code: 'PMS 7445 C', hex: '#B38EBF' }, { code: 'PMS 7446 C', hex: '#8F66A3' }, { code: 'PMS 7447 C', hex: '#6B437D' }, { code: 'PMS 7448 C', hex: '#533B57' }, { code: 'PMS 7449 C', hex: '#3E343E' }, { code: 'PMS 7450 C', hex: '#B8CBE6' }, { code: 'PMS 7451 C', hex: '#9BCEEB' }, { code: 'PMS 7452 C', hex: '#7CAFD9' }, { code: 'PMS 7453 C', hex: '#6D8EBF' }, { code: 'PMS 7454 C', hex: '#5975A3' }, { code: 'PMS 7455 C', hex: '#487ABE' }, { code: 'PMS 7456 C', hex: '#3B5998' }, { code: 'PMS 7457 C', hex: '#D3E6F2' }, { code: 'PMS 7458 C', hex: '#BBD9E8' }, { code: 'PMS 7459 C', hex: '#70B2D1' }, { code: 'PMS 7460 C', hex: '#0090C5' }, { code: 'PMS 7461 C', hex: '#007DC5' }, { code: 'PMS 7462 C', hex: '#005F99' }, { code: 'PMS 7463 C', hex: '#002E55' }, { code: 'PMS 7464 C', hex: '#D4EBEC' }, { code: 'PMS 7465 C', hex: '#BFE4E3' }, { code: 'PMS 7466 C', hex: '#00A5AB' }, { code: 'PMS 7467 C', hex: '#008C99' }, { code: 'PMS 7468 C', hex: '#007584' }, { code: 'PMS 7469 C', hex: '#005D70' }, { code: 'PMS 7470 C', hex: '#004751' }, { code: 'PMS 7471 C', hex: '#8ED1CA' }, { code: 'PMS 7472 C', hex: '#6BBBAE' }, { code: 'PMS 7473 C', hex: '#26A69A' }, { code: 'PMS 7474 C', hex: '#008375' }, { code: 'PMS 7475 C', hex: '#006B62' }, { code: 'PMS 7476 C', hex: '#084845' }, { code: 'PMS 7477 C', hex: '#1D3B38' }, { code: 'PMS 7478 C', hex: '#4DD0E1' }, { code: 'PMS 7479 C', hex: '#26C59E' }, { code: 'PMS 7480 C', hex: '#00BFA5' }, { code: 'PMS 7481 C', hex: '#00B760' }, { code: 'PMS 7482 C', hex: '#009F4D' }, { code: 'PMS 7483 C', hex: '#275F36' }, { code: 'PMS 7484 C', hex: '#1D452B' }, { code: 'PMS 7485 C', hex: '#E6F0E6' }, { code: 'PMS 7486 C', hex: '#CDE1CD' }, { code: 'PMS 7487 C', hex: '#A3D4A3' }, { code: 'PMS 7488 C', hex: '#78D64B' }, { code: 'PMS 7489 C', hex: '#68B34D' }, { code: 'PMS 7490 C', hex: '#5A9943' }, { code: 'PMS 7491 C', hex: '#487A32' }, { code: 'PMS 7499 C', hex: '#F1E9D2' }, { code: 'PMS 7500 C', hex: '#E0C68D' }, { code: 'PMS 7501 C', hex: '#D6BE94' }, { code: 'PMS 7502 C', hex: '#CEB888' }, { code: 'PMS 7503 C', hex: '#A38E6E' }, { code: 'PMS 7504 C', hex: '#8F7E5C' }, { code: 'PMS 7505 C', hex: '#75634D' }, { code: 'PMS 7506 C', hex: '#FBDCA9' }, { code: 'PMS 7507 C', hex: '#F5CB91' }, { code: 'PMS 7508 C', hex: '#E6B072' }, { code: 'PMS 7509 C', hex: '#DEA057' }, { code: 'PMS 7510 C', hex: '#C28340' }, { code: 'PMS 7511 C', hex: '#B36D2E' }, { code: 'PMS 7512 C', hex: '#8E511E' }, { code: 'PMS 7520 C', hex: '#F5C6BA' }, { code: 'PMS 7521 C', hex: '#E8A79B' }, { code: 'PMS 7522 C', hex: '#D47B6D' }, { code: 'PMS 7523 C', hex: '#BD5F51' }, { code: 'PMS 7524 C', hex: '#A34338' }, { code: 'PMS 7525 C', hex: '#8C352B' }, { code: 'PMS 7526 C', hex: '#73261F' }, { code: 'PMS 7527 C', hex: '#D6D2C4' }, { code: 'PMS 7528 C', hex: '#C5BEAD' }, { code: 'PMS 7529 C', hex: '#B5AA9D' }, { code: 'PMS 7530 C', hex: '#A19586' }, { code: 'PMS 7531 C', hex: '#8F8276' }, { code: 'PMS 7532 C', hex: '#63513D' }, { code: 'PMS 7533 C', hex: '#483C32' }, { code: 'PMS 7541 C', hex: '#E6E7E8' }, { code: 'PMS 7542 C', hex: '#B0BCBE' }, { code: 'PMS 7543 C', hex: '#9DA8B0' }, { code: 'PMS 7544 C', hex: '#73848E' }, { code: 'PMS 7545 C', hex: '#425563' }, { code: 'PMS 7546 C', hex: '#26343F' }, { code: 'PMS 7547 C', hex: '#1A232E' }, { code: 'PMS 7548 C', hex: '#FFC600' }, { code: 'PMS 7549 C', hex: '#FFB600' }, { code: 'PMS 7550 C', hex: '#D69A00' }, { code: 'PMS 7551 C', hex: '#A37500' }, { code: 'PMS 7552 C', hex: '#8E6700' }, { code: 'PMS 7553 C', hex: '#6B4E00' }, { code: 'PMS 7554 C', hex: '#4D3800' }, { code: 'PMS 7555 C', hex: '#D6AE00' }, { code: 'PMS 7556 C', hex: '#C19D00' }, { code: 'PMS 7557 C', hex: '#B59400' }, { code: 'PMS 7558 C', hex: '#8E7300' }, { code: 'PMS 7559 C', hex: '#7A6200' }, { code: 'PMS 7560 C', hex: '#635100' }, { code: 'PMS 7561 C', hex: '#4D3E00' }, { code: 'PMS 7562 C', hex: '#C9A35F' }, { code: 'PMS 7563 C', hex: '#B38D4A' }, { code: 'PMS 7564 C', hex: '#A17D3F' }, { code: 'PMS 7565 C', hex: '#8E6D32' }, { code: 'PMS 7566 C', hex: '#7C5D2A' }, { code: 'PMS 7567 C', hex: '#684D23' }, { code: 'PMS 7568 C', hex: '#58411D' }, { code: 'PMS 7569 C', hex: '#FF9B00' }, { code: 'PMS 7570 C', hex: '#FF8700' }, { code: 'PMS 7571 C', hex: '#ED7600' }, { code: 'PMS 7572 C', hex: '#D66A00' }, { code: 'PMS 7573 C', hex: '#BA5B00' }, { code: 'PMS 7574 C', hex: '#A35000' }, { code: 'PMS 7575 C', hex: '#8E4500' }, { code: 'PMS 7576 C', hex: '#CD7F32' }, { code: 'PMS 7577 C', hex: '#B36D2E' }, { code: 'PMS 7578 C', hex: '#9E5B26' }, { code: 'PMS 7579 C', hex: '#DC5925' }, { code: 'PMS 7580 C', hex: '#C14E1D' }, { code: 'PMS 7581 C', hex: '#A34316' }, { code: 'PMS 7582 C', hex: '#8E3A13' }, { code: 'PMS 7583 C', hex: '#963914' }, { code: 'PMS 7584 C', hex: '#863312' }, { code: 'PMS 7585 C', hex: '#772D10' }, { code: 'PMS 7586 C', hex: '#68270E' }, { code: 'PMS 7587 C', hex: '#5B220C' }, { code: 'PMS 7588 C', hex: '#4D1D0A' }, { code: 'PMS 7589 C', hex: '#411809' }, { code: 'PMS 7590 C', hex: '#F0583A' }, { code: 'PMS 7591 C', hex: '#DE4D33' }, { code: 'PMS 7592 C', hex: '#CD422B' }, { code: 'PMS 7593 C', hex: '#B33926' }, { code: 'PMS 7594 C', hex: '#9E3221' }, { code: 'PMS 7595 C', hex: '#8E2C1D' }, { code: 'PMS 7596 C', hex: '#7C2619' }, { code: 'PMS 7597 C', hex: '#D94931' }, { code: 'PMS 7598 C', hex: '#BF3F2B' }, { code: 'PMS 7599 C', hex: '#A33624' }, { code: 'PMS 7600 C', hex: '#8E2F20' }, { code: 'PMS 7601 C', hex: '#7C291C' }, { code: 'PMS 7602 C', hex: '#6B2317' }, { code: 'PMS 7603 C', hex: '#5B1E14' }, { code: 'PMS 7604 C', hex: '#F2D4CE' }, { code: 'PMS 7605 C', hex: '#E5BDB5' }, { code: 'PMS 7606 C', hex: '#D7A79E' }, { code: 'PMS 7607 C', hex: '#C2897D' }, { code: 'PMS 7608 C', hex: '#AE6E60' }, { code: 'PMS 7609 C', hex: '#9B5B4B' }, { code: 'PMS 7610 C', hex: '#884D3D' }, { code: 'PMS 7611 C', hex: '#D7B49B' }, { code: 'PMS 7612 C', hex: '#C59A7C' }, { code: 'PMS 7613 C', hex: '#AE8361' }, { code: 'PMS 7614 C', hex: '#9E714F' }, { code: 'PMS 7615 C', hex: '#8C6041' }, { code: 'PMS 7616 C', hex: '#7B5135' }, { code: 'PMS 7617 C', hex: '#6B452B' }, { code: 'PMS 7618 C', hex: '#CD6A4D' }, { code: 'PMS 7619 C', hex: '#B35B40' }, { code: 'PMS 7620 C', hex: '#9E4E37' }, { code: 'PMS 7621 C', hex: '#AF272F' }, { code: 'PMS 7622 C', hex: '#9E222A' }, { code: 'PMS 7623 C', hex: '#8C1F25' }, { code: 'PMS 7624 C', hex: '#7B1B20' }, { code: 'PMS 7625 C', hex: '#F0503D' }, { code: 'PMS 7626 C', hex: '#993134' }, { code: 'PMS 7627 C', hex: '#8C2D2E' }, { code: 'PMS 7628 C', hex: '#7B2729' }, { code: 'PMS 7629 C', hex: '#6B2223' }, { code: 'PMS 7630 C', hex: '#5B1D1D' }, { code: 'PMS 7631 C', hex: '#4D1818' }, { code: 'PMS 7632 C', hex: '#F2D3D8' }, { code: 'PMS 7633 C', hex: '#E5BBC5' }, { code: 'PMS 7634 C', hex: '#D7A5B1' }, { code: 'PMS 7635 C', hex: '#C18897' }, { code: 'PMS 7636 C', hex: '#AE6F7E' }, { code: 'PMS 7637 C', hex: '#9B5B6A' }, { code: 'PMS 7638 C', hex: '#884D59' }, { code: 'PMS 7639 C', hex: '#D81E5D' }, { code: 'PMS 7640 C', hex: '#BA194E' }, { code: 'PMS 7641 C', hex: '#A31544' }, { code: 'PMS 7642 C', hex: '#8E123B' }, { code: 'PMS 7643 C', hex: '#7C1033' }, { code: 'PMS 7644 C', hex: '#6B0D2C' }, { code: 'PMS 7645 C', hex: '#5B0B25' }, { code: 'PMS 7646 C', hex: '#A17D9B' }, { code: 'PMS 7647 C', hex: '#8C6686' }, { code: 'PMS 7648 C', hex: '#795171' }, { code: 'PMS 7649 C', hex: '#68415F' }, { code: 'PMS 7650 C', hex: '#58334F' }, { code: 'PMS 7651 C', hex: '#4D2943' }, { code: 'PMS 7652 C', hex: '#412338' }, { code: 'PMS 7653 C', hex: '#E9D6E1' }, { code: 'PMS 7654 C', hex: '#DBBCCB' }, { code: 'PMS 7655 C', hex: '#CE9FB6' }, { code: 'PMS 7656 C', hex: '#B87BA0' }, { code: 'PMS 7657 C', hex: '#A35D8A' }, { code: 'PMS 7658 C', hex: '#8E4B77' }, { code: 'PMS 7659 C', hex: '#7C4168' }, { code: 'PMS 7660 C', hex: '#8D82B6' }, { code: 'PMS 7661 C', hex: '#796EA3' }, { code: 'PMS 7662 C', hex: '#685C90' }, { code: 'PMS 7663 C', hex: '#5B5080' }, { code: 'PMS 7664 C', hex: '#4D446D' }, { code: 'PMS 7665 C', hex: '#413A5C' }, { code: 'PMS 7666 C', hex: '#37314D' }, { code: 'PMS 7667 C', hex: '#E7DCEB' }, { code: 'PMS 7668 C', hex: '#D8C6E0' }, { code: 'PMS 7669 C', hex: '#C9B0D4' }, { code: 'PMS 7670 C', hex: '#B396C4' }, { code: 'PMS 7671 C', hex: '#9E7FB3' }, { code: 'PMS 7672 C', hex: '#8E6EA3' }, { code: 'PMS 7673 C', hex: '#7C5E8E' }, { code: 'PMS 7674 C', hex: '#B6C4E1' }, { code: 'PMS 7675 C', hex: '#9BAECC' }, { code: 'PMS 7676 C', hex: '#8496B8' }, { code: 'PMS 7677 C', hex: '#6B7FA3' }, { code: 'PMS 7678 C', hex: '#586A8E' }, { code: 'PMS 7679 C', hex: '#4D5B7D' }, { code: 'PMS 7680 C', hex: '#414D6D' }, { code: 'PMS 7681 C', hex: '#A5BCD9' }, { code: 'PMS 7682 C', hex: '#8EA8C9' }, { code: 'PMS 7683 C', hex: '#7694BA' }, { code: 'PMS 7684 C', hex: '#607DA3' }, { code: 'PMS 7685 C', hex: '#4D688E' }, { code: 'PMS 7686 C', hex: '#1D4F91' }, { code: 'PMS 7687 C', hex: '#1D428A' }, { code: 'PMS 7688 C', hex: '#0096D6' }, { code: 'PMS 7689 C', hex: '#0084C9' }, { code: 'PMS 7690 C', hex: '#0076A8' }, { code: 'PMS 7691 C', hex: '#006692' }, { code: 'PMS 7692 C', hex: '#00587C' }, { code: 'PMS 7693 C', hex: '#004A67' }, { code: 'PMS 7694 C', hex: '#003D53' }, { code: 'PMS 7695 C', hex: '#D3E3EC' }, { code: 'PMS 7696 C', hex: '#BBD3E1' }, { code: 'PMS 7697 C', hex: '#A4C3D5' }, { code: 'PMS 7698 C', hex: '#8DAFB8' }, { code: 'PMS 7699 C', hex: '#779AAB' }, { code: 'PMS 7700 C', hex: '#638699' }, { code: 'PMS 7701 C', hex: '#517488' }, { code: 'PMS 7702 C', hex: '#00B0CA' }, { code: 'PMS 7703 C', hex: '#009EB4' }, { code: 'PMS 7704 C', hex: '#008C9F' }, { code: 'PMS 7705 C', hex: '#007797' }, { code: 'PMS 7706 C', hex: '#00677F' }, { code: 'PMS 7707 C', hex: '#005869' }, { code: 'PMS 7708 C', hex: '#004A56' }, { code: 'PMS 7709 C', hex: '#CCEBEF' }, { code: 'PMS 7710 C', hex: '#B2E2E8' }, { code: 'PMS 7711 C', hex: '#009CA6' }, { code: 'PMS 7712 C', hex: '#008C95' }, { code: 'PMS 7713 C', hex: '#007377' }, { code: 'PMS 7714 C', hex: '#006167' }, { code: 'PMS 7715 C', hex: '#006167' }, { code: 'PMS 7716 C', hex: '#00A4A6' }, { code: 'PMS 7717 C', hex: '#009496' }, { code: 'PMS 7718 C', hex: '#008486' }, { code: 'PMS 7719 C', hex: '#007375' }, { code: 'PMS 7720 C', hex: '#006466' }, { code: 'PMS 7721 C', hex: '#005557' }, { code: 'PMS 7722 C', hex: '#004749' }, { code: 'PMS 7723 C', hex: '#00AD91' }, { code: 'PMS 7724 C', hex: '#00966C' }, { code: 'PMS 7725 C', hex: '#00845B' }, { code: 'PMS 7726 C', hex: '#00734B' }, { code: 'PMS 7727 C', hex: '#00643D' }, { code: 'PMS 7728 C', hex: '#005531' }, { code: 'PMS 7729 C', hex: '#004727' }, { code: 'PMS 7730 C', hex: '#009245' }, { code: 'PMS 7731 C', hex: '#007A3E' }, { code: 'PMS 7732 C', hex: '#006432' }, { code: 'PMS 7733 C', hex: '#00552B' }, { code: 'PMS 7734 C', hex: '#004724' }, { code: 'PMS 7735 C', hex: '#003B1F' }, { code: 'PMS 7736 C', hex: '#00311B' }, { code: 'PMS 7737 C', hex: '#63AF41' }, { code: 'PMS 7738 C', hex: '#4A773C' }, { code: 'PMS 7739 C', hex: '#43972A' }, { code: 'PMS 7740 C', hex: '#3E8324' }, { code: 'PMS 7741 C', hex: '#4C8C2B' }, { code: 'PMS 7742 C', hex: '#417A24' }, { code: 'PMS 7743 C', hex: '#386A1F' }, { code: 'PMS 871 C', hex: '#84754E' }, { code: 'PMS 872 C', hex: '#85714D' }, { code: 'PMS 873 C', hex: '#866D4B' }, { code: 'PMS 874 C', hex: '#8E6E4F' }, { code: 'PMS 875 C', hex: '#895C48' }, { code: 'PMS 876 C', hex: '#8A5D44' }, { code: 'PMS 877 C', hex: '#8A8D8F' }, { code: 'PMS 801 C', hex: '#0091CF' }, { code: 'PMS 802 C', hex: '#44D62C' }, { code: 'PMS 803 C', hex: '#FFEA29' }, { code: 'PMS 804 C', hex: '#FFAB3F' }, { code: 'PMS 805 C', hex: '#FF5F58' }, { code: 'PMS 806 C', hex: '#FF3EB5' }, { code: 'PMS 807 C', hex: '#FF0092' }, { code: 'PMS White', hex: '#FFFFFF' }
];

interface MatchResult {
  code: string;
  hex: string;
  distance: number;
}

export const PantoneMatch: React.FC<PantoneMatchProps> = ({ onClose }) => {
  const { t } = useAppContext();
  const [inputColor, setInputColor] = useState('#3B82F6'); 
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [eyeDropperSupported, setEyeDropperSupported] = useState(false);

  useEffect(() => {
    if ('EyeDropper' in window) setEyeDropperSupported(true);
  }, []);

  const handleEyeDropper = async () => {
    if (!window.EyeDropper) return;
    try {
      const result = await new (window as any).EyeDropper().open();
      setInputColor(result.sRGBHex);
    } catch (e) {
      console.log('EyeDropper canceled');
    }
  };

  useEffect(() => {
    if (!/^#[0-9A-F]{6}$/i.test(inputColor)) return;
    const inputLab = hexToLab(inputColor);
    const results = pantoneDataset.map(p => {
      const targetLab = hexToLab(p.hex);
      return { ...p, distance: calculateDeltaE(inputLab, targetLab) };
    }).sort((a, b) => a.distance - b.distance);
    setMatches(results.slice(0, 4));
  }, [inputColor]);

  const getAccuracyLabel = (deltaE: number) => {
    if (deltaE < 2.3) return { text: "مطابق تماماً", color: "text-green-500" };
    if (deltaE < 5) return { text: "مطابق جيداً", color: "text-blue-500" };
    if (deltaE < 10) return { text: "مطابق مقبول", color: "text-yellow-500" };
    return { text: "تقريبي", color: "text-orange-500" };
  };

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
      <div className="px-5 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="text-cyan-600 dark:text-cyan-400 p-1.5 bg-cyan-100/50 dark:bg-cyan-900/20 rounded-lg">
            <SwatchIcon className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-wide">{t.pmsTitle}</h2>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-full transition-all">
            <BackIcon className="w-5 h-5 rtl:rotate-180" />
          </button>
        )}
      </div>

      <div className="p-6 md:p-10 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 space-y-6">
           <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-4 block">{t.pmsInputLabel}</label>
              <div className="flex flex-col gap-4">
                 <div className="w-full h-32 rounded-2xl shadow-inner border border-slate-200 dark:border-slate-700 relative overflow-hidden group transition-all" style={{ backgroundColor: inputColor }}>
                    <input type="color" value={inputColor} onChange={e => setInputColor(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                 </div>
                 {eyeDropperSupported && (
                    <button onClick={handleEyeDropper} className="w-full py-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 hover:border-cyan-500 dark:hover:border-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all flex items-center justify-center gap-2 font-bold text-sm">
                      <EyeDropperIcon className="w-5 h-5" />
                      <span>التقاط من الشاشة</span>
                    </button>
                 )}
                 <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">HEX</span>
                    <input type="text" value={inputColor} onChange={e => setInputColor(e.target.value)} placeholder={t.pmsInputPlaceholder} className="w-full pl-14 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-mono uppercase focus:ring-2 focus:ring-cyan-500 outline-none" maxLength={7} />
                 </div>
              </div>
           </div>
        </div>

        <div className="flex-1 space-y-6">
           {matches.length > 0 && (
             <div className="space-y-6">
                <div>
                   <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider">{t.pmsBestMatch}</h3>
                   <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col sm:flex-row">
                      <div className="w-full sm:w-48 h-48 sm:h-auto" style={{ backgroundColor: matches[0].hex }}></div>
                      <div className="p-6 flex-1 flex flex-col justify-center">
                         <div className="mb-4">
                            <h4 className="text-3xl font-black text-slate-800 dark:text-white mb-1">{matches[0].code}</h4>
                            <div className="flex items-center gap-3">
                               <p className="text-slate-400 font-mono text-sm">{matches[0].hex}</p>
                               <span className={`text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 ${getAccuracyLabel(matches[0].distance).color}`}>
                                  {getAccuracyLabel(matches[0].distance).text} (ΔE {matches[0].distance.toFixed(2)})
                               </span>
                            </div>
                         </div>
                         <div className="flex gap-3">
                            <button onClick={() => navigator.clipboard.writeText(matches[0].code)} className="px-4 py-2 bg-cyan-50 dark:bg-cyan-900/20 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 rounded-lg text-sm font-bold transition-colors">نسخ كود بانتون</button>
                            <button onClick={() => navigator.clipboard.writeText(matches[0].hex)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold transition-colors">نسخ HEX</button>
                         </div>
                         <div className="mt-5">
                             <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                                <span>دقة المطابقة</span>
                                <span>{Math.max(0, 100 - (matches[0].distance * 2.5)).toFixed(0)}%</span>
                             </div>
                             <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-500 ${matches[0].distance < 3 ? 'bg-green-500' : matches[0].distance < 7 ? 'bg-blue-500' : 'bg-orange-500'}`} style={{ width: `${Math.max(5, 100 - (matches[0].distance * 2.5))}%` }}></div>
                             </div>
                         </div>
                      </div>
                   </div>
                </div>

                <div>
                   <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider">{t.pmsOtherMatches}</h3>
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {matches.slice(1, 4).map((match, idx) => (
                         <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden group hover:shadow-md transition-all">
                            <div className="h-24 w-full" style={{ backgroundColor: match.hex }}></div>
                            <div className="p-4">
                               <h5 className="font-bold text-slate-800 dark:text-white mb-1 text-sm">{match.code}</h5>
                               <div className="flex justify-between items-center mb-2">
                                  <span className="text-xs font-mono text-slate-400">{match.hex}</span>
                                  <span className="text-[10px] text-slate-400">ΔE {match.distance.toFixed(1)}</span>
                                </div>
                                <button onClick={() => navigator.clipboard.writeText(match.code)} className="w-full text-xs bg-slate-50 dark:bg-slate-800 py-2 rounded text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold">{t.pmsCopy}</button>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
