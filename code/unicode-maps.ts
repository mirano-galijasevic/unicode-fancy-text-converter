import { applyOverlay } from './strikethrough';

// ─── Lookup arrays (each index = letter A-Z or a-z offset) ────────────────────

const MATH_BOLD_UPPER = [...'𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙'];
const MATH_BOLD_LOWER = [...'𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳'];
const MATH_BOLD_DIGIT = [...'𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗'];

const MATH_ITALIC_UPPER = [...'𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍'];
const MATH_ITALIC_LOWER = [...'𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧'];

const MATH_BOLD_ITALIC_UPPER = [...'𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁'];
const MATH_BOLD_ITALIC_LOWER = [...'𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛'];

const MATH_SCRIPT_UPPER = [...'𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵'];
const MATH_SCRIPT_LOWER = [...'𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏'];

const MATH_BOLD_SCRIPT_UPPER = [...'𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩'];
const MATH_BOLD_SCRIPT_LOWER = [...'𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃'];

const MATH_FRAKTUR_UPPER = [...'𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ'];
const MATH_FRAKTUR_LOWER = [...'𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷'];

const MATH_DBL_STRUCK_UPPER = [...'𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ'];
const MATH_DBL_STRUCK_LOWER = [...'𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫'];
const MATH_DBL_STRUCK_DIGIT = [...'𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡'];

const MATH_SANS_UPPER = [...'𝖠𝖡𝖢𝖣𝖤𝖥𝖦𝖧𝖨𝖩𝖪𝖫𝖬𝖭𝖮𝖯𝖰𝖱𝖲𝖳𝖴𝖵𝖶𝖷𝖸𝖹'];
const MATH_SANS_LOWER = [...'𝖺𝖻𝖼𝖽𝖾𝖿𝗀𝗁𝗂𝗃𝗄𝗅𝗆𝗇𝗈𝗉𝗊𝗋𝗌𝗍𝗎𝗏𝗐𝗑𝗒𝗓'];

const MATH_SANS_BOLD_UPPER = [...'𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭'];
const MATH_SANS_BOLD_LOWER = [...'𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇'];
const MATH_SANS_BOLD_DIGIT = [...'𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵'];

const MATH_SANS_ITALIC_UPPER = [...'𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡'];
const MATH_SANS_ITALIC_LOWER = [...'𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻'];

const MATH_MONO_UPPER = [...'𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉'];
const MATH_MONO_LOWER = [...'𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣'];
const MATH_MONO_DIGIT = [...'𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿'];

const FULLWIDTH_UPPER = [...'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ'];
const FULLWIDTH_LOWER = [...'ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ'];
const FULLWIDTH_DIGIT = [...'０１２３４５６７８９'];

const BUBBLE_UPPER = [...'ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ'];
const BUBBLE_LOWER = [...'ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ'];
const BUBBLE_DIGIT  = [...'⓪①②③④⑤⑥⑦⑧⑨'];

const SMALL_CAPS_MAP: Record<string, string> = {
  a:'ᴀ', b:'ʙ', c:'ᴄ', d:'ᴅ', e:'ᴇ', f:'ꜰ', g:'ɢ', h:'ʜ', i:'ɪ', j:'ᴊ',
  k:'ᴋ', l:'ʟ', m:'ᴍ', n:'ɴ', o:'ᴏ', p:'ᴘ', q:'ǫ', r:'ʀ', s:'ꜱ', t:'ᴛ',
  u:'ᴜ', v:'ᴠ', w:'ᴡ', x:'x',  y:'ʏ', z:'ᴢ',
};

const SUPERSCRIPT_MAP: Record<string, string> = {
  '0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹',
  a:'ᵃ', b:'ᵇ', c:'ᶜ', d:'ᵈ', e:'ᵉ', f:'ᶠ', g:'ᵍ', h:'ʰ', i:'ⁱ', j:'ʲ',
  k:'ᵏ', l:'ˡ', m:'ᵐ', n:'ⁿ', o:'ᵒ', p:'ᵖ', r:'ʳ', s:'ˢ', t:'ᵗ', u:'ᵘ',
  v:'ᵛ', w:'ʷ', x:'ˣ', y:'ʸ', z:'ᶻ',
  A:'ᴬ', B:'ᴮ', D:'ᴰ', E:'ᴱ', G:'ᴳ', H:'ᴴ', I:'ᴵ', J:'ᴶ', K:'ᴷ', L:'ᴸ',
  M:'ᴹ', N:'ᴺ', O:'ᴼ', P:'ᴾ', R:'ᴿ', T:'ᵀ', U:'ᵁ', V:'ⱽ', W:'ᵂ',
  '+':'⁺', '-':'⁻', '=':'⁼', '(':'⁽', ')':'⁾',
};

