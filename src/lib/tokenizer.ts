/**
 * Утилиты токенизации — реализация в браузере на чистом TypeScript.
 *
 * Поддерживаются четыре уровня:
 *   1. word  — разбиение по пробелам и пунктуации
 *   2. char  — посимвольное разбиение
 *   3. bpe   — упрощённый Byte Pair Encoding (учебная реализация)
 *   4. wordpiece — упрощённый WordPiece (как в BERT, учебная реализация)
 *
 * ВАЖНО: это учебные реализации, не production-качества. Их цель —
 * показать механику алгоритма, а не скорость или покрытие Unicode.
 */

export type TokenType = "word" | "char" | "bpe" | "wordpiece";

export type Token = {
  /** Сам текст токена */
  text: string;
  /** ID в словаре (для word/char — индекс в vocab; для bpe/wordpiece — id из merges) */
  id: number;
  /** Каким алгоритмом получен */
  type: TokenType;
};

// ---------- 1. WORD TOKENIZER ----------
// Простейший разбиение: по пробелам + отделяем пунктуацию.

const WORD_REGEX = /([\p{L}\p{N}]+|[^\s\p{L}\p{N}])/gu;

const DEFAULT_WORD_VOCAB: string[] = [
  // Служебные
  "<PAD>", "<UNK>",
  // Частые слова русского и английского
  "привет", "мир", "машинное", "обучение", "модель", "токен",
  "токенизация", "текст", "слово", "символ", "вес", "ошибка",
  "hello", "world", "machine", "learning", "model", "token",
  "the", "a", "an", "is", "are", "and", "or",
  // Частые знаки
  ",", ".", "!", "?", ":", ";", "-", "—",
];

export function tokenizeWord(text: string): Token[] {
  const vocab = new Map<string, number>();
  DEFAULT_WORD_VOCAB.forEach((w, i) => vocab.set(w, i));
  const unkId = vocab.get("<UNK>") ?? 1;

  const matches = text.match(WORD_REGEX) ?? [];
  return matches.map((m) => {
    const lower = m.toLowerCase();
    const id = vocab.get(lower);
    return {
      text: m,
      id: id !== undefined ? id : unkId,
      type: "word" as const,
    };
  });
}

// ---------- 2. CHAR TOKENIZER ----------
// По символам. Словарь — Unicode code points (упрощённо).

export function tokenizeChar(text: string): Token[] {
  const unkId = 1;
  // ID = code point символа. Если code point > 256 — помечаем как <UNK>.
  return Array.from(text).map((ch) => {
    const code = ch.codePointAt(0) ?? 0;
    return {
      text: ch,
      id: code < 0x3000 ? code : unkId,
      type: "char" as const,
    };
  });
}

// ---------- 3. BPE (Byte Pair Encoding) ----------
// Учебная реализация: заранее заданные merges + vocab.
// В production BPE обучается на корпусе, здесь — фиксированный набор.

// Обучающий «корпус» — на нём были «обучены» merges (упрощённо).
const BPE_BASE_VOCAB: string[] = [
  "<PAD>", "<UNK>", "<BOS>", "<EOS>",
  // Базовые подслова — символы (латиница + кириллица + частые знаки)
  ...("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"),
  ...("абвгдежзийклмнопрстуфхцчшщъыьэюяАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"),
  " ", ",", ".", "!", "?",
];

// Обученные merges — пары, которые алгоритм решил слить.
// Каждая строка — "a b" означает «заменить пару (a, b) на ab».
// Порядок важен: первые сливаются раньше.
const BPE_MERGES: string[] = [
  "t h", "t h e", "i n", "i n g",
  "a n d", "r e", "e r", "o n",
  "t o", "e d", "a t", "i t",
  "h e", "s t", "o u", "l e",
  "p r", "p r e", "e n", "a r",
  // Русские слияния
  "о с", "о с т", "о с т ь",
  "н о", "н о с", "н о с т",
  "н о с т ь",
  "п р", "п р и", "п р и в", "п р и в е", "п р и в е т",
  "м о", "м о д", "м о д е", "м о д е л", "м о д е л ь",
  "т о", "т о к", "т о к е", "т о к е н",
  "м и", "м и р",
  "м а", "м а ш", "м а ш и", "м а ш и н", "м а ш и н н",
  "м а ш и н н о", "м а ш и н н о е",
  "о б", "о б у", "о б у ч", "о б у ч е", "о б у ч е н",
  "о б у ч е н и", "о б у ч е н и е",
];

