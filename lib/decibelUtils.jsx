
// Decibel Utils
// File containing utility functions and variables used to convert numbers 
// to a decibel (dB), percentage or ratio values.

// Disclaimer
// The MOTU Interface and API uses Decibel Amplitude Ratio as value for the faders.
// So, for example, 6 dB is equal to an Amplitude Ratio of 1.995

// Faders go from -6dB to 6dB, for a total of 25 steps including half dB (like 4.5dB)
export const faderMin = -6;
export const faderMax = 6;


/**
 * Convert Decibel value to **Amplitude Ratio**.
 * - 6 dB = 20 * log10(1.995)
 * - 1.995 = 10^(6/20)
 * - amplitudeRatio = 10^(dB / 20)
 * 
 * Sources: 
 * - https://en.wikipedia.org/wiki/Decibel
 * - https://dsp.stackexchange.com/questions/22962/decibels-conversion-into-amplitude-ratio
 * @param {Float} db Decibel value
 * @returns A Decibel Amplitude Ratio value as float
 */
export function dbToAmplitudeRatio(db) {
  return Math.pow(10, (db / 20));
}


/**
 * Convert Amplitude Ratio value to Decibel value.
 * - 6 dB = 20 * log10(1.995)
 * - dB = 20 * log10(amplitudeRatio)
 * 
 * Sources: 
 * - https://en.wikipedia.org/wiki/Decibel
 * - https://dsp.stackexchange.com/questions/22962/decibels-conversion-into-amplitude-ratio
 * @param {Float} amplitudeRatio Amplitude Ratio value
 * @returns Decibel value
 */
export function amplitudeRatioToDb(amplitudeRatio) {
  return 20 * Math.log10(amplitudeRatio);
}


/**
 * Given a number `x` (value of the fader), find in what percentage (0% -> 100%) it lands between
 * two number (the minimum and maximum value of the fader, -6 and 6).
 * 
 * For example: Between -6 and 6, 0 is at the 50%, -6 is at 0%, 6 is at 100%.
 * @param {Float} x - Value of the fader 
 * @param {Float} min - Smallest of the 2 numbers range, default `faderMin`
 * @param {Float} max - Biggest of the 2 numbers range, default `faderMax`
 * @returns 
 */
export function percentageInRange(x, min = faderMin, max = faderMax) {
  const proportion = (x - min) / (max - min);
  return proportion * 100;
}
