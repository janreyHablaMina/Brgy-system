// Brgy. Salaza, Palauig, Zambales Coordinates
export const SALAZA_CENTER: [number, number] = [15.4542, 119.9553];

// Approximate boundary for Brgy. Salaza (Refined to stay South of Pangolingan)
export const SALAZA_BOUNDARY: [number, number][] = [
  [15.466, 119.945], // North West
  [15.466, 119.980], // North East (Stay below Pangolingan)
  [15.455, 120.010], // Far East (Towards Mt. Tapulao)
  [15.435, 120.010], // South East
  [15.435, 119.970], // South
  [15.445, 119.945], // South West
];

export const MOCK_DISTRICTS = [
  { pos: [15.460, 119.960] as [number, number], color: '#10b981' }, // Green (Success/Safe)
  { pos: [15.445, 119.975] as [number, number], color: '#f43f5e' }, // Red (Attention/Warning)
  { pos: [15.450, 119.955] as [number, number], color: '#3b82f6' }, // Blue (General)
];

export const MOCK_RESIDENT_PINS: [number, number][] = [
  [15.458, 119.952],
  [15.452, 119.965],
  [15.448, 119.958],
  [15.455, 119.970],
];
