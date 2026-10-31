export function codePointLength(value: string) {
  return [...value].length;
}

export function clipToCodePoints(value: string, max: number) {
  return [...value].slice(0, Math.max(0, max)).join('');
}
