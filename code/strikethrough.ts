/** Combining marks used by the strikethrough variants. */
export const CROSS_OUT_MARKS = {
  short: '\u0335',       // COMBINING SHORT STROKE OVERLAY
  long: '\u0336',        // COMBINING LONG STROKE OVERLAY
  shortSlash: '\u0337',  // COMBINING SHORT SOLIDUS OVERLAY
  longSlash: '\u0338',   // COMBINING LONG SOLIDUS OVERLAY
} as const;

export type CrossOutStyle = keyof typeof CROSS_OUT_MARKS;

const CROSS_OUT_PATTERN = /[\u0335-\u0338]/gu;
const graphemeSegmenter = new Intl.Segmenter(undefined, {
  granularity: 'grapheme',
});

/** Remove this module's stroke and solidus overlay marks from text. */
export function removeCrossOutMarks(text: string): string {
  return text.replace(CROSS_OUT_PATTERN, '');
}

/** Apply one combining overlay to each non-whitespace grapheme cluster. */
export function applyOverlay(
  text: string,
  style: CrossOutStyle = 'long',
): string {
  const cleanText = removeCrossOutMarks(text);
  const mark = CROSS_OUT_MARKS[style];

  return Array.from(
    graphemeSegmenter.segment(cleanText),
    ({ segment }) => (/^\s+$/u.test(segment) ? segment : segment + mark),
  ).join('');
}