function bpeVocabMap(): Map<string, number> {
  const map = new Map<string, number>();
  // Базовые символы
  BPE_BASE_VOCAB.forEach((s, i) => map.set(s, i));
  // Слитые пары добавляются как новые токены
  let nextId = BPE_BASE_VOCAB.length;
  for (const merge of BPE_MERGES) {
    const merged = merge.replace(/\s+/g, "");
    if (!map.has(merged)) {
      map.set(merged, nextId++);
    }
  }
  return map;
}

const BPE_VOCAB_MAP = bpeVocabMap();

/**
 * Применяет BPE к одному слову (без пробелов).
 * Возвращает массив подслов.
 */
export function bpeEncodeWord(word: string): string[] {
  if (!word) return [];
  // Если слово целиком в словаре — возвращаем одним токеном
  if (BPE_VOCAB_MAP.has(word)) return [word];

  // Разбиваем на символы и постепенно сливаем по merges
  let symbols = Array.from(word);
  if (symbols.length === 0) return [];

  // Ищем подходящий merge по приоритету
  let changed = true;
  while (symbols.length > 1 && changed) {
    changed = false;
    // Проходим по merges в порядке приоритета
    for (const merge of BPE_MERGES) {
      const parts = merge.split(/\s+/);
      if (parts.length < 2) continue;
      // Ищем первую пару (parts[0], parts[1]) в symbols
      // и заменяем на parts[0]+parts[1]
      for (let i = 0; i < symbols.length - 1; i++) {
        if (symbols[i] === parts[0] && symbols[i + 1] === parts[1]) {
          symbols = [...symbols.slice(0, i), parts[0] + parts[1], ...symbols.slice(i + 2)];
          changed = true;
          break;
        }
      }
      if (changed) break;
    }
  }

  // Если после всех merges остался 1 символ и его нет в словаре — это <UNK>
  return symbols;
}

export function tokenizeBpe(text: string): Token[] {
  const unkId = BPE_VOCAB_MAP.get("<UNK>") ?? 1;
  // Предварительное разбиение: по пробелам, но сохраняем границы слов
  // BPE обычно работает на отдельных словах, потом добавляет специальные </w> маркеры.
  // Здесь для простоты — разбиваем по пробелам, каждое слово кодируем отдельно.
  const words = text.split(/(\s+)/).filter((s) => s.length > 0);
  const tokens: Token[] = [];
  for (const w of words) {
    if (/^\s+$/.test(w)) {
      // Пробел — отдельный токен
      const id = BPE_VOCAB_MAP.get(" ");
      tokens.push({ text: "·", id: id !== undefined ? id : unkId, type: "bpe" });
      continue;
    }
    const subwords = bpeEncodeWord(w);
    for (const sw of subwords) {
      const id = BPE_VOCAB_MAP.get(sw);
      tokens.push({
        text: sw,
        id: id !== undefined ? id : unkId,
        type: "bpe",
      });
    }
  }
  return tokens;
}

// ---------- 4. WORDPIECE ----------
// Отличия от BPE:
//   - вместо пробелов между частями используется "##" префикс
//   - vocab обучается иначе (максимизирует likelihood, а не частоту пар)
// Учебная реализация — фиксированный vocab.

const LATIN_CHARS = "abcdefghijklmnopqrstuvwxyz".split("");
const CYRILLIC_CHARS = "абвгдежзийклмнопрстуфхцчшщъыьэюя".split("");

