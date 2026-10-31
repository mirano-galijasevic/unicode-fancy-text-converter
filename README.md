<div align="center">

# Unicode Fancy Text Converter in TypeScript

**Zero-dependency examples for turning ordinary text into bold, cursive, Gothic, monospace, circled, underlined, strikethrough, and other copy-and-paste Unicode styles.**

[Try the live Fancy Text Generator](https://www.tryfancytext.com) · [Browse the converter](code/unicode-maps.ts) · [See grapheme-aware strikethrough](code/strikethrough.ts)

`Hello 2026` → `𝐇𝐞𝐥𝐥𝐨 𝟐𝟎𝟐𝟔` · `𝓗𝓮𝓵𝓵𝓸 2026` · `𝙷𝚎𝚕𝚕𝚘 𝟸𝟶𝟸𝟼`

</div>

---

This repository contains small, readable TypeScript snippets extracted from the Unicode conversion logic behind [Try Fancy Text](https://www.tryfancytext.com). The examples show how a Unicode text converter can produce styled text that users can copy and paste into social profiles, messages, documents, and other applications.

The output is real Unicode text-not CSS and not a custom font. Each supported ASCII letter or digit is replaced with a visually related Unicode character, or decorated with a combining mark.

## Style examples

| Style | `Fancy Text 123` becomes |
| --- | --- |
| Bold | 𝐅𝐚𝐧𝐜𝐲 𝐓𝐞𝐱𝐭 𝟏𝟐𝟑 |
| Italic | 𝐹𝑎𝑛𝑐𝑦 𝑇𝑒𝑥𝑡 123 |
| Cursive / script | ℱ𝒶𝓃𝒸𝓎 𝒯ℯ𝓍𝓉 123 |
| Gothic / Fraktur | 𝔉𝔞𝔫𝔠𝔶 𝔗𝔢𝔵𝔱 123 |
| Double-struck | 𝔽𝕒𝕟𝕔𝕪 𝕋𝕖𝕩𝕥 𝟙𝟚𝟛 |
| Monospace | 𝙵𝚊𝚗𝚌𝚢 𝚃𝚎𝚡𝚝 𝟷𝟸𝟹 |
| Fullwidth | Ｆａｎｃｙ　Ｔｅｘｔ　１２３ |
| Circled | Ⓕⓐⓝⓒⓨ Ⓣⓔⓧⓣ ①②③ |
| Small caps | ꜰᴀɴᴄʏ ᴛᴇxᴛ 123 |
| Strikethrough | F̶a̶n̶c̶y̶ T̶e̶x̶t̶ 1̶2̶3̶ |

Want to generate and copy these styles without writing code? Use the [online fancy text converter](https://www.tryfancytext.com).

## Quick start

Copy the [`code`](code) snippets into a TypeScript project and import the functions directly:

```ts
import { transformChar, transformText } from './unicode-maps';

transformChar('A', 'bold');
// → "𝐀"

transformText('Hello 123', 'bold');
// → "𝐇𝐞𝐥𝐥𝐨 𝟏𝟐𝟑"

transformText('Hello', 'cursive');
// → "ℋℯ𝓁𝓁ℴ"

transformText('Hello', 'strikethrough');
// → "H̶e̶l̶l̶o̶"
```

Available style IDs are:

```text
bold          italic          bold-italic     cursive
bold-cursive  gothic          double-struck   sans-serif
sans-bold     sans-italic     monospace        fullwidth
bubble        small-caps      superscript      strikethrough
underline     double-underline wavy            upside-down
glitch
```

For lookup-table styles, unsupported characters pass through unchanged, so punctuation, whitespace, emoji, and letters outside the tables are preserved. Combining-mark effects intentionally decorate supported and unsupported visible characters alike.

## How the conversion works

### Styled alphabets use explicit lookup tables

Unicode's Mathematical Alphanumeric Symbols and related blocks are not perfectly contiguous. Some script, Fraktur, and double-struck letters use older code points elsewhere in Unicode. Explicit arrays make those exceptions visible and avoid relying on unsafe arithmetic assumptions.

[`transformChar()`](code/unicode-maps.ts) selects a lookup table for one character. [`transformText()`](code/unicode-maps.ts) walks through the input and applies that transformation to the complete string. The file includes tables for uppercase letters, lowercase letters, and-where Unicode provides them-digits.

In simplified form:

```ts
const BOLD_UPPER = [...'𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙'];

function toBold(ch: string): string {
  const codePoint = ch.codePointAt(0)!;
  return codePoint >= 65 && codePoint <= 90
    ? BOLD_UPPER[codePoint - 65]
    : ch;
}
```

### Strikethrough uses a combining character

Unicode strikethrough uses **U+0336 COMBINING LONG STROKE OVERLAY**. The converter delegates this style to the grapheme-aware helper in [`code/strikethrough.ts`](code/strikethrough.ts), so complete emoji and accented characters are kept together.

```ts
import { applyOverlay } from './strikethrough';

const crossedOut = applyOverlay('Hello');
```

If you only need copy-ready output, use the [online strikethrough text generator](https://www.tryfancytext.com/strikethrough) instead.

The helper:

- segments text into user-perceived characters with `Intl.Segmenter`;
- adds one overlay per grapheme instead of per UTF-16 code unit;
- provides short stroke, long stroke, short slash, and long slash variants; and
- removes existing cross-out marks before applying a new variant.

```ts
import { applyOverlay, removeCrossOutMarks } from './strikethrough';

const crossedOut = applyOverlay('Café 👩‍💻', 'long');
const restored = removeCrossOutMarks(crossedOut);
```

Grapheme segmentation matters for emoji sequences, flags, skin-tone modifiers, and letters built from a base character plus combining accents. Adding a mark to every UTF-16 code unit can split those sequences and produce broken output.

## Unicode length is not JavaScript string length

JavaScript's `string.length` counts UTF-16 code units. Many Unicode characters occupy two code units, so styled text and emoji can appear longer than expected:

```ts
'A'.length;  // 1
'𝐀'.length; // 2, but it is one Unicode code point
```

[`code/unicode-length.ts`](code/unicode-length.ts) includes compact helpers that count and clip by code point:

```ts
export function codePointLength(value: string) {
  return [...value].length;
}
```

Code-point counting is useful for many limits, but it is still different from counting grapheme clusters. Use `Intl.Segmenter` when the goal is to count what a person perceives as a single character.

## Project files

| File | Purpose |
| --- | --- |
| [`code/unicode-maps.ts`](code/unicode-maps.ts) | Unicode lookup tables plus `transformChar()` and `transformText()` |
| [`code/strikethrough.ts`](code/strikethrough.ts) | Grapheme-aware overlay application and removal utilities |
| [`code/unicode-length.ts`](code/unicode-length.ts) | Code-point-aware length and clipping helpers |

These files are intentionally small and framework-independent. They can be adapted for a browser, Node.js, React, Next.js, or another TypeScript application without bringing along an entire web app.

## Compatibility and limitations

- Unicode text appearance varies by operating system, font, browser, and application.
- Some platforms may show missing-character boxes or fall back to a different font.
- These symbols are visually styled characters; they do not carry the same semantics as HTML `<strong>`, `<em>`, or `<s>` elements.
- Screen readers and search systems may pronounce or interpret mathematical symbols differently from ordinary letters. Keep plain text available when accessibility or discoverability matters.
- Small caps, superscript, and upside-down alphabets are approximations because Unicode does not contain a matching character for every letter.
- Normalization, sanitization, or character limits on a destination platform may change the result.

For those reasons, fancy Unicode text works best as a decorative copy-and-paste effect-not as a replacement for semantic formatting in long-form content.

## Why this code is public

Unicode conversion data is widely available. The useful part of an open implementation is that its behavior is transparent: the exact mappings can be inspected, edge cases can be discussed, and compatibility tradeoffs are documented honestly. This repository is a focused reference extracted from a larger product, not an npm package at this time.

Contributions that improve mappings, Unicode documentation, grapheme handling, or edge-case coverage are welcome.

## License

Released under the [MIT License](LICENSE).