const FLIP_MAP: Record<string, string> = {
  a:'ɐ', b:'q', c:'ɔ', d:'p', e:'ǝ', f:'ɟ', g:'ƃ', h:'ɥ', i:'ᴉ', j:'ɾ',
  k:'ʞ', l:'l', m:'ɯ', n:'u', o:'o', p:'d', q:'b', r:'ɹ', s:'s', t:'ʇ',
  u:'n', v:'ʌ', w:'ʍ', x:'x', y:'ʎ', z:'z',
  A:'∀', B:'ᗺ', C:'Ɔ', D:'ᗡ', E:'Ǝ', F:'Ⅎ', G:'⅁', H:'H', I:'I', J:'ᒋ',
  K:'ʞ', L:'⅂', M:'W', N:'N', O:'O', P:'Ԁ', Q:'Ό', R:'ᴚ', S:'S', T:'⊥',
  U:'∩', V:'Λ', W:'M', X:'X', Y:'ʎ', Z:'Z',
  '0':'0','1':'Ɩ','2':'ᄅ','3':'Ɛ','4':'ㄣ','5':'ϛ','6':'9','7':'L','8':'8','9':'6',
  '!':'¡','?':'¿',',':'\'',' ':' ','(':')',')'  :'(','.':'˙',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapWithArrays(
  ch: string,
  upper: string[],
  lower: string[],
  digits?: string[],
): string {
  const c = ch.codePointAt(0)!;
  if (c >= 65 && c <= 90) return upper[c - 65] ?? ch;
  if (c >= 97 && c <= 122) return lower[c - 97] ?? ch;
  if (digits && c >= 48 && c <= 57) return digits[c - 48] ?? ch;
  return ch;
}

// ─── Core transform ───────────────────────────────────────────────────────────

export interface GlitchOptions {
  intensity?: number; // marks stacked per side, default 1 (matches the original fixed-intensity output)
  above?: boolean; // default true
  below?: boolean; // default true
}

export interface TransformOptions {
  glitch?: GlitchOptions;
}

export function transformChar(ch: string, styleId: string, options?: TransformOptions): string {
  switch (styleId) {
    case 'bold':
      return mapWithArrays(ch, MATH_BOLD_UPPER, MATH_BOLD_LOWER, MATH_BOLD_DIGIT);

    case 'italic':
      return mapWithArrays(ch, MATH_ITALIC_UPPER, MATH_ITALIC_LOWER);

    case 'bold-italic':
      return mapWithArrays(ch, MATH_BOLD_ITALIC_UPPER, MATH_BOLD_ITALIC_LOWER);

    case 'cursive':
      return mapWithArrays(ch, MATH_SCRIPT_UPPER, MATH_SCRIPT_LOWER);

    case 'bold-cursive':
      return mapWithArrays(ch, MATH_BOLD_SCRIPT_UPPER, MATH_BOLD_SCRIPT_LOWER);

    case 'gothic':
      return mapWithArrays(ch, MATH_FRAKTUR_UPPER, MATH_FRAKTUR_LOWER);

    case 'double-struck':
      return mapWithArrays(ch, MATH_DBL_STRUCK_UPPER, MATH_DBL_STRUCK_LOWER, MATH_DBL_STRUCK_DIGIT);

    case 'sans-serif':
      return mapWithArrays(ch, MATH_SANS_UPPER, MATH_SANS_LOWER);

    case 'sans-bold':
      return mapWithArrays(ch, MATH_SANS_BOLD_UPPER, MATH_SANS_BOLD_LOWER, MATH_SANS_BOLD_DIGIT);

    case 'sans-italic':
      return mapWithArrays(ch, MATH_SANS_ITALIC_UPPER, MATH_SANS_ITALIC_LOWER);

    case 'monospace':
      return mapWithArrays(ch, MATH_MONO_UPPER, MATH_MONO_LOWER, MATH_MONO_DIGIT);

    case 'fullwidth': {
      const c = ch.codePointAt(0)!;
      if (c >= 65 && c <= 90) return FULLWIDTH_UPPER[c - 65];
      if (c >= 97 && c <= 122) return FULLWIDTH_LOWER[c - 97];
      if (c >= 48 && c <= 57) return FULLWIDTH_DIGIT[c - 48];
      if (c === 32) return '\u3000';
      return ch;
    }

    case 'bubble':
      return mapWithArrays(ch, BUBBLE_UPPER, BUBBLE_LOWER, BUBBLE_DIGIT);

    case 'small-caps':
      return SMALL_CAPS_MAP[ch.toLowerCase()] ?? ch;

    case 'superscript':
      return SUPERSCRIPT_MAP[ch] ?? ch;

    case 'strikethrough':
      return applyOverlay(ch);

    case 'underline':
      return ch === ' ' ? ch : ch + '\u0332';

    case 'double-underline':
      return ch === ' ' ? ch : ch + '\u0333';

    case 'wavy':
      return ch === ' ' ? ch : ch + '\u0330';

    case 'upside-down':
      return FLIP_MAP[ch] ?? ch;

    case 'glitch': {
      if (ch === ' ') return ch;
      const aboveMarks = ['\u0300','\u0301','\u0302','\u0308','\u030A','\u0307','\u030E','\u030D','\u0311'];
      const belowMarks = ['\u0316','\u0317','\u0318','\u031C','\u0325','\u0332','\u0323'];
      const { intensity = 1, above = true, below = true } = options?.glitch ?? {};
      const code = ch.codePointAt(0)!;
      let result = ch;
      if (above) {
        for (let i = 0; i < intensity; i++) {
          result += aboveMarks[(code + i) % aboveMarks.length];
        }
      }
      if (below) {
        for (let i = 0; i < intensity; i++) {
          result += belowMarks[(code + i) % belowMarks.length];
        }
      }
      return result + '\u0488';
    }

    default:
      return ch;
  }
}

export function transformText(text: string, styleId: string, options?: TransformOptions): string {
  if (styleId === 'strikethrough') {
    return applyOverlay(text);
  }
  if (styleId === 'upside-down') {
    return [...text].map(ch => transformChar(ch, 'upside-down')).reverse().join('');
  }
  return [...text].map(ch => transformChar(ch, styleId, options)).join('');
}