const WORDPIECE_VOCAB: string[] = [
  "<PAD>", "<UNK>", "<CLS>", "<SEP>", "<MASK>",
  // Латиница
  ...LATIN_CHARS,
  // Кириллица
  ...CYRILLIC_CHARS,
  // ## — продолжения слова (после первой буквы)
  ...LATIN_CHARS.map((c) => "##" + c),
  ...CYRILLIC_CHARS.map((c) => "##" + c),
  // Частые подслова
  "##the", "##ing", "##ed", "##er", "##ion", "##est",
  "##ост", "##ость", "##ение", "##ение", "##ова", "##тель",
  "##ение", "ность", "##ность", "привет", "##вет",
  "токен", "##ен", "токенизация",
  "модель", "##ель", "обучение",
  "мир", "##ир",
  "машинное", "##инное", "##ное",
  // Пунктуация
  ",", ".", "!", "?", ":", ";",
];

const WORDPIECE_MAP = new Map<string, number>(WORDPIECE_VOCAB.map((s, i) => [s, i]));

export function wordpieceEncodeWord(word: string): string[] {
  if (!word) return [];
  const lower = word.toLowerCase();
  if (WORDPIECE_MAP.has(lower)) return [lower];

  // Жадный разбор слева направо: первая часть — без ##, остальные — с ##
  const tokens: string[] = [];
  let start = 0;
  let isLast = false;
  while (start < lower.length) {
    let end = lower.length;
    let curSubstring = "";
    while (start < end) {
      const sub = lower.substring(start, end);
      const candidate = start === 0 ? sub : "##" + sub;
      if (WORDPIECE_MAP.has(candidate)) {
        curSubstring = candidate;
        isLast = start === 0 ? false : isLast;
        break;
      }
      end--;
    }
    if (!curSubstring) {
      // Если не нашли ни одного совпадения — это <UNK>
      return ["<UNK>"];
    }
    tokens.push(curSubstring);
    start = end;
  }
  return tokens;
}

export function tokenizeWordpiece(text: string): Token[] {
  const unkId = WORDPIECE_MAP.get("<UNK>") ?? 1;
  // WordPiece обычно предваряется разбиением на слова
  const words = text.match(/([\p{L}\p{N}]+|[^\s\p{L}\p{N}])/gu) ?? [];
  const tokens: Token[] = [];
  for (const w of words) {
    const parts = wordpieceEncodeWord(w);
    for (const p of parts) {
      const id = WORDPIECE_MAP.get(p);
      tokens.push({
        text: p,
        id: id !== undefined ? id : unkId,
        type: "wordpiece",
      });
    }
  }
  return tokens;
}

// ---------- ФАСАД ----------

export function tokenize(text: string, type: TokenType): Token[] {
  switch (type) {
    case "word":
      return tokenizeWord(text);
    case "char":
      return tokenizeChar(text);
    case "bpe":
      return tokenizeBpe(text);
    case "wordpiece":
      return tokenizeWordpiece(text);
  }
}

export const TOKENIZER_LABELS: Record<TokenType, string> = {
  word: "Слова (word)",
  char: "Символы (char)",
  bpe: "BPE (подслова)",
  wordpiece: "WordPiece (BERT)",
};

export const TOKENIZER_DESCRIPTIONS: Record<TokenType, string> = {
  word: "Разбивает текст по пробелам и пунктуации. Просто, но vocab огромный и много <UNK>.",
  char: "Каждый символ — отдельный токен. Маленький vocab, но очень длинные последовательности.",
  bpe: "Баланс: частые пары символов сливаются в подслова. Используется в GPT-2, GPT-4, Llama.",
  wordpiece: "Похож на BPE, но с ## префиксом. Используется в BERT и DistilBERT.",
};

// Палитра для подсветки токенов в песочнице
export const TOKEN_COLORS: string[] = [
  "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700/60",
  "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300 dark:bg-fuchsia-900/40 dark:text-fuchsia-200 dark:border-fuchsia-700/60",
  "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/40 dark:text-rose-200 dark:border-rose-700/60",
  "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-700/60",
  "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/40 dark:text-orange-200 dark:border-orange-700/60",
  "bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/40 dark:text-teal-200 dark:border-teal-700/60",
  "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-700/60",
  "bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-900/40 dark:text-pink-200 dark:border-pink-700/60",
  "bg-lime-100 text-lime-800 border-lime-300 dark:bg-lime-900/40 dark:text-lime-200 dark:border-lime-700/60",
  "bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-900/40 dark:text-cyan-200 dark:border-cyan-700/60",
];
